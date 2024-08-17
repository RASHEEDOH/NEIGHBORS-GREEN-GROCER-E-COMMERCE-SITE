<?php
session_start();
include('db_connection.php'); // Include your database connection

// Error reporting for development only
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the username and password from the form
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Check for the special admin credentials
    if ($username === 'admin' && $password === 'admin') {
        // Set session variables for admin
        $_SESSION['username'] = 'admin';
        $_SESSION['role'] = 'admin';
        header("Location: admin.php");
        exit();
    }

    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    if ($stmt === false) {
        error_log("Prepare failed: " . $conn->error); // Log error
        die("An error occurred. Please try again later.");
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Fetch user data
        $user = $result->fetch_assoc();

        // Verify password
        if (password_verify($password, $user['password'])) {
            // Set session variables
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role']; // Assuming 'role' field for admin

            // Redirect to appropriate page based on role
            if ($user['role'] === 'admin') {
                header("Location: admin.php");
            } else {
                header("Location: shop.html");
            }
            exit();
            
        } else {
            // Incorrect password
            echo "Invalid username or password.";
        }
    } else {
        // Username not found
        echo "Invalid username or password.";
    }

    $stmt->close();
    $conn->close();
}
?>
