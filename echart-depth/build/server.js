
// var proxyMiddleware = require('http-proxy-middleware')
// var express = require('express')
var config = require('./config.js')

// var server = express()
//
// var cbsUri = ['/rental/mobile/product', '/rental/mobile/order', '/rental/mobile/pay']
// var cmsUri = ['/mobile/config', '/mobile/credentials', '/mobile/msgCode', '/mobile/user', '/mobile/cms', '/mobile/accessKey', '/mobile/coupon','/mobile/alipaySecretFree']
// var uploadUri = ['/avis-cbs/identity_licence']
//
// server.middleware = [
//   proxyMiddleware(cbsUri, {target: config.API_PATH, changeOrigin: true}),
//   proxyMiddleware(cmsUri, {target: config.user, changeOrigin: true}),
//   proxyMiddleware(uploadUri, {target: config.uploadOss, changeOrigin: true})
// ];
//
// server.use(server.middleware);

// module.exports = server;
module.exports = {
  proxyList : {
    '/api':{              //cmsUri
      target: config.development.API_PATH,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'   //需要rewrite重写的,
      }
    },
  }
};
