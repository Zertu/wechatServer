const express = require('express')
const router = express.Router()
const api = require('../service/api')
const config = require('../config/config.js').config
const handleEvent = require('../controller/handleEvent.js')
const responseShop = require('../controller/responseShop.js')
const sha1 = require('sha1')

const data = {
  access_token_main: '', //通过网页授权access_token可以进行授权后接口调用
  jsapi_ticket: '', //jsapi_ticket是公众号用于调用微信JS接口的临时票据
  token_expire_time: 0,
  openId: '' //用户的唯一标识码
}

// 获取access_token和jsapi_ticket  
function get_wx_data() {
  if (new Date().getTime() - data.token_expire_time > 7200) {
    api.getToken_JsApi().then(obj => {
      data.access_token_main = obj.access_token
      data.token_expire_time
      data.jsapi_ticket = obj.jsapi_ticket
    })
  }
}

router.get('/', function (req, res, next) {

  const token = config.wechat.token
  const signature = req.query.signature
  const nonce = req.query.nonce
  const timestamp = req.query.timestamp
  const echostr = req.query.echostr
  const str = [token, timestamp, nonce].sort().join('')
  const sha = sha1(str)

  if (sha === signature) {
    res.send(echostr + '');
  } else {
    res.send(wong);
  }
});

// 处理用户发送来的消息, 包括文字和点击事件
router.post('/', handleEvent.msg)

// 响应shop路由
router.get('/shop', (req, res) => {
  res.render('shop')
})

// 获取用户权限后跳转到response路由
router.get('/response', responseShop.shop)

// 生成签名用于wx.config
router.get('/getWxConfig', (req, res) => {
  const noncestr = req.query.nonceStr //前端传过来的随机字符串

  const timestamp = parseInt(new Date().getTime() / 1000) + '' //获取当前时间戳, 单位秒

  const url = req.query.url //获取前端页面的url, 不包括#及之后的内容

  //按照微信的官方说法要将用于生成签名的noncestr timestamp url jsapi_ticket 按照ASCII码由小到大排序, 以键值对的形式
  //拼接成字符串, "jsapi_ticket".charCodeAt()可查询
  const str = `jsapi_ticket=${data.jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`

  // 使用哈希加密成签名
  const signature = sha1(str)

  // 返回给前端
  res.json({
    appId: config.wechat.appID,
    signature: signature,
    timestamp: timestamp,
    jsapi_ticket22: data.jsapi_ticket,
    noncestr: noncestr,
    test: 123
  })
})

setInterval(() => {
  get_wx_data()
}, 7200);


module.exports = router


