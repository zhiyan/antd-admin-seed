import {
  GET_ORDER_LIST_SUCCESS
} from '../actions/order'

const initialState = {
  list: {}
}

export default function order(state = initialState, action = {}) {
  let list = []
  switch (action.type) {
    case GET_ORDER_LIST_SUCCESS:
      return Object.assign({}, initialState, { list: action.payload.data })
    default:
      return state
  }
}
