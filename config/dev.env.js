var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

var BUILD_TYPE = process.env.BUILD_TYPE?process.env.BUILD_TYPE:'qa'

let gourl = '',logurl=''
gourl = 'http://vip.'+BUILD_TYPE+'.rdtest.域名.cn'
logurl = 'http://www'

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HOST: '"dev"',
  Url: '""',
  Loginurl: '"'+logurl+'"',
  Gourl: '"'+gourl+'"'
})
