var Seed = require('./main')
var app = Seed.create({
    id: 'test',
    // template
    scope: {
        msg: 'hello',
        hello: 'WHWHWHW',
        something: true,
        changeMessage: function () {
            app.scope.msg = 'hola'
        }
    }
})