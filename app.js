
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const partials = require('express-partials')
const swig = require('swig')
const dev_proxy = require('./proxy/dev')
const product_proxy = require('./proxy/prod')

const app = express()

swig.setDefaults({ cache: false, varControls: ['{~', '~}'] })

app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('view cache', false)
app.set('views', path.join(__dirname, 'views'))

app
    .use(partials())
    .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
    .use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')))

if (process.argv.splice(2).indexOf('dev') >= 0) {
    //npm run dev 
    product_proxy(app)
} else {
    //npm run start                                
    dev_proxy(app)
}

module.exports = app
