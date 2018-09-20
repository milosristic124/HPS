import { createStore } from 'redux';
import createReducers from './src/redux/reducers';

function configureStore() {
  const store = createStore( createReducers() );

  return store;
}

module.exports = configureStore;
