<?php

/*************
 *   Login   *
 *************/

session_start();
include './patterns.php';
?>

<?php start_page(); ?>

<div class="full-center h-view">
    <h1>Linkly!</h1>

    <form>
        <div id="login-fields">
            <label for="name-input">Nome: </label>
            <input type="text" class="form-control" id="name-input"  autocorrect="off" autocapitalize="off" autocomplete="username">
            <div class="invalid-feedback"></div>
        </div>

        <div class="mt-4 half">
            <a href="#" class="btn btn-secondary d-none" id="login-back">Voltar</a>
            <a href="#" class="btn btn-primary" id="signin-submit">Cadastrar</a>
            <a href="#" class="btn btn-primary" id="login-submit">Login</a>
        </div>
    </form>


</div>

<?php end_page('login'); ?>
