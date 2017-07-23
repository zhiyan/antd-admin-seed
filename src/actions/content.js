import api from '../api'

export const GET_CONTENT_LIST_SUCCESS = 'GET_CONTENT_LIST_SUCCESS'
export const DEL_CONTENT_SUCCESS = 'DEL_CONTENT_SUCCESS'

export function getContentList(currentPage,pageSize) {
  return {
    type: 'GET_CONTENT_LIST',
    payload: {
      promise: api.post('/content/list',{
        data:{currentPage:currentPage, pageSize:pageSize}
      })
    }
  }
}

export function getContent(id, cb) {
  return {
    type: 'GET_CONTENT',
    payload: {
      promise: api.post('/content/detail', {
        data: {id:id}
      }).then(cb || function() {})
    }
  }
}

export function addContent(data, cb) {
  return {
    type: 'ADD_CONTENT',
    payload: {
      promise: api.post('/content/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function editContent(data, cb) {
  return {
    type: 'EDIT_CONTENT',
    payload: {
      promise: api.post('/content/update', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function delContent(id, cb) {
  return {
    type: 'DEL_CONTENT',
    meta: { id: id, cb: cb },
    payload: {
      promise: api.post('/content/del', {
        data: { id: id }
      })
    }
  }
}
