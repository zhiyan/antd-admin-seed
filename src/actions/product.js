import api from '../api'

export const GET_PRODUCT_LIST_SUCCESS = 'GET_PRODUCT_LIST_SUCCESS'
export const ONOFF_PRODUCT_SUCCESS = 'ONOFF_PRODUCT_SUCCESS'

export function getProductList(currentPage,pageSize) {
  return {
    type: 'GET_PRODUCT_LIST',
    payload: {
      promise: api.post('/product/list',{
        data:{currentPage:currentPage, pageSize:pageSize}
      })
    }
  }
}

export function getProduct(product, cb) {
  return {
    type: 'GET_PRODUCT',
    payload: {
      promise: api.post('/product/detail', {
        data: {product:product}
      }).then(cb || function() {})
    }
  }
}

export function addProduct(data, cb) {
  return {
    type: 'ADD_PRODUCT',
    payload: {
      promise: api.post('/product/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function editProduct(data, cb) {
  return {
    type: 'EDIT_PRODUCT',
    payload: {
      promise: api.post('/product/update', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function onOffProduct(product, onOff, cb) {
  return {
    type: 'ONOFF_PRODUCT',
    meta: { product: product, cb: cb },
    payload: {
      promise: api.post('/product/onOff', {
        data: { product: product, onOff }
      })
    }
  }
}
