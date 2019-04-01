import axios from 'axios';
/**
 * 封装http请求
 * 
 * @param {HOST} [HOST=location.origin] 接口地址主机名
 * @return {void} 
 * 
 * @example
 *  main.js
 *    import Vue from 'vue'
 *    import service from '@/plugins/service'
 *    Vue.use(service);
 * 
 *  组件中
 *    this.$post(url='', params={}, headers={}, doTransformRequest=true)
 *  
 */

function install(Vue, options) {
  Vue.prototype.$get = (url) => {
    return axios({
      url: url,
      method: 'get'
    })
  };

  Vue.prototype.$post = (url, params={}, headers = {}, doTransformRequest = true) => {
    return axios({
      url: url,
      method: 'post',
      data: params,
      headers: headers,
      transformRequest: [(data) => {
        return doTransformRequest ? JSON.stringify(data) : data;
      }]
    })
  };
  // axios 全局配置
  axios.defaults.baseURL = options.HOST || location.origin;
  axios.defaults.headers['Content-Type'] = 'application/json';
  axios.defaults.timeout = 20000;
  // axios.defaults.transformRequest = [(data) => {
  //   return JSON.stringify(data);
  // }];
  axios.interceptors.request.use(function (config) {
    // Do something before request is sent 
    return config;
  }, function (error) {
    // Do something with request error 
    return Promise.reject(error);
  });
  axios.interceptors.response.use((response) => {
    if (!response || response.status !== 200) return alert('网络错误');
    return response.data;
  }, (error) => {
    alert(error.toString())
    return error
  });
}
export default install;