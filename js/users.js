var logged = {};
var users = []

// Request users from server
function querry_users() {
    ajax_json('../process.php', function(r) {
        if (r) {
            logged = r[0]
            if (r[1].length > 1) {
                users = r[1].slice(1)
            }
            else {
                users = []
            }
        }
        else {
            logged = {}
            users = []
        }

        plot_pairs()
    }, {
        function: 'users'
    })
}

// Select user from their ID
function users_from_id(id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            return users[i];
        }
    }
}

querry_users()
setInterval(querry_users, 1400)
