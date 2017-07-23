import {
  OFFLINE_SHOP_SUCCESS
} from '../actions/shop'

const initialState = {
  shop: {}
}

export default function member(state = initialState, action = {}) {
  switch (action.type) {
  	case OFFLINE_SHOP_SUCCESS:
      if(action.meta.cb){
        action.meta.cb(action.payload)
      }
      return !action.payload.ret ? state : Object.assign({}, state, { shop: {} })
    default:
      return state
  }
}
