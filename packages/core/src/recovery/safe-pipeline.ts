import { ASTBuilder } from '../ast';
import { StreamParser } from '../parser';
import type { ASTNode, RootNode } from '../ast';
import type { ParserOptions } from '../types';
import { RecoveryManager, type RecoveryConfig } from './recovery-manager';

type Listener = (ast: RootNode, dirty: ASTNode[]) => void;

export interface SafePipelineOptions extends ParserOptions {
  onError?: (error: Error) => void;
}

class SafeTexoPipeline {
  private parser: StreamParser;
  private builder: ASTBuilder;
  private listeners = new Set<Listener>();
  private recovery: RecoveryManager;
  private lastValidAST: RootNode;
  private dirty: ASTNode[] = [];

  constructor(options?: SafePipelineOptions & Partial<RecoveryConfig>) {
    this.recovery = new RecoveryManager(options);
    const config = this.recovery.getConfig();
    this.parser = new StreamParser({
      emitInlineTokens: options?.emitInlineTokens,
      maxBufferSize: config.maxBufferSize,
      onBufferOverflow: (position) => {
        config.onRecovery?.({
          type: 'buffer-overflow',
          message: 'Parser buffer exceeded limit. Forcing partial flush.',
          position,
          recoveryAction: 'Partial line emitted as paragraph and buffer reset.',
        });
      },
    });
    this.builder = new ASTBuilder({ recoveryManager: this.recovery });
    this.lastValidAST = this.builder.getTree();
  }

  push(chunk: unknown): void {
    try {
      const input = this.recovery.validateInput(chunk);
      if (!input) {
        return;
      }

      for (const token of this.parser.feed(input)) {
        this.builder.addToken(token);
      }
      this.publish();
    } catch {
      this.parser.reset();
      this.publishWithAST(this.lastValidAST);
    }
  }

  end(): void {
    try {
      for (const token of this.parser.flush()) {
        this.builder.addToken(token);
      }
      this.builder.handleStreamEnd();
      this.publish();
    } catch {
      this.publishWithAST(this.lastValidAST);
    }
  }

  getAST(): RootNode {
    return this.builder.getTree();
  }

  getDirtyNodes(): ASTNode[] {
    return this.dirty;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reset(): void {
    this.parser.reset();
    this.builder.reset();
    this.publish();
  }

  private publish(): void {
    const dirty = this.builder.getDirtyNodes();
    if (dirty.length === 0) {
      return;
    }

    const ast = this.builder.getTree();
    this.lastValidAST = ast;
    this.dirty = dirty;
    this.publishWithAST(ast);
    this.builder.clearDirtyNodes();
  }

  private publishWithAST(ast: RootNode): void {
    for (const listener of this.listeners) {
      listener(ast, this.dirty);
    }
  }
}

export function createSafePipeline(
  options?: SafePipelineOptions & Partial<RecoveryConfig>,
): SafeTexoPipeline {
  return new SafeTexoPipeline(options);
}
