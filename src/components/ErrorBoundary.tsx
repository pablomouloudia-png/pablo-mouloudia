import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] my-8 max-w-2xl mx-auto bg-slate-900 border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Une erreur est survenue lors de l'affichage</h2>
          <p className="text-xs text-slate-400 max-w-md">
            Un problème s'est produit dans l'affichage. Vous pouvez réessayer ou recharger l'application.
          </p>
          {this.state.error && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-red-300 max-w-lg overflow-x-auto text-left w-full">
              {this.state.error.message}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              Réessayer
            </button>
            <button
              onClick={this.handleReset}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recharger la page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
