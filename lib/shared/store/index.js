const { createStore, compose } = require('redux');

const reducer = require('../reducer/rootReducer');

module.exports = (state) => {
  const composeEnhancers = (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

  const store = createStore(
    reducer,
    state,
    composeEnhancers()
  );

  return store;
};
