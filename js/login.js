var log_idx = -1
var named = false

var login_fields = select('#login-fields')
var nm_input = select('#name-input')
var login_btn = select('#login-submit')
var signin_btn = select('#signin-submit')
var back_login_btn = select('#login-back')

var login_err = {}
var verifiers = []

back_login_btn.addEventListener('click', function() {
    nm_input.removeAttribute('disabled')

    // Remove password fields
    remove_input(login_fields, select('#pw-input'))
    remove_input(login_fields, select('#pw-input-repeat'))

    // Remove password error verifiers
    verifiers = verifiers.filter(function(v, i, a) {
        return v.name != 'pw' && v.name != 'r-pw'
    })

    // Switch buttons
    back_login_btn.classList.add('d-none')
    login_btn.classList.remove('d-none')
    signin_btn.classList.remove('d-none')

    log_idx = -1
    named = false
})

login_btn.addEventListener('click', function() {
    verifiers.forEach((item, i) => {
        item.f()
    })

    log_event(true)
    del_login_err(nm_input, 'signin')
})

signin_btn.addEventListener('click', function() {
    verifiers.forEach((item, i) => {
        item.f()
    })

    log_event(false)
    del_login_err(nm_input, 'login')
})

add_blank_verification(nm_input, 'name')

// Login/Signin call
function log_event(login) {
    // Not in error?
    if (!(is_login_err('name') || is_login_err('pw') || is_login_err('r-pw'))) {
        // Separate login values from signin ones
        let f = 'signin', user = nm_input.value
        if (login) {
            f = 'login-pw'
            user = log_idx
        }

        // Username accepted?
        if (named) {
            ajax_json('../process.php', function(r) {
                log_pw(r, login)
            }, {
                function: f,
                user: user,
                pw: select(['#pw-input']).value
            })
        }
        else {
            ajax('../process.php', function(r) {
                log_name(r, login)
            }, {
                function: 'login-name',
                user: nm_input.value
            })
        }
    }
}

// Verify username on server
function log_name(idx, login) {
    // Separate login values from signin ones
    let hide_btn = login_btn, error = 'Usuário já cadastrado!'
    if (login) {
        hide_btn = signin_btn
        error = 'Usuário não encontrado!'
    }

    log_idx = parseInt(idx)

    // Or is trying to login, or the username was not found
    if (login ^ (log_idx == -1)) {
        add_pw(login) // Insert password fields
        // Switch buttons
        back_login_btn.classList.remove('d-none')
        hide_btn.classList.add('d-none')
        named = true

        del_login_err(nm_input, 'login', 'badrequest')
        del_login_err(nm_input, 'signin', 'badrequest')
    }
    else {
        // Raise error
        if (login) {
            add_login_err(nm_input, 'login', 'badrequest', error)
        }
        else {
            add_login_err(nm_input, 'signin', 'badrequest', error)
        }
    }
}

// Verify password
function log_pw(user, login) {
    // Was error throw
    if ('e' in user) {
        if (user.e == 403) {
            if (login) {
                let pw = select('#pw-input')
                add_login_err(pw, 'pw', 'badpw', 'Senha incorreta!')
            }
            else {
                add_login_err(nm_input, 'signin', 'badrequest', 'Usuário já cadastrado!')
            }
        }
        else if (user.e == 404) {
            add_login_err(nm_input, 'login', 'badrequest', 'Usuário não encontrado!')
        }
    }
    else {
        // Login
        logged = user
        named = false
        redirect(getParams()['r'], './talk.php')
    }
}

// Insert password fields
function add_pw(login) {
    nm_input.setAttribute('disabled', '')

    // Create first filds
    let pw = create_pw_input(login_fields, 'Senha', 'pw-input')
    add_blank_verification(pw, 'pw')

    // Is signin?
    if (!login) {
        // Create Second field
        let r_pw = create_pw_input(login_fields, 'Repetir Senha', 'pw-input-repeat')
        add_blank_verification(r_pw, 'r-pw')

        // Set fields for password creation
        pw.setAttribute('autocomplete', 'new-password')
        r_pw.setAttribute('autocomplete', 'new-password')
        add_pw_match_verification(pw, r_pw)
    }
}

// Genterate password field
function create_pw_input(form, label, id) {
    form.appendChild(
        html.label(label + ': ', {
            for: id
        })
    )
    let pw = html.input('', 'form-control', {
        id: id,
        type: 'password'
    })
    form.appendChild(pw)

    form.appendChild(
        html.div('', 'invalid-feedback')
    )

    return pw;
}

// Add error verification event for required field
function add_blank_verification(elem, err_group) {
    // Callback
    let f = function() {
        if (elem) {
            if (!elem.value) {
                add_login_err(elem, err_group, 'blank', 'Esse campo não pode ficar em branco')
            }
            else {
                del_login_err(elem, err_group, 'blank')
            }
        }
    }

    elem.addEventListener('input', f)
    verifiers.push({name: err_group, f: f})
}

// Add error verification event for password confirmation
function add_pw_match_verification(pw, r_pw) {
    let f = function() {
        if (pw && r_pw && pw.value && r_pw.value) {
            if (pw.value != r_pw.value) {
                let err = 'As senhas devem ser iguais'
                add_login_err(pw, 'pw', 'unmatch', err)
                add_login_err(r_pw, 'r-pw', 'unmatch', err)
            }
            else {
                del_login_err(pw, 'pw', 'unmatch')
                del_login_err(r_pw, 'r-pw', 'unmatch')
            }
        }
    }

    pw.addEventListener('input', f)
    r_pw.addEventListener('input', f)
    verifiers.push({name: 'pw', f: f})
}

// Remove input field
function remove_input(form, input) {
    if (input) {
        form.removeChild(input.nextElementSibling)
        form.removeChild(input.previousElementSibling)
        form.removeChild(input)
    }
}

// Raise error
function add_login_err(elem, group, name, error) {
    if (!is_login_err(group)) login_err[group] = []
    if (!is_login_err(group, name)) {
        let f = function() {
            elem.nextElementSibling.textContent = error
            elem.classList.add('is-invalid')
        }

        login_err[group].push({
            name: name,
            add_f: f
        })
        f()
    }
}
// Unraise error
function del_login_err(elem, group, name=null) {
    if (name) {
        if (is_login_err(group, name)) {
            login_err[group] = login_err[group].filter(function(v, i, a) {
                return (v.name != name)
            })

            elem.nextElementSibling.textContent = ''

            if (login_err[group].length == 0) {
                delete login_err[group]
                elem.classList.remove('is-invalid')
            }
            else {
                login_err[group][login_err[group].length - 1].add_f()
            }
        }
    }
    else {
        while (group in login_err) {
            del_login_err(elem, group, login_err[group][0].name)
        }
    }
}
// Chek if error was raised
function is_login_err(group, name=null) {
    if (name) {
        if (is_login_err(group)) {
            let filtered = login_err[group].filter(function(v, i, a) {
                return (v.name == name)
            })
            return (filtered.length > 0)
        }
        else return false
    }
    else return (group in login_err)
}
