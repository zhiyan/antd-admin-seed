import api from '../api'

export const GET_EQUIP_LIST_SUCCESS = 'GET_EQUIP_LIST_SUCCESS'
export const DEL_EQUIP_SUCCESS = 'DEL_EQUIP_SUCCESS'

export function getEquipList(currentPage, pageSize) {
  return {
    type: 'GET_EQUIP_LIST',
    payload: {
      promise: api.post('/equip/class/list', {
        data:{currentPage:currentPage, pageSize:pageSize}
      })
    }
  }
}

export function getEquip(id, cb) {
  return {
    type: 'GET_EQUIP',
    payload: {
      promise: api.post('/equip/class/detail', {
        data: {id:id}
      }).then(cb || function() {})
    }
  }
}

export function addEquip(data, cb) {
  return {
    type: 'ADD_EQUIP',
    payload: {
      promise: api.post('/equip/class/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function editEquip(data, cb) {
  return {
    type: 'EDIT_EQUIP',
    payload: {
      promise: api.post('/equip/class/update', {
        data: data
      }).then(cb || function() {})
    }
  }
}
