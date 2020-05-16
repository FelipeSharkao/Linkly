function redirect(to, def='./') {
    let url = ''
    switch (to) {
        case 'talk':
            url = './talk.php'
            break
        default:
            url = def
            break
    }
    window.location.href = url;
}
