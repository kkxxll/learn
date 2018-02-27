var Seed = require('./main')

Seed.controller('Grandpa', function (scope, seed) {
    scope.name = 'John'
})

Seed.controller('Dad', function (scope, seed) {
    scope.name = 'Jack'
})

Seed.controller('Son', function (scope, seed) {
    scope.name = 'Jason'
})

Seed.controller('Baby', function (scope, seed) {
    scope.name = 'James'
})

Seed.bootstrap()