import api from '../api'

export const GET_ORDER_LIST_SUCCESS = 'GET_ORDER_LIST_SUCCESS'

export function getOrderList(params) {
  return {
    type: 'GET_ORDER_LIST',
    payload: {
      promise: api.post('/order/list',{
        data:params
      })
    }
  }
}

export function getOrder(orderNo, cb) {
  return {
    type: 'GET_ORDER',
    payload: {
      promise: api.post('/order/detail', {
        data: {orderNo}
      }).then(cb || function() {})
    }
  }
}

export function addOrder(data, cb) {
  return {
    type: 'ADD_ORDER',
    payload: {
      promise: api.post('/order/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}
