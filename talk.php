<?php
/**************************
 *  Chat and pair screen  *
 **************************/

session_start();
include './patterns.php';

if (!isset($_SESSION['user-idx'])) {
    header('Location: ./?r='.urlencode('talk'));
}
?>

<?php start_page() ?>

<div class="chat-wrapper" id="chat-master">
    <nav class="col-12 col-md-5 col-lg-4 col-xl-3 h-view overflow-scroll">
        <div class="talk-lg lg">
            <svg viewBox="0 0 150 18">
                <text x="0" y="14">Querendo conversar?</text>
            </svg>
            <button id="pair-btn" class="btn btn-primary" type="button">Conecte-se!</button>
        </div>
        <ul id="talks" class="half"></ul>
    </nav>

    <main class="col-12 col-md-7 col-lg-8 col-xl-9" id="chat-body">
        <div class="center-msg">Conecte-se com alguém para começar a falar</div>

        <div class="navbar flex-grow-0 bg-bluish" id="talk-name">
            <button class="btn btn-primary left" id="back-chat">
                <i class="fas fa-angle-left"></i>
            </button>
            <span class="navbar-brand left mb-0 h1">Navbar</span>
        </div>

        <div id="timeline" class="flex-grow-1"></div>

        <div id="chat-input" class="flex-grow-0 sline-input bg-bluish">
            <input class="form-control rounded-full" type="text" id="msg-input">
            <div class="btn btn-secondary btn-action" id="msg-send">
                <i class="far fa-comment"></i>
            </div>
        </div>
    </main>
</div>

<?php end_page('chat-control', 'pair', 'users', 'query_msg', 'send_msg') ?>
