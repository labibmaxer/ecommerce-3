import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // send to analytics/monitoring if available
    if (typeof console !== 'undefined') {
      console.error('ErrorBoundary caught an error:', error, info);
    }
  }

  reset() {
    this.setState({ hasError: false, error: null });
    // try a hard reload to recover from backend outage
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg,#09090b,#111827)',
          color: '#e5e7eb',
          padding: '24px'
        }}>
          <div style={{maxWidth: 720}}>
            <h2 style={{marginTop: 0}}>Something went wrong</h2>
            <p>
              The application encountered an unexpected error or the backend is
              unreachable. A reload will attempt to recover. If the problem
              persists, please try again later.
            </p>
            <div style={{display: 'flex', gap: 12, marginTop: 18}}>
              <button
                onClick={this.reset}
                style={{
                  background: '#10b981',
                  border: 'none',
                  padding: '10px 14px',
                  color: '#fff',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                Reload
              </button>
              <button
                onClick={() => window.open('/', '_self')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '10px 14px',
                  color: '#e5e7eb',
                  borderRadius: 8,
                  cursor: 'pointer'
                }}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
