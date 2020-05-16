setInterval(function() {
    query_msg()
}, 800)
query_msg()

var msg_lst = []

// Request messages from server
function query_msg() {
    if (pair != null) {
        ajax_json('../process.php', function(r) {
            json_to_msg(r)
        }, {
            function: 'query',
            pair: pair
        })
    } else {
        msg_lst = []
        update_tl()
    }
}

// Resolve server response
function json_to_msg(content) {
    if (content) {
        if (content.length > msg_lst.length) {
            // Add to list
            msg_lst = content
        }
        update_tl()
    }
}

// Update message list (timeline)
function update_tl() {
    let tl = select('#timeline')
    tl.innerHTML = ''

    let scroll = false;
    // Shortcut to scroll to newest message
    let scrollHeight = function() {
        return tl.scrollHeight - tl.clientHeight
    }
    // Is scrolled to newest message?
    if (tl.scrollTop == scrollHeight()) {
        scroll = true
    }

    for (var i = 0; i < msg_lst.length; i++) {
        // Username
        let user = users_from_id(msg_lst[i].user).name

        // outer DIV
        let msg = html.div([
            // inner DIV
            html.div('', 'fixed-container', [
                // message
                html.label(user, 'msg-title'),
                html.p(msg_lst[i].content)
            ])
        ])

        tl.appendChild(msg)
    }

    // scroll to newest message
    if (scroll) tl.scrollTop = scrollHeight();

    swipe_chat()
}
