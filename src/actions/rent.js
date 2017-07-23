import api from '../api'

export const GET_RENT_LIST_SUCCESS = 'GET_RENT_LIST_SUCCESS'
export const DEL_RENT_SUCCESS = 'DEL_RENT_SUCCESS'

export function getRentList(params) {
  return {
    type: 'GET_RENT_LIST',
    payload: {
      promise: api.post('/rent/list',{
        data:params
      })
    }
  }
}

export function getRent(id, cb) {
  return {
    type: 'GET_RENT',
    payload: {
      promise: api.post('/rent/detail', {
        data: {id:id}
      }).then(cb || function() {})
    }
  }
}

export function addRent(data, cb) {
  return {
    type: 'ADD_RENT',
    payload: {
      promise: api.post('/rent/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function editRent(data, cb) {
  return {
    type: 'EDIT_RENT',
    payload: {
      promise: api.post('/rent/update', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function delRent(id, cb) {
  return {
    type: 'DEL_RENT',
    meta: { id: id, cb: cb },
    payload: {
      promise: api.post('/rent/del', {
        data: { id: id }
      })
    }
  }
}
