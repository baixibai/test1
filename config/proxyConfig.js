module.exports = {
    proxy: {
        '/api': {
            target: 'http://www.zjd.cn',  // 接口域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true  //是否跨域
        },
        '/go': {
            target: 'http://www.zjd.cn',
            secure: false,
            changeOrigin: true
        },
        '/g': {
            target: 'http://www.zjd.cn',
            secure: false,
            changeOrigin: true
        }
    }
}
