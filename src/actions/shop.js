import api from '../api'

export const OFFLINE_SHOP_SUCCESS = 'OFFLINE_SHOP_SUCCESS'

export function getShop(id, cb) {
  return {
    type: 'GET_SHOP',
    payload: {
      promise: api.post('/shop/detail', {
        data: {id:id}
      }).then(cb || function() {})
    }
  }
}

export function addShop(data, cb) {
  return {
    type: 'ADD_SHOP',
    payload: {
      promise: api.post('/shop/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function editShop(data, cb) {
  return {
    type: 'EDIT_SHOP',
    payload: {
      promise: api.post('/shop/update', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function offlineShop(id, cb) {
  return {
    type: 'OFFLINE_SHOP',
    meta: { id: id, cb: cb },
    payload: {
      promise: api.post('/shop/offline', {
        data: {id:id}
      })
    }
  }
}
