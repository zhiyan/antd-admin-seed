import api from '../api'

import {getCookie} from '../utils'

export const FETCH_PROFILE_PENDING = 'FETCH_PROFILE_PENDING'
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'

export const LOGIN_PENDING = 'LOGIN_PENDING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const GET_USER_LIST_SUCCESS = 'GET_USER_LIST_SUCCESS'
export const DEL_USER_SUCCESS = 'DEL_USER_SUCCESS'

export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS'

export function fetchProfile() {
    let uid = getCookie('uid');

    if (uid === undefined) {
        return {type: 'UID_NOT_FOUND'};
    }

    return {
        type: 'FETCH_PROFILE',
        payload: {
          promise: api.post('/roles/list')
        }
    }
}

export function login(account, accountType, password) {
  return {
      type: 'LOGIN',
      payload: {
        promise: api.post('/user/login', {
          data: {
            account: account,
            accountType: accountType,
            password: password
          }
        })
      }
  }
}

export function logout() {

    return {
        type: 'LOGOUT'
    }
}

export function getUserList(currentPage,pageSize) {
  return {
    type: 'GET_USER_LIST',
    payload: {
      promise: api.post('/user/list',{
        data:{currentPage:currentPage, pageSize:pageSize}
      })
    }
  }
}


export function getUser(id, cb) {
  return {
    type: 'GET_User',
    payload: {
      promise: api.post('/user/detail', {
        data: {id:id}
      }).then(cb || function() {})
    }
  }
}

export function addUser(data, cb) {
  return {
    type: 'ADD_USER',
    payload: {
      promise: api.post('/user/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function editUser(data, cb) {
  return {
    type: 'EDIT_USER',
    payload: {
      promise: api.post('/user/update', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function delUser(uid, cb) {
  return {
    type: 'DEL_USER',
    meta: { uid: uid, cb: cb },
    payload: {
      promise: api.post('/user/del', {
        data: { id: uid }
      })
    }
  }
}

export function updatePassword(newPassword, oldPassword, cb) {
  return {
    type: 'UPDATE_PASSWORD',
    meta: { cb: cb },
    payload: {
      promise: api.post('/user/updatePassword', {
        data: { oldPassword, newPassword }
      })
    }
  }
}
