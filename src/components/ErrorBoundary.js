import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRefresh() {
    window.location.reload();
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <h1 tabIndex="0">{t('errors.somethingWentWrong')}</h1>
          <p tabIndex="0">
            {this.state.error?.message || t('errors.unexpectedError')}
          </p>
          <button
            onClick={this.handleRefresh}
            aria-label={t('errors.refreshPageAriaLabel')}
            className="refresh-button"
          >
            {t('errors.refreshPage')}
          </button>
          <div className="sr-only" role="status">
            {t('errors.screenReaderMessage')}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(ErrorBoundary);
