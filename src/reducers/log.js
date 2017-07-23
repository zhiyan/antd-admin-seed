import {
  GET_LOG_LIST_SUCCESS
} from '../actions/log'

const initialState = {
  list: {}
}

export default function log(state = initialState, action = {}) {
  switch (action.type) {
    case GET_LOG_LIST_SUCCESS:
      return Object.assign({}, initialState, { list: action.payload.data })
  		
    default:
      return state
  }
}
