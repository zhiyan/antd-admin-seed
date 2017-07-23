import api from '../api'

export const GET_UPKEEP_LIST_SUCCESS = 'GET_UPKEEP_LIST_SUCCESS'
export const ASSIGN_UPKEEP_SUCCESS = 'ASSIGN_UPKEEP_SUCCESS'
export const ALTER_UPKEEP_SUCCESS = 'ALTER_UPKEEP_SUCCESS'

export function getUpkeepList(params) {
  return {
    type: 'GET_UPKEEP_LIST',
    payload: {
      promise: api.post('/upkeep/list',{
        data:params
      })
    }
  }
}

export function getUpkeep(id, cb) {
  return {
    type: 'GET_UPKEEP',
    payload: {
      promise: api.post('/upkeep/detail', {
        data: {id:id}
      }).then(cb || function() {})
    }
  }
}

export function assignUpkeep(id, serviceman, cb) {
  return {
    type: 'ASSIGN_UPKEEP',
    meta: { id, serviceman, cb },
    payload: {
      promise: api.post('/upkeep/assign',{
        data:{id, serviceman}
      })
    }
  }
}

export function addUpkeep(data, cb) {
  return {
    type: 'ADD_UPKEEP',
    payload: {
      promise: api.post('/upkeep/add', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function editUpkeep(data, cb) {
  return {
    type: 'EDIT_UPKEEP',
    payload: {
      promise: api.post('/upkeep/update', {
        data: data
      }).then(cb || function() {})
    }
  }
}

export function alterUpkeep(id, repairStatus, cb) {
  return {
    type: 'ALTER_UPKEEP',
    meta: { id, repairStatus, cb },
    payload: {
      promise: api.post('/upkeep/update',{
        data:{id, repairStatus}
      })
    }
  }
}