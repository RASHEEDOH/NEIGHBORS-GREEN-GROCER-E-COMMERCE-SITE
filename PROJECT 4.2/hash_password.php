<?php
// Password to hash
$plain_password = 'admin'; // Replace with your actual password

// Generate hashed password
$hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

// Output the hashed password
echo $hashed_password;
?>
