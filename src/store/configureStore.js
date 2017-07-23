import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'

import promiseMiddleware from '../middlewares/promiseMiddleware'

import user from '../reducers/user'
import menu from '../reducers/menu'
import member from '../reducers/member'
import content from '../reducers/content'
import log from '../reducers/log'
import upkeep from '../reducers/upkeep'
import shop from '../reducers/shop'
import consumer from '../reducers/consumer'
import rent from '../reducers/rent'
import product from '../reducers/product'
import equip from '../reducers/equip'
import order from '../reducers/order'
import province from '../reducers/province'
import chart from '../reducers/chart'

const reducer = combineReducers({user, menu, member, content, log, upkeep, shop, consumer, rent, product, equip, order, province, chart})

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})
)(createStore)

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState)
}
