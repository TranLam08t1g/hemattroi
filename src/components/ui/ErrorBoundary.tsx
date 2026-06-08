import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: '#0B0B10',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"JetBrains Mono", monospace',
              padding: '2rem',
              gap: '1.5rem',
            }}
          >
            <p style={{ color: '#FF3366', fontSize: '14px', letterSpacing: '0.2em' }}>
              RUNTIME ERROR
            </p>
            <p
              style={{
                color: '#4a4a5a',
                fontSize: '12px',
                maxWidth: '500px',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '12px 32px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '999px',
                background: 'transparent',
                color: '#00D4FF',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '11px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              Reload
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}