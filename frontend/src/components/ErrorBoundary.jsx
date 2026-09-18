import React from "react";
import { RotateCcw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught a render error:", error, info);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const message =
      (this.state.error && this.state.error.message) || String(this.state.error);
    const stack = (this.state.error && this.state.error.stack) || "";

    return (
      <main className="dashboard-main flex min-h-screen items-start justify-center bg-stone-50 px-4 py-16 dark:bg-stone-950">
        <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
            Page error
          </p>
          <h1 className="mt-2 font-display text-2xl font-black text-stone-900 dark:text-stone-100">
            Something went wrong while rendering this page
          </h1>
          <p className="mt-3 font-sans text-sm leading-6 text-stone-600 dark:text-stone-300">
            The app caught an error and stopped the page to keep the rest of the
            workspace usable. The message below identifies what failed.
          </p>
          <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 p-4 font-mono text-xs leading-5 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            {message}
            {stack ? `\n\n${stack}` : ""}
          </pre>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
            >
              <RotateCcw className="h-4 w-4" />
              Reload page
            </button>
          </div>
        </div>
      </main>
    );
  }
}