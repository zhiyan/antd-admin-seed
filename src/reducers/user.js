import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  FETCH_PROFILE_PENDING,
  FETCH_PROFILE_SUCCESS,
  GET_USER_LIST_SUCCESS,
  DEL_USER_SUCCESS,
  UPDATE_PASSWORD_SUCCESS
} from '../actions/user';

const initialState = {
  roles: [],
  account:'',
  loggingIn: false,
  loggingOut: false,
  loginErrors: null,
  list:{}
};

export default function auth(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_PENDING:
      return Object.assign({}, initialState, {loggingIn: true});
    case LOGIN_SUCCESS:
      if(!action.payload.ret){
        return {
          ...state,
          loggingIn: false,
          user: null,
          loginErrors: action.payload.errmsg
        } 
      }
      return Object.assign({}, state, {user: action.payload.data.account, loggingIn: false, loginErrors: null});
    case LOGIN_ERROR:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginErrors: action.payload.errmsg
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null,
        loginErrors: null
      };
      
    case FETCH_PROFILE_SUCCESS:
      const roles = action.payload.data.map((item) => {return {label:item.name, value:item.id}})
      return Object.assign({}, state, {roles, loggingIn: false, loginErrors: null});

    case GET_USER_LIST_SUCCESS:
      return Object.assign({}, state, { list: action.payload.data })

    case DEL_USER_SUCCESS:
      let list = state.list.list.filter(function(value) {
        if (value.uid !== action.meta.uid) {
          return value
        }
      })
      if(action.meta.cb){
        action.meta.cb(action.payload)
      }
      list = Object.assign({}, state.list, {list:list})
      return !action.payload.ret ? state : Object.assign({}, state, { list: list })

    case UPDATE_PASSWORD_SUCCESS:
      if(action.meta.cb){
        action.meta.cb(action.payload)
      }
      return state
    default:
      return state;
  }
}
