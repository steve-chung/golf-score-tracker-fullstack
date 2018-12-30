import rootReducer from './reducers'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import requestMiddleware from './middleware/requestMiddleware'

export function configureStore() {

  const store = createStore(rootReducer, compose(applyMiddleware(thunk, requestMiddleware ), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))
      // enable thunk to the rootReducer to add function to the reducers
  return store
}
