var Seed = require('./main')
var app = Seed.create({
    id: 'test',
    scope: {
        hello: 'hello',
        'msg.wow': 'wow',
        changeMessage: function () {
            app.scope['msg.wow'] = 'holawow'
        },
        remove: function () {
            app.destroy()
        }
    }
})