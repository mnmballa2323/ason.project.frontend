import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// ============================================================
// Error Boundary — Catches React Rendering Errors
// Liberty Center One — ZERO EXTERNAL APIs
// ============================================================

interface Props {
    children: ReactNode;
    fallbackTitle?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });
        // Log to structured logger (no external services)
        console.error('[ErrorBoundary] Caught error:', {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            deployment: 'Liberty Center One',
        });
    }

    private handleRetry = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    public render(): ReactNode {
        if (this.state.hasError && this.state.error) {
            return (
                <SystemCrash
                    error={this.state.error}
                    resetErrorBoundary={this.handleRetry}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * HOC wrapper for functional components.
 * Usage: const SafeComponent = withErrorBoundary(MyComponent, "Component Name");
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallbackTitle?: string
): React.FC<P> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const WithBoundary: React.FC<P> = (props) => (
        <ErrorBoundary fallbackTitle={fallbackTitle || `${displayName} Error`}>
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );

    WithBoundary.displayName = `withErrorBoundary(${displayName})`;
    return WithBoundary;
}

export default ErrorBoundary;
