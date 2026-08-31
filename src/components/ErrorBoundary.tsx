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
        <div className="min-h-screen bg-[#14161A] text-gray-200 font-mono flex items-center justify-center p-6 select-none">
          <div className="max-w-2xl w-full bg-[#1D2026] border border-red-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Header / Status Bar */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                  SYSTEM EXCEPTION DETECTED
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">StudioZIO DSP Runtime</span>
            </div>

            {/* Error Content */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Application Exception Handled
              </h2>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                A non-fatal rendering exception occurred within the web application interface. The underlying DSP state has been safely isolated.
              </p>

              {/* Console Output Terminal */}
              <div className="bg-[#14161A] border border-gray-800 rounded-xl p-4 text-xs font-mono text-red-300 overflow-x-auto space-y-2">
                <div className="text-gray-500">// Stack Trace Exception:</div>
                <div className="text-red-400 font-semibold">{this.state.error?.toString() || 'Unknown Application Error'}</div>
                {this.state.errorInfo && (
                  <pre className="text-[11px] text-gray-500 leading-tight whitespace-pre-wrap mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between">
              <button
                onClick={this.handleReset}
                className="px-6 py-2.5 rounded-xl bg-[#22D3EE] text-[#14161A] font-bold text-xs uppercase tracking-wider hover:bg-[#22D3EE]/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-2 focus:ring-offset-[#14161A]"
              >
                Reload Application Engine
              </button>
              <span className="text-xs text-gray-500 font-sans">
                Error Code: <code className="text-[#F5A524]">DSP_GUI_ERR_0x99</code>
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
