var pair = -1

select('#back-chat').addEventListener('click', function() {
    pair = -1;
    plot_pairs();
})

function enter_chat(chat) {
    if (chat != null && chat != -1) {
        pair = chat
        msg_lst = []
        query_msg() // It will eventualy open the chat
    }
}

// Open or closethe chat
function swipe_chat() {
    if (pair == null || pair == -1) {
        // Close chat
        if (window.innerWidth < 768) {
            select('#chat-master').classList.remove('drag-side')
        }

        // Hide controls
        select('#chat-input').classList.add('d-none')
        select('#talk-name').classList.add('d-none')
        select('#chat-body > .center-msg').classList.remove('d-none')
    }
    else {
        // Find pair username
        let u_id = logged.pairs.filter(function(v, i, a) {
            return v.pair == pair
        })[0].user
        let u_name = users_from_id(u_id).name

        select('#talk-name > span').textContent = u_name

        // Open chat
        if (window.innerWidth < 768) {
            select('#chat-master').classList.add('drag-side')
        }

        // Show controls
        select('#chat-input').classList.remove('d-none')
        select('#talk-name').classList.remove('d-none')
        select('#chat-body > .center-msg').classList.add('d-none')
    }
}
