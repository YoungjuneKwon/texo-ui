import type { ASTNode } from '@texo/core';
import type React from 'react';

export interface FallbackProps {
  node: ASTNode;
}

export interface DirectiveRendererProps {
  node: ASTNode;
  registry: ComponentRegistry;
  fallback?: React.ComponentType<FallbackProps>;
}

export interface NodeRendererProps {
  node: ASTNode;
  children?: React.ReactNode;
}

export interface ComponentRegistry {
  get(name: string): React.ComponentType<Record<string, unknown>> | undefined;
}
