var dom = document

// Shortcut for document.querySelector
function select(query, context=document) {
    return context.querySelector(query)
}

// Anomymous class for generating HTML elements
var html = new Proxy({}, {
    get(target, tag) {
        // Callable
        // text: string, Class: string, attr: object, inner: array, namespace: string
        return function(...args) {
            let text = null, Class = null, namespace = null, attr = null, inner = null
            // Get arguments
            args.forEach(function(v) {
                // text, Class, ... , namespace
                if (typeof v == 'string') {
                    if (attr != null)
                        namespace   = v
                    else if (text != null)
                        Class = v.split(' ')
                    else
                        text  = v
                }
                // attr, inner
                else if (typeof v == 'object') {
                    if (Array.isArray(v)) {
                        inner = v
                    }
                    else attr = v
                }
                else text = v
            })

            // Genarate element
            let elem
            if (namespace) {
                elem = document.createElementNS(namespace, tag)
            }
            else {
                elem = document.createElement(tag)
            }

            // Add classes
            if (Class) {
                Class.forEach(function(v) {
                    if (v) elem.classList.add(v)
                })
            }

            // Add attributes
            if (attr) {
                for (let kw in attr) {
                    html_kw = kw.replace(/\_/, '-')
                    elem.setAttribute(html_kw, attr[kw])
                }
            }

            elem.textContent = text

            // Add inner elements
            if (inner) {
                inner.forEach(function(v) {
                    elem.appendChild(v)
                })
            }

            return elem
        }
    }
})

// Get parameters from url
function getParams() {
    let url = window.location.href.split('?')
	let params = {}
    if (url.lenght > 1) {
    	let vars = url[1].split('&')
    	for (let i = 0; i < vars.length; i++) {
    		let pair = vars[i].split('=')
    		params[pair[0]] = decodeURIComponent(pair[1])
    	}
    }
	return params
}

// Event for pressing ENETER key
function on_enter(input, btn, callback) {
    input.addEventListener('keyup', function(e) {
        let key = e.which || e.keyCode
        if (key == 13) { // codigo da tecla enter
            try { callback(input) }
            catch(err) { callback() }
        }
    })
    // Confirm button
    if (btn) {
        btn.addEventListener('mousedown', function() {
            event.preventDefault();
            try { callback(input) }
            catch(err) { callback() }
        })
    }
}

// AJAX Request
function ajax(url, callback, parameters={}, debug=false) {
    // Kick start
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'text';
    xhr.open("POST", url, true)

    // Set callback
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            if (debug) {
                console.log('AJAX: ', xhr.responseText)
            }
            if (callback) {
                callback(xhr.responseText)
            }
        }
    }

    // Encode Parameters and send
    if (parameters) {
        let aux = []
        for (var kw in parameters) {
            param = encodeURIComponent(kw)
            value = encodeURIComponent(parameters[kw])
            aux.push(param + "=" + value)
        }

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(aux.join('&'))
    }
    else xhr.send(null)
}
// AJAX JSON Request
function ajax_json(url, callback, parameters={}, debug=false) {
    ajax(url, function (response) {
        if (callback) {
            try {
                callback(JSON.parse(response))
            }
            catch(e) {
                callback(null)
                console.error(url, parameters, callback,'\n\n',response)
            }
        }
    }, parameters, debug)
}

// Set screen height dinamicaly to CSS
setInterval(function() {
    document.documentElement.style.setProperty('--vh', window.innerHeight + 'px')
}, 100)
