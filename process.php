<?php
/*******************************************
 *  Execute the control of the site pages  *
 *******************************************/

session_start();

// UTILITY find a item in a array of arrays
function find_by($kw, $match, $array, $offset=0, $len=null) {
    foreach (array_slice($array, $offset, $len) as $i => $val) {
        if ($val[$kw] == $match) {
            return array(
                'i' => $i + $offset,
                'value' => $val
            );
        }
    }
    return null;
}

// UTILITY randomize array and keys
function shuffle_assoc($array) {
	$keys = array_keys($array);
	shuffle($keys);

	foreach($keys as $key) {
		$new[$key] = $array[$key];
	}

	return $new;
}

// Return the array of the logged user, of null if there's none
function logged() {
    if (isset($_SESSION['user-idx'])) {
        return $_SESSION['users'][$_SESSION['user-idx']];
    }
    else return null;
}

// AJAX Save sended messages
function send() {
    if ($_POST['content'] != '') {
        // Write in file
        $res = fopen("./data/msg/{$_POST['pair']}.txt", 'a');
        $logged = logged();
        fwrite($res, "{$logged['id']} {$_POST['content']}\n");
        fclose($res);

        // Ajax response
        echo json_encode(array(
            'user' => (int)logged()['id'],
            'content' => $_POST['content']
        ));
    }
}

// Query messages from file
function query() {
    $arr = array();

    $res = @fopen("./data/msg/{$_POST['pair']}.txt", 'r');
    if ($res) {
        // Read file
        while (($line = fgets($res)) !== false) {
            $itens = explode(' ', $line, 2);
            array_push($arr, array(
                'user' => (int)$itens[0],
                'content' => $itens[1]
            ));
        }

        fclose($res);
    }

    // Ajax response
    echo json_encode($arr);
}

// Get users from file to memory
function get_users() {
    $path = './data/users.json';
    $res = @fopen($path, 'r');
    if ($res) {
        $_SESSION['users'] = json_decode(fread($res, filesize($path)), true);
        fclose($res);
    }
    else {
        $_SESSION['users'] = array(array(-1, -1));
    }
}

// AJAX verify username to login/signin
function login_name() {
    $logged = false;
    get_users();
    if ($_SESSION['users'] != array(array(-1,-1))) {
        if ($user = find_by('name', $_POST['user'], $_SESSION['users'], 1)) {
            // Ajax: user index
            echo $user['i'];
            $logged = true;
        }
    }

    if (!$logged) {
        // Ajax: user not founded
        echo -1;
    }
}

// AJAX verify password and login
function login_pw() {
    get_users();
    $idx = $_POST['user'];

    // There's users and the usersendedis valid?
    if ($_SESSION['users'] != array(array(-1,-1)) && $idx != '-1') {
        $user = $_SESSION['users'][$idx];
        // Check passwors
        if (password_verify($_POST['pw'].$user['key'], $user['pw'])) {
            $_SESSION['user-idx'] = $_POST['user'];

            // Ajax: user object (without password)
            unset($user['key']);
            unset($user['pw']);
            echo json_encode($user);
        }
        else {
            // Ajax: incorrect password
            echo '{"e":403}';
        }
    }
    else {
        // Ajax: user not founded
        echo '{"e":404}';
    }
}

// AJAX signin
function signin() {
    get_users();

    // Sended username already exists?
    if (!find_by('name', $_POST['user'], $_SESSION['users'], 1)) {
        // Prepare user object
        $id = ++$_SESSION['users'][0][0];
        $key = mt_rand();
        $pw = password_hash($_POST['pw'].$key, PASSWORD_DEFAULT);
        $logged = array(
            'id' => $id,
            'name' => $_POST['user'],
            'key' => $key,
            'pw' => $pw,
            'pairs' => array()
        );

        // Add user to server
        $_SESSION['user-idx'] = count($_SESSION['users']);
        array_push($_SESSION['users'], $logged);

        // Write on file
        $res = fopen('./data/users.json', 'w');
        fwrite($res, json_encode($_SESSION['users']));
        fclose($res);

        // Ajax: user object (without password)
        unset($logged['key']);
        unset($logged['pw']);
        echo json_encode($logged);
    }
    else {
        // User already exists
        echo '{"e":403}';
    }
}

// AJAX querry all users
function users() {
    get_users();
    if (isset($_SESSION['user-idx'])) {
        $arr = $_SESSION['users'];

        // Remove password
        for ($i = 1; $i < count($arr); $i++) {
            unset($arr[$i]['key']);
            unset($arr[$i]['pw']);
        }

        // Get logget user and remove password
        $logged = logged();
        unset($logged['key']);
        unset($logged['pw']);

        // Ajax: [logged user, all users]
        echo json_encode(array($logged, $arr));
    }
}

// Pair users
function pair() {
    get_users();

    $len = count($_SESSION['users']);
    // There >= 2 users (first index is for auto-increments)
    if ($len >= 3) {
        $user = $_SESSION['user-idx'];
        $idx = -1;

        // To find a random valid pair
        foreach (shuffle_assoc($_SESSION['users']) as $i => $v) {
            if ($i == 0) continue;
            if ($i == $user) continue;

            $to_find = array(
                'user',
                logged()['id'],
                $v['pairs']
            );
            // Is it not paired with they already?
            if (!find_by(...$to_find)) {
                $idx = $i;
                break;
            }
        }
        // None was found
        if ($idx == -1) {
            // Ajax: random existing pair number
            $pairs = logged()['pairs'];
            echo $pairs[mt_rand(0, count($pairs))]['pair'];
            return;
        }

        // Add pair to their user object
        array_push($_SESSION['users'][$idx]['pairs'], array(
            'user' => logged()['id'],
            'pair' => ++$_SESSION['users'][0][1] // Pair auto increment +1
        ));

        // Add pair to the logged user object
        $pair = array(
            'user' => $_SESSION['users'][$idx]['id'],
            'pair' => $_SESSION['users'][0][1]
        );
        array_push($_SESSION['users'][$user]['pairs'], $pair);

        // Write in file
        $res = fopen('./data/users.json', 'w');
        fwrite($res, json_encode($_SESSION['users']));
        fclose($res);

        // Ajax: pair number
        echo $_SESSION['users'][0][1];
    }
}

switch ($_POST['function']) {
    case 'send':
        send();
        break;
    case 'query':
        query();
        break;
    case 'login-name':
        login_name();
        break;
    case 'login-pw':
        login_pw();
        break;
    case 'signin':
        signin();
        break;
    case 'users':
        users();
        break;
    case 'pair':
        pair();
        break;
}

?>
