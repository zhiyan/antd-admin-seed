import {
    GET_CITY_SUCCESS
} from '../actions/province'

const initialState = {
  list: []
}

export default function log(state = initialState, action = {}) {
  switch (action.type) {
    case GET_CITY_SUCCESS:
      return Object.assign({}, initialState, { list: action.payload.data })
    default:
      return state
  }
}
