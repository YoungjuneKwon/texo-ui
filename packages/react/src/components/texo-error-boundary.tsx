import type { RootNode } from '@texo-ui/core';
import React from 'react';

export interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
  lastValidAST?: RootNode;
}

interface BoundaryState {
  error: Error | null;
}

function hasResetKeysChanged(
  prevKeys?: readonly unknown[],
  nextKeys?: readonly unknown[],
): boolean {
  if (prevKeys === nextKeys) {
    return false;
  }
  if (!prevKeys || !nextKeys) {
    return prevKeys !== nextKeys;
  }
  if (prevKeys.length !== nextKeys.length) {
    return true;
  }
  for (let idx = 0; idx < prevKeys.length; idx += 1) {
    if (!Object.is(prevKeys[idx], nextKeys[idx])) {
      return true;
    }
  }
  return false;
}

const DefaultErrorFallback = ({ error, reset }: ErrorFallbackProps): React.ReactElement => {
  return (
    <div className="texo-error-boundary" role="alert">
      <p>Texo renderer failed: {error.message}</p>
      <button type="button" onClick={reset}>
        Retry
      </button>
    </div>
  );
};

export class TexoErrorBoundary extends React.Component<{
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error) => void;
  lastValidAST?: RootNode;
  resetKeys?: readonly unknown[];
  children: React.ReactNode;
}> {
  state: BoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error): void {
    this.props.onError?.(error);
  }

  componentDidUpdate(prevProps: Readonly<typeof this.props>): void {
    if (this.state.error && hasResetKeysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.reset();
    }
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  render(): React.ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    const Fallback = this.props.fallback ?? DefaultErrorFallback;
    return (
      <Fallback
        error={this.state.error}
        reset={this.reset}
        lastValidAST={this.props.lastValidAST}
      />
    );
  }
}
