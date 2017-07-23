import api from '../api'

export const GET_CITY_SUCCESS = 'GET_CITY_SUCCESS'
export function getCity() {
    return {
        type: 'GET_CITY',
        payload: {
            promise: api.post('/common/province')
        }
    }
}

export function getDistrict(cityCode, cb){
     return {
        type : 'GET_DISTRICT',
        payload:{
          promise : api.post('/common/district',{
            data : {cityCode : cityCode}
          }).then(cb || function() {})
        }
     }
}

