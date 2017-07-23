import {
  GET_EQUIP_LIST_SUCCESS
} from '../actions/equip'

const initialState = {
  list: {}
}

export default function equip(state = initialState, action = {}) {
  switch (action.type) {
    case GET_EQUIP_LIST_SUCCESS:
      return Object.assign({}, initialState, { list: action.payload.data })
    default:
      return state
  }
}
