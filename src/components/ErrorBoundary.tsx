import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
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

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in StudioZIO Tempo Delay Application:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="shell py-20">
          <div className="panel-float p-8 grid gap-5">
            <p className="eyebrow eyebrow--muted m-0">StudioZIO runtime</p>
            <h2>Something in the interface stopped rendering</h2>
            <p className="lede">
              A rendering exception was caught before it could take the rest of the page down. Reload to
              start the interface again.
            </p>

            <div className="panel-inset p-4 font-mono text-xs text-muted-foreground overflow-x-auto">
              <p className="m-0 text-destructive">{this.state.error?.toString() || 'Unknown application error'}</p>
              {this.state.errorInfo ? (
                <pre className="mt-2 whitespace-pre-wrap leading-tight max-w-none">
                  {this.state.errorInfo.componentStack}
                </pre>
              ) : null}
            </div>

            <div>
              <button type="button" onClick={this.handleReset} className="btn btn-primary">
                Reload the interface
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
