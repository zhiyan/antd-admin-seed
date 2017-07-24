import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'

import promiseMiddleware from '../middlewares/promiseMiddleware'

import user from '../reducers/user'
import menu from '../reducers/menu'
import chart from '../reducers/chart'

const reducer = combineReducers({user, menu, chart})

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})
)(createStore)

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState)
}
