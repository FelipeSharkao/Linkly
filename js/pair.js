select('#pair-btn').addEventListener('click', function() {
    ajax('../process.php', function(r) {
        pair = r
        enter_chat(r)
        querry_users();
    }, {
        function: 'pair'
    })
})

// Add pairs to list
function plot_pairs() {
    // Enter/exit current chat
    swipe_chat()

    let ul = select('#talks')
    ul.innerHTML = ''

    if ('pairs' in logged) {
        for (let i = 0; i < logged.pairs.length; i++) {
            let svg_uri = 'http://www.w3.org/2000/svg'
            let user = logged.pairs[i].user
            let name = users_from_id(user).name
            let s_name = name[0].toUpperCase()

            // LI
            let li = html.li([
                // FIGURE
                html.figure('', 'full-center', [
                    // SVG
                    html.svg('', 'face', {
                        viewBox: '0 0 18 18'
                    }, [
                        // TEXT
                        html.text(s_name, '', {
                            x: '50%',
                            y: '14',
                            text_anchor: 'middle'
                        }, svg_uri)
                    ], svg_uri),
                    // CAPTION
                    html.figcaption(name, 'face-name')
                ])
            ])

            li.addEventListener('click', function() {
                enter_chat(logged.pairs[i].pair)
            })
            ul.appendChild(li)
        }

        // Large chat enter
        if (logged.pairs.length > 0) {
            select('.talk-lg').classList.remove('lg')
        }
        else {
            select('.talk-lg').classList.add('lg')
        }
    }
}
