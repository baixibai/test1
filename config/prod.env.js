let HOST = process.argv.splice(2)[0] || 'prod';
var BUILD_TYPE = process.env.BUILD_TYPE?process.env.BUILD_TYPE:'zjd'
let url = '',logurl='',gourl=''
if(BUILD_TYPE == 'prod'){
    url = ''    
    logurl = 'https://'
    gourl = 'https://'
    imgUrl = 'https://'
}else{
    url = ''
    logurl = ''
    gourl = 'http://vip'
    imgUrl = 'static'
}
module.exports = {
  NODE_ENV: '"production"',
  HOST: '"'+BUILD_TYPE+'"',
  Url: '"'+url+'"',
  Loginurl: '"'+logurl+'"',
  Gourl: '"'+gourl+'"',
  imgUrl: '"'+imgUrl+'"'
}
