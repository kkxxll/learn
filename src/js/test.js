var Seed = require('./main')


Seed.filter('money', function (value) {
    return value ?
        '$' + value.toFixed(2) :
        ''
})

Seed.controller('TodoList', function (scope, seed) {
    scope.changeMessage = function () {
        scope.msg = 'It works!  ' + (Math.random() * 100).toFixed(2) + '% awesomeness'
    }
    scope.remove = function () {
        seed.destroy()
    }
})

Seed.controller('Todo', function (scope) {
    scope.toggle = function () {
        scope.done = !scope.done
    }
})

var s = Date.now()

var data = {
    msg: 'hello!',
    total: 9999,
    error: true,
    todos: [{
            title: 'hello!',
            done: true
        },
        {
            title: 'hello!!',
            done: false
        },
        {
            title: 'hello!!!',
            done: false
        }
    ]
}

var app = Seed.bootstrap({
    el: '#app',
    data: data
})

console.log(Date.now() - s + 'ms')