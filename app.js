
const express = require('express')
const path = require('path')
const glob = require('glob')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const partials = require('express-partials')
const request = require('request')
const swig = require('swig')
const fs = require('fs')
const os = require('os')
const Busboy = require('busboy')
const _ = require('lodash')
const inspect = require('util').inspect

const app = express()

app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('view cache', false)
swig.setDefaults({ cache: false, varControls: ['{~', '~}'] })
app.set('views', path.join(__dirname, 'views'))
app.use(partials())

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

if (process.argv.splice(2).indexOf('dev') >= 0) {
    let config = {
        baseURL: 'http://ark-private.geotmt.com/',
        token: ''
    }
    app.use((req, res, next) => {
        if (req.headers['content-type'] && req.headers['content-type'].indexOf('multipart/form-data') >= 0) {

            let busboy = new Busboy({ headers: req.headers });
            let remote_data = {}

            busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                var saveTo = path.join(os.tmpDir(), path.basename(filename));
                file.pipe(fs.createWriteStream(saveTo));

                file.on('end', function () {
                    remote_data['file'] = fs.createReadStream(saveTo);
                    request.post({
                        headers: {
                            'api-token': config.headers['api-token']
                        },
                        url: 'http://ark-private.geotmt.com/' + req.originalUrl.replace('/php', ''),
                        formData: remote_data
                    }, function (err, response, body) {
                        if (err) {
                            console.log(err)
                        }
                        if (typeof (body) == 'string') {
                            res.send(body)
                        } else {
                            res.json(body)
                        }
                    })
                });
            });
            busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
                remote_data[fieldname] = inspect(val);
            });
            req.pipe(busboy);
        } else {
            next()
        }
    });

    app.use((req, res, next) => {
        let host = 'http://ark-private.geotmt.com/'
        if (req.url.indexOf('php/') > 0) {
            let url = host + req.originalUrl.replace('/php', '')
            let token = req.header('api-token')
            let data = Object.assign({}, req.body)
            request({
                uri: url,
                formData: data,
                method: req.method ? req.method : 'POST',
                headers: {
                    "api-token": token
                }
            }, (error, response, body) => {
                res.send(body)
            })
        } else {
            res.render(path.join(__dirname, 'views', req.path))
        }
    })
} else {
    app.use((req, res, next) => {
        if (req.url.indexOf('data/') > 0) {
            let file = glob.sync('.' + req.path + '.js')[0]
            if (file) {
                let data = require(file)
                res.json({
                    code: 200,
                    message: "",
                    detail: data(req, res)
                })
            } else {
                res.send('error')
            }
        } else if (req.url.indexOf('php/') > 0) {
            let file = glob.sync('.' + req.path + '.js')[0]
            if (file) {
                let data = require(file)
                res.send(data(req, res))
            } else {
                res.send('error')
            }
        } else {
            res.render(path.join(__dirname, 'views', req.path))
        }
    })
}

module.exports = app
