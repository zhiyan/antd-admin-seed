import {
  GET_CONSUMER_LIST_SUCCESS,
  OFFLINE_CONSUMER_SUCCESS
} from '../actions/consumer';

const initialState = {
  list:{}
};

export default function auth(state = initialState, action = {}) {
  switch (action.type) {
   
    case GET_CONSUMER_LIST_SUCCESS:
      return Object.assign({}, state, { list: action.payload.data })

    case OFFLINE_CONSUMER_SUCCESS:
      let list = state.list.list.filter(function(value) {
        if (value.eid !== action.meta.eid) {
          return value
        }
      })
      if(action.meta.cb){
        action.meta.cb(action.payload)
      }
      list = Object.assign({}, state.list, {list:list})
      return !action.payload.ret ? state : Object.assign({}, state, { list: list })

    default:
      return state;
  }
}
