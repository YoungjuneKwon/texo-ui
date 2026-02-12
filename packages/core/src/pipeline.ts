import { ASTBuilder } from './ast';
import { StreamParser } from './parser';
import type { ASTNode, RootNode } from './ast';
import { RecoveryManager, type RecoveryConfig } from './recovery';
import type { ParserOptions } from './types';

type PipelineListener = (ast: RootNode, dirty: ASTNode[]) => void;

export interface PipelineOptions extends ParserOptions {
  recovery?: Partial<RecoveryConfig>;
}

export class TexoPipeline {
  private recoveryManager: RecoveryManager;
  private parser: StreamParser;
  private builder: ASTBuilder;
  private listeners = new Set<PipelineListener>();
  private lastDirtyNodes: ASTNode[] = [];

  constructor(options?: PipelineOptions) {
    this.recoveryManager = new RecoveryManager(options?.recovery);
    const recoveryConfig = this.recoveryManager.getConfig();
    this.parser = new StreamParser({
      emitInlineTokens: options?.emitInlineTokens,
      maxBufferSize: options?.maxBufferSize ?? recoveryConfig.maxBufferSize,
      onBufferOverflow: (position) => {
        recoveryConfig.onRecovery?.({
          type: 'buffer-overflow',
          message: 'Parser buffer exceeded limit. Forcing partial flush.',
          position,
          recoveryAction: 'Partial line emitted as paragraph and buffer reset.',
        });
      },
    });
    this.builder = new ASTBuilder({ recoveryManager: this.recoveryManager });
  }

  push(chunk: unknown): void {
    const input = this.recoveryManager.validateInput(chunk);
    if (!input) {
      return;
    }

    for (const token of this.parser.feed(input)) {
      this.builder.addToken(token);
    }
    this.publishIfDirty();
  }

  getAST(): RootNode {
    return this.builder.getTree();
  }

  getDirtyNodes(): ASTNode[] {
    return this.lastDirtyNodes.map((node) => ({
      ...node,
      children: node.children ? [...node.children] : undefined,
    }));
  }

  subscribe(listener: PipelineListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  end(): void {
    for (const token of this.parser.flush()) {
      this.builder.addToken(token);
    }
    this.builder.handleStreamEnd();
    this.publishIfDirty();
  }

  reset(): void {
    this.parser.reset();
    this.builder.reset();
    this.lastDirtyNodes = [];
    this.publishIfDirty();
  }

  private publishIfDirty(): void {
    const dirty = this.builder.getDirtyNodes();
    if (dirty.length === 0) {
      return;
    }

    this.lastDirtyNodes = dirty;
    const ast = this.builder.getTree();
    for (const listener of this.listeners) {
      listener(ast, dirty);
    }
    this.builder.clearDirtyNodes();
  }
}
