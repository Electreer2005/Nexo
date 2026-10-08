// src/Components/ErrorBoundary/ErrorBoundary.jsx
import { Component } from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import './ErrorBoundary.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // En producción, acá podés reportar a Sentry/LogRocket.
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="error-boundary animate-fade-up" role="alert">
        <div className="error-boundary__icon" aria-hidden="true">
          <FaExclamationTriangle />
        </div>

        <h2 className="error-boundary__title">
          Algo salió mal
        </h2>

        <p className="error-boundary__text">
          Tuvimos un problema al cargar esta sección. Probá recargar
          o volver al inicio.
        </p>

        <details className="error-boundary__details">
          <summary>Ver detalles técnicos</summary>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
        </details>

        <div className="error-boundary__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={this.handleReset}
          >
            <FaRedo aria-hidden="true" /> Reintentar
          </button>
          <a href="/" className="btn btn--ghost">
            Ir al inicio
          </a>
        </div>
      </div>
    );
  }
}
