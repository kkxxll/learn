var config = require('./config'),
    Directives = require('./directives'),
    Filters = require('./filters')

var KEY_RE = /^[^\|]+/, // 第一个^表示以什么开头匹配，[^\|]表示匹配非|符号， 最后一个加号表示匹配1次以上
    FILTERS_RE = /\|[^\|]+/g

function Directive(def, attr, arg, key) {

    // Directives[on] : Directives[text]
    // {name: "sd-text", value: "msg.wow | capitalize"} {name: "sd-on-click", ...}
    // null : click
    // msg.wow

    if (typeof def === 'function') {
        this._update = def
    } else {
        for (var prop in def) {
            if (prop === 'update') {
                this['_update'] = def.update
                continue
            }
            this[prop] = def[prop]
        }
    }

    this.attr = attr
    this.arg = arg
    this.key = key

    // console.log(attr.value)
    // "a | b | c"
    var filters = attr.value.match(FILTERS_RE)
    // console.log(filters)
    // ["| b", "| c"]
    if (filters) {
        this.filters = filters.map(function (filter) {

            // TODO test performance against regex
            // console.log(filter)
            // "| capitalize"
            // | delegate .button
            var tokens = filter.replace('|', '').trim().split(/\s+/) // 以一个以上空格分隔
            // console.log(tokens)
            // ["capitalize"]
            // ["delegate", ".button"]

            return {
                name: tokens[0],
                apply: Filters[tokens[0]],
                args: tokens.length > 1 ? tokens.slice(1) : null // [".button"] : null
            }
        })
    }
}

Directive.prototype.update = function (value) {
    // apply filters
    if (this.filters) {
        value = this.applyFilters(value)
    }
    this._update(value)
}

Directive.prototype.applyFilters = function (value) {
    var filtered = value
    this.filters.forEach(function (filter) {
        // console.log(filter)
        if (!filter.apply) throw new Error('Unknown filter: ' + filter.name)
        filtered = filter.apply(filtered, filter.args)
    })
    return filtered
}

module.exports = {

    // make sure the directive and value is valid
    parse: function (attr) {

        var prefix = config.prefix
        if (attr.name.indexOf(prefix) === -1) return null

        // {name: "sd-text", value: "msg.wow | capitalize"}
        // sd-on-click
        var noprefix = attr.name.slice(prefix.length + 1), // text on-click
            argIndex = noprefix.indexOf('-'), // -1 2
            arg = argIndex === -1 ? // null : click
            null :
            noprefix.slice(argIndex + 1),
            name = arg ?
            noprefix.slice(0, argIndex) :
            noprefix, // on : text
            def = Directives[name] // Directives[on] : Directives[text]

        // console.log(attr.value)
        // msg.wow | capitalize
        var key = attr.value.match(KEY_RE)
        // console.log(key)
        // ["msg.wow ", index: 0, input: "msg.wow | capitalize"]

        return def && key ?
            new Directive(def, attr, arg, key[0].trim()) :
            null
    }
}