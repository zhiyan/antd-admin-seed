import {
  GET_CONTENT_LIST_SUCCESS,
  DEL_CONTENT_SUCCESS
} from '../actions/content'

const initialState = {
  list: {}
}

export default function content(state = initialState, action = {}) {
  switch (action.type) {
    case GET_CONTENT_LIST_SUCCESS:
      return Object.assign({}, initialState, { list: action.payload.data })
    case DEL_CONTENT_SUCCESS:
      let list = state.list.list.filter(function(value) {
        if (value.id !== action.meta.id) {
          return value
        }
      })
      if(action.meta.cb){
        action.meta.cb(action.payload)
      }
      list = Object.assign({}, state.list, {list:list})
      return !action.payload.ret ? state : Object.assign({}, state, { list: list })
    default:
      return state
  }
}
