
const os = require('os')
const path = require('path')
const fs = require('fs')
const request = require('request')
const inspect = require('util').inspect
const needle = require('needle')
const multiparty = require('multiparty')

let baseURL = 'http://ark-private.geotmt.com/'

module.exports = app => {

    app.use((req, res, next) => {
        if (req.headers['content-type'] && req.headers['content-type'].indexOf('multipart/form-data') >= 0) {

            var form = new multiparty.Form();

            form.parse(req, function (err, fields, files) {
                var data = {
                    file: {
                        'file': files.file[0].path,
                        'content_type': files.file[0].headers['content-type'],
                        'filename': files.file[0].filename
                    }
                }
                for (let i in fields) {
                    data[i] = fields[i][0]
                }
                needle.post(baseURL + req.originalUrl.replace('/php', ''), data, { multipart: true }, function (error, response, body) {
                    if (error) {
                        res.send(error)
                    }
                    res.send(body)
                })
            })

        } else {
            next()
        }
    })

    app.use((req, res, next) => {
        if (req.url.indexOf('php/') > 0) {
            let url = baseURL + req.originalUrl.replace('/php', '')
            let data = Object.assign({}, req.body)
            request({
                uri: url,
                formData: data,
                method: req.method ? req.method : 'POST',
                headers: {
                    "api-token": req.header('api-token')
                }
            }, (error, response, body) => {
                if (response.headers['content-type'].indexOf('application/json') >= 0) {
                    res.send(body)
                } else {  //download file
                    res.set(response.headers)
                    res.send(response)
                }
            })
        } else {
            res.render(path.join(__dirname, '../views', req.path))
        }
    })
}