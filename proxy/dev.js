const path = require('path')
const glob = require('glob')

module.exports = app => {
    app.use((req, res, next) => {
        if (req.headers['accept'].indexOf('json')>=0) {
            try {
                const data = require('../api' + req.path)
                res.send(data(req, res))
            } catch (e) {
                res.send(`
                    Error: API is undefined.
                    If you want to use this api,
                    please add a module to '${req.path}'
                `)
            }
        } else {
            res.render(path.join(__dirname, '../views', req.path))
        }
    })
}