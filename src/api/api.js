import superagent from 'superagent';
import {removeCookie} from '../utils'

const methods = [
  'get',
  'head',
  'post',
  'put',
  'del',
  'options',
  'patch'
];

class _Api {

  constructor(opts) {

    this.opts = opts || {};

    if (!this.opts.baseURI)
      throw new Error('baseURI option is required');

    methods.forEach(method =>
      this[method] = (path, { params, data, headers } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](this.opts.baseURI + path);

        if (params) {
          request.query(params);
        }

        if(headers){
          request.set(headers);
        }else if (this.opts.headers) {
          request.set(this.opts.headers);
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => {
          if(err){
            return reject(body || err)
          }else{
            if(body.errcode === -1){
              removeCookie('uid')
              removeCookie('company')
              window.location.href = '/login'
            }else{
              return resolve(body)
            }
          }
        });
      })
    );

  }

}

const Api = _Api;

export default Api;
