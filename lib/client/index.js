const React = require('react');
const ReactDOM = require('react-dom');
const { BrowserRouter } = require('react-router-dom');
const { renderRoutes } = require('react-router-config');

class PieDom {
  static render(domId, routes) {
    const html = (
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    );

    ReactDOM.render(
      html,
      /* eslint-disable */
      document.getElementById(domId)
      /* eslint-enable */
    );
  }
}

module.exports = PieDom;
