import api from '../api'

export const GET_MEMBER_LIST_SUCCESS = 'GET_MEMBER_LIST_SUCCESS'
export const DEL_MEMBER_SUCCESS = 'DEL_MEMBER_SUCCESS'

export function getMemberList(currentPage, pageSize) {
  return {
    type: 'GET_MEMBER_LIST',
    payload: {
      promise: api.post('/member/list', {
        data:{currentPage:currentPage, pageSize:pageSize}
      })
    }
  }
}

export function getMember(id, cb) {
  return {
    type: 'GET_MEMBER',
    payload: {
      promise: api.post('/member/detail', {
        data: {id:id}
      }).then(cb || function() {})
    }
  }
}

export function addMember(data, cb) {
  return {
    type: 'ADD_MEMBER',
    payload: {
      promise: api.post('/member/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function editMember(data, cb) {
  return {
    type: 'EDIT_MEMBER',
    payload: {
      promise: api.post('/member/update', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function delMember(id, cb) {
  return {
    type: 'DEL_MEMBER',
    meta: { id: id, cb: cb },
    payload: {
      promise: api.post('/member/del', {
        data: { id: id }
      })
    }
  }
}
