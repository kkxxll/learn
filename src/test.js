var Seed = require('./main')

var todos = [{
        text: 'make nesting controllers work',
        done: true
    },
    {
        text: 'complete ArrayWatcher',
        done: false
    },
    {
        text: 'computed properties',
        done: false
    },
    {
        text: 'parse textnodes',
        done: false
    }
]

Seed.controller('Todos', function (scope) {

    // regular properties
    scope.todos = todos
    scope.filter = 'all'
    scope.remaining = todos.reduce(function (count, todo) {
        return count + (todo.done ? 0 : 1)
    }, 0)

    // computed properties
    scope.total = function () {
        return scope.todos.length
    }

    scope.completed = function () {
        return scope.todos.length - scope.remaining
    }

    // event handlers
    scope.addTodo = function (e) {
        var val = e.el.value
        if (val) {
            e.el.value = ''
            scope.todos.unshift({
                text: val,
                done: false
            })
            scope.remaining++
        }
    }

    scope.removeTodo = function (e) {
        scope.todos.splice(e.scope.$index, 1)
        scope.remaining -= e.scope.done ? 0 : 1
    }

    scope.toggleTodo = function (e) {
        scope.remaining += e.scope.done ? -1 : 1
    }

    scope.setFilter = function (e) {
        scope.filter = e.el.className
    }

})

var app = Seed.bootstrap()