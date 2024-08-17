<?php
// check_login.php
session_start();

// Check if the user is logged in
$is_logged_in = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;

echo json_encode(['is_logged_in' => $is_logged_in]);
?>
