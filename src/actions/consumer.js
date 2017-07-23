import api from '../api'

export const GET_CONSUMER_LIST_SUCCESS = 'GET_CONSUMER_LIST_SUCCESS'
export const OFFLINE_CONSUMER_SUCCESS = 'OFFLINE_CONSUMER_SUCCESS'


export function getConsumerList(data) {
  return {
    type: 'GET_CONSUMER_LIST',
    payload: {
      promise: api.post('/consumer/list',{data:data})
    }
  }
}

export function offlineConsumer(eid, cb){
    return {
        type : 'OFFLINE_CONSUMER',
        meta: { eid, cb },
        payload :{
           promise : api.post('/consumer/makeOffline', {
            data:{ eid }
           })
        }
    }
}