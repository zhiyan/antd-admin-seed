import {
  GET_UPKEEP_LIST_SUCCESS,
  ASSIGN_UPKEEP_SUCCESS,
  ALTER_UPKEEP_SUCCESS
} from '../actions/upkeep'

const initialState = {
  list: {}
}

export default function upkeep(state = initialState, action = {}) {
  switch (action.type) {
    case GET_UPKEEP_LIST_SUCCESS:
      return Object.assign({}, initialState, { list: action.payload.data })
    case ASSIGN_UPKEEP_SUCCESS:
      state.list.list.map(function(value) {
        if (value.id === action.meta.id) {
          value.serviceman = action.meta.serviceman
        }
        return value
      })
      if(action.meta.cb){
        action.meta.cb(action.payload)
      }
      return Object.assign({},state)
    case ALTER_UPKEEP_SUCCESS:
      state.list.list.map(function(value) {
        if (value.id === action.meta.id) {
          value.repairStatus = action.meta.repairStatus
        }
        return value
      })
      if(action.meta.cb){
        action.meta.cb(action.payload)
      }
      return Object.assign({},state)
    default:
      return state
  }
}
