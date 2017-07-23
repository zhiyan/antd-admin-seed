import {
  GET_PRODUCT_LIST_SUCCESS,
  ONOFF_PRODUCT_SUCCESS
} from '../actions/product'

const initialState = {
  list: {}
}

export default function product(state = initialState, action = {}) {
  let list = []
  switch (action.type) {
    case GET_PRODUCT_LIST_SUCCESS:
      return Object.assign({}, initialState, { list: action.payload.data })
    case ONOFF_PRODUCT_SUCCESS:
      list = Object.assign({}, state.list)
      list.list.forEach(function(value,key) {
        if (value.product === action.meta.product) {
          value.onOff = value.onOff === 1 ? 2 : 1
        }
      })
      if(action.meta.cb){
        action.meta.cb(action.payload)
      }
      return !action.payload.ret ? state : Object.assign({}, state, { list: list })
    default:
      return state
  }
}
