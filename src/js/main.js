var prefix = 'sd',
    Filters = require('./filters'),
    Directives = require('./directives'),
    selector = Object.keys(Directives).map(function (d) {
        return '[' + prefix + '-' + d + ']'
    }).join()
// ["[sd-text]", "[sd-show]", "[sd-class]", "[sd-on]"]
// [sd-text],[sd-show],[sd-class],[sd-on]

function Seed(opts) {

    var self = this,
        root = this.el = document.getElementById(opts.id),
        // querySelectorAll 匹配的[xxx]代表包含属性xxx的
        els = root.querySelectorAll(selector),
        bindings = {} // internal real data

    self.scope = {} // external interface

    // process nodes for directives
    ;
    [].forEach.call(els, processNode)
    processNode(root)

    // initialize all variables by invoking setters
    for (var key in bindings) {
        self.scope[key] = opts.scope[key]
    }

    // 处理节点
    function processNode(el) {
        cloneAttributes(el.attributes).forEach(function (attr) {

            var directive = parseDirective(attr)

            // {
            //     argument: null
            //     attr: {
            //         name: "sd-text",
            //         value: "msg | capitalize"
            //     }
            //     definition: ƒ text(el, value)
            //     el: p
            //     filters: ["capitalize"]
            //     key: "msg"
            //     update: ƒ text(el, value)
            // }

            // {
            //     argument: "click"
            //     attr: {
            //         name: "sd-on-click",
            //         value: "changeMessage | .button"
            //     }
            //     definition: {
            //         update: ƒ,
            //         unbind: ƒ,
            //         customFilter: ƒ
            //     }
            //     el: div# test
            //     filters: [".button"]
            //     handlers: {
            //         click: ƒ
            //     }
            //     key: "changeMessage"
            //     update: ƒ update(el, handler, event, directive)
            // }
            if (directive) {
                bindDirective(self, el, bindings, directive)
            }
        })
    }
}

// 绑定指令
function bindDirective(seed, el, bindings, directive) {
    el.removeAttribute(directive.attr.name)
    var key = directive.key,
        binding = bindings[key]
    if (!binding) {
        bindings[key] = binding = {
            value: undefined,
            directives: []
        }
    }
    directive.el = el
    binding.directives.push(directive)
    // invoke bind hook if exists
    if (directive.bind) {
        directive.bind(el, binding.value)
    }
    if (!seed.scope.hasOwnProperty(key)) {
        bindAccessors(seed, key, binding)
    }
}

// 绑定存取器
function bindAccessors(seed, key, binding) {
    Object.defineProperty(seed.scope, key, {
        get: function () {
            return binding.value
        },
        set: function (value) {
            binding.value = value
            binding.directives.forEach(function (directive) {
                if (value && directive.filters) {
                    value = applyFilters(value, directive)
                }
                directive.update(
                    directive.el,
                    value,
                    directive.argument,
                    directive,
                    seed
                )
            })
        }
    })
}

// 应用过滤器
function applyFilters(value, directive) {
    if (directive.definition.customFilter) {
        return directive.definition.customFilter(value, directive.filters)
    } else {
        directive.filters.forEach(function (filter) {
            if (Filters[filter]) {
                value = Filters[filter](value)
            }
        })
        return value
    }
}

// clone attributes so they don't change
function cloneAttributes(attributes) {
    return [].map.call(attributes, function (attr) {
        return {
            name: attr.name,
            value: attr.value
        }
    })
}





// 解析指令
function parseDirective(attr) {

    // {name:"class", value:"button"}
    // {name: "sd-text", value: "msg"}
    // {name: "sd-on-click", value: "changeMessage | .button"}
    if (attr.name.indexOf(prefix) === -1) return

    // parse directive name and argument
    // {name: "sd-text", value: "msg"}
    // {name: "sd-on-click", value: "changeMessage | .button"}
    var noprefix = attr.name.slice(prefix.length + 1), // text on-click
        argIndex = noprefix.indexOf('-'), // -1 2
        dirname = argIndex === -1 ?
        noprefix :
        noprefix.slice(0, argIndex), // text on
        def = Directives[dirname],
        arg = argIndex === -1 ?
        null :
        noprefix.slice(argIndex + 1) // null click

    // parse scope variable key and pipe filters
    var exp = attr.value, // msg   changeMessage | .button
        pipeIndex = exp.indexOf('|'), // -1 14
        key = pipeIndex === -1 ?
        exp.trim() :
        exp.slice(0, pipeIndex).trim(), // msg changeMessage
        filters = pipeIndex === -1 ?
        null :
        exp.slice(pipeIndex + 1).split('|').map(function (filter) {
            return filter.trim()
        }) // null .button

    return def ? {
            attr: attr,
            key: key,
            filters: filters,
            definition: def,
            argument: arg,
            update: typeof def === 'function' ?
                def : def.update
        } :
        null
}



module.exports = {
    create: function (opts) {
        return new Seed(opts)
    },
    filters: Filters,
    directives: Directives
}