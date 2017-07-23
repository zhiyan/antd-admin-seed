import api from '../api'

export const GET_CHART_SUCCESS = 'GET_CHART_SUCCESS'

export function getChart(data) {
  return {
    type: 'GET_CHART',
    payload: {
      promise: api.post('/chart/chart')
    }
  }
}