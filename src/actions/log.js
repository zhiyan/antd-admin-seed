import api from '../api'

export const GET_LOG_LIST_SUCCESS = 'GET_LOG_LIST_SUCCESS'

export function getLogList(data) {
  return {
    type: 'GET_LOG_LIST',
    payload: {
      promise: api.post('/log/list', {data: data})
    }
  }
}