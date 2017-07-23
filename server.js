require('babel-register')

const webpack = require('webpack')

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const config = require('./webpack.config')

const isProduction = process.env.NODE_ENV === 'production'
const isDeveloping = !isProduction

const app = express()

// Webpack developer
if (isDeveloping) {
  const compiler = webpack(config)
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true
  }))

  app.use(require('webpack-hot-middleware')(compiler))
}

//  RESTful API
const publicPath = path.resolve(__dirname)
app.use(bodyParser.json({ type: 'application/json' }))
app.use(express.static(publicPath))

const port = isProduction ? (process.env.PORT || 8080) : 3000

app.post('/api/user/login', function(req, res) {
  const credentials = req.body
  if (credentials.account === 'admin' && credentials.password === '123456') {
    res.cookie('uid', '1', {})
    res.sendFile(fake(req.path))
  } else {
    res.status('200').send({"ret":false,"errmsg" : "密码错误"})
  }
})

app.post('/api/user/logout', function(req, res) {
  res.clearCookie('uid')
  res.sendFile(fake(req.path))
})

app.post('/api/content/image', function(req, res) {
  if(req.param('CKEditorFuncNum')){
    res.setHeader('Content-Type', 'text/html')
    res.send('<script type="text/javascript"> window.parent.CKEDITOR.tools.callFunction("'+req.param('CKEditorFuncNum')+'", "http://img3.bitautoimg.com/autoalbum/files/20150519/332/0436393322_8.jpg", ""); </script>')
  }else{
    res.setHeader('Content-Type', 'application/json')
    res.send('{"ret" : true, "data" : {"url" : "http://img3.bitautoimg.com/autoalbum/files/20150519/332/0436393322_8.jpg"} }')
  }
})

app.all('/api/*', function(req, res) {
  res.sendFile(fake(req.path))
})

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '', 'index.html'))
})

app.listen(port, function(err, result) {
  if (err) {
    console.log(err)
  }
  console.log('Server running on port ' + port)
})


function fake(pathname){
  return path.resolve(__dirname, '', pathname.replace(/^\/api/, 'fake') + '.json')
}
