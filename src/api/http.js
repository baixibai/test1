import axios from 'axios';
import { MessageBox } from 'element-ui';

let apiUrl = process.env.Url;
axios.defaults.timeout = 20000;
axios.defaults.baseURL = apiUrl;

const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
    if (pending[key] && isRequest) {
        pending[key]('request')   //取消重复请求
    }
    delete pending[key]
}
const getRequestIdentify = (config, isReuest = false) => {
    let url = config.url
    if (isReuest) {
        url = config.baseURL + config.url.substring(1, config.url.length)
    }
    return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

//http request 拦截器
axios.interceptors.request.use(
  config => {
      // 拦截重复请求(即当前正在进行的相同请求)
        let requestData = getRequestIdentify(config, true)
        removePending(requestData, true)

        config.cancelToken = new CancelToken((c) => {
          pending[requestData] = c
        })
        config.data = JSON.stringify(config.data);
        // config.headers = {
        //   'Content-Type':'application/json;charset=UTF-8'
        // }
    // if(token){
    //   config.params = {'token':token}
    // }
        return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const loginurl = process.env.Loginurl+'/login'
//http response 拦截器
let httpfrist = 1

let pagecodearr = [17705,12655,12656,13514,12664,11148,10621]
axios.interceptors.response.use(
  response => {
    // 把已经完成的请求从 pending 中移除
    let requestData = getRequestIdentify(response.config)
    removePending(requestData)
    const res = {
        error_code: 0,
        error_msg: '',
        data: {}
    }
    if (response.status === 200 && typeof response.data === 'object') {
        res.error_code = parseInt(response.data.error_code, 10)
        res.error_msg = response.data.error_msg
        res.data = response.data.data
        if(res.data == null){
          res.data = {}
        }
        if (res.error_code === 11052 || res.error_code === 11051
            || res.error_code === 11050) {
            MessageBox(response.data.error_msg, '提示', {
              confirmButtonText: '确定',
              showClose: true
            }).then(() => {
              window.location.href = loginurl + '?from='+location.href
            }).catch(action => {
              window.location.href = loginurl + '?from='+location.href
            });
            res.error_msg = response.data.error_msg
        } else if (res.error_code === 10001) {
            res.error_msg = res.error_msg || '操作失败！'
            MessageBox(res.error_msg, '提示', {
              confirmButtonText: '确定',
              showClose: true
            }).then(() => {

            }).catch(action => {

            });
            if (res.data && typeof res.data === 'string') {
                const tipArr = res.data.replace(/\s/g, '').split(':')
                if (tipArr && tipArr.length === 2) {
                    res.error_msg = `${tipArr[0].substring(tipArr[0].indexOf('(') + 1, tipArr[0].indexOf(')'))}应该为${tipArr[1]}`
                }
            }
        } else if (res.error_code === 10003) {
            MessageBox(response.data.error_msg, '提示', {
              confirmButtonText: '确定',
              showClose: false
            }).then(() => {
              // window.location.href = loginurl
            }).catch(action => {

            });
        } else if (pagecodearr.indexOf(res.error_code)>-1) {
            res.error_msg = res.error_msg
            // 判断特有的错误码，在页面中要显示交互的
        } else if (res.error_code === 0) {
            res.error_msg = '操作成功！'
        } else {
            res.error_msg = response.data.error_msg
            MessageBox(response.data.error_msg, '提示', {
              confirmButtonText: '确定',
              showClose: false
            }).then(() => {

            }).catch(action => {

            });
        }
    } else if (response.status === 200 && typeof response.data !== 'object') {
        if(response.headers.download_file){
          
        }else {
          res.error_code = 500
          res.error_msg = '请求异常, 请刷新或联系系统管理员！'
          MessageBox(res.error_msg, '提示', {
              confirmButtonText: '确定',
              showClose: false
          }).then(() => {
  
          }).catch(action => {
  
          });
        }
    } else {
        res.error_code = response.status
        res.error_msg = '系统或网络异常, 请检查网络并联系系统管理员！'
        MessageBox(res.error_msg, '提示', {
            confirmButtonText: '确定',
            showClose: false
        }).then(() => {

        }).catch(action => {

        });
    }
    return res;
  },
  error => {
      if (error && error.response) {
          switch (error.response.status) {
              case 400:
                  error.message = '错误请求'
                  break
              case 401:
                  error.message = '未授权，请重新登录'
                  break
              case 403:
                  error.message = '拒绝访问'
                  break
              case 404:
                  error.message = '请求错误,未找到该资源'
                  break
              case 405:
                  error.message = '请求方法未允许'
                  break
              case 408:
                  error.message = '请求超时'
                  break
              case 500:
                  error.message = '服务器端出错'
                  break
              case 501:
                  error.message = '网络未实现'
                  break
              case 502:
                  error.message = '网络错误'
                  break
              case 503:
                  error.message = '服务不可用'
                  break
              case 504:
                  error.message = '网络异常'
                  break
              case 505:
                  error.message = 'http版本不支持该请求'
                  break
              default:
                  error.message = `连接错误${error.response.status}`
          }
          MessageBox(error.message, '提示', {
              confirmButtonText: '确定',
              showClose: false
          }).then(() => {

          }).catch(action => {

          });
      }else{
          if(error.message=='request'){
              console.log(error.message)
          }else{
              httpfrist = httpfrist+1
              if(httpfrist<3){
                  MessageBox('请求超时，请检查网络', '提示', {
                      confirmButtonText: '确定',
                      showClose: false
                  }).then(() => {
                      httpfrist=1
                  }).catch(action => {
                      httpfrist=1
                  });
              }
          }
      }

    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={},isaccp){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
    .then(response => {
      resolve(response);
    })
    .catch(err => {
      if(isaccp){
        resolve(err);
      } else {
        reject(err)
      }
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(url,data = {}){
   return new Promise((resolve,reject) => {
      axios.post(url,data)
      .then(response => {
        resolve(response);
      },err => {
        reject(err)
      })
   })
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function delax(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.delete(url,data)
         .then(response => {
           resolve(response);
         },err => {
           reject(err)
         })
  })
}

/**
 * 封装同时请求多个api
 * @param axiosarr
 * @param data
 * @returns {Promise}
 */

export function axiosall(axiosarr,data = {}){
    return new Promise((resolve,reject) => {
        axios.all(axiosarr).then(axios.spread(function (userResp, reposResp) {
            // 上面两个请求都完成后，才执行这个回调方法
            console.log('User', userResp.data);
            console.log('Repositories', reposResp.data);
        }));
    })
}



