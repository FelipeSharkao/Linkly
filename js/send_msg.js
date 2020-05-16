var msg_input = select('#msg-input')
var send_btn = select('#msg-send')

on_enter(msg_input, select('#msg-send'), send_msg)
msg_input.addEventListener('input', function() {
    active_send_btn()
})

// Send messageto server
function send_msg() {
    // Paired?
    if (pair != null && pair != -1) {
        if (msg_input.value.length > 0) {
            // Compose message
            let msg = {
                user: logged.id,
                content: msg_input.value
            }

            // Send to server
            ajax_json('../process.php', null, {
                function: 'send',
                pair: pair,
                content: msg.content
            })
            // Send to memory
            msg_lst.push(msg)
        }
    }
    else {
        msg_lst = []
    }

    update_tl()
    msg_input.value = ''
    active_send_btn()
}

// Switch activation of send button
function active_send_btn() {
    if (msg_input.value.length > 0) {
        send_btn.classList.add('btn-primary')
        send_btn.classList.remove('btn-secondary')
    }
    else {
        send_btn.classList.remove('btn-primary')
        send_btn.classList.add('btn-secondary')
    }
}
