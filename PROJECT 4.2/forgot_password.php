<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['Password']);
    $confirmPassword = htmlspecialchars($_POST['confirm_Password']);
    $phoneNumber = htmlspecialchars($_POST['phone-number']);

    // Validate form data
    if ($password !== $confirmPassword) {
        die("Passwords do not match.");
    }

    // Database connection
    $servername = "localhost"; 
    $dbname = "neighbors_green_grocer";
    $dbusername = "root"; 
    $dbpassword = ""; 

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Check if the username and phone number match
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username AND payment_number = :phone_number");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':phone_number', $phoneNumber);
        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            die("Username or phone number not found.");
        }

        // Hash the new password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Update the user's password
        $stmt = $conn->prepare("UPDATE users SET password = :password WHERE username = :username AND payment_number = :phone_number");
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':phone_number', $phoneNumber);
        $stmt->execute();

        echo "Password updated successfully!";
        // Redirect to login page after 3 seconds
        header("refresh:1;url=login.html");

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }

    $conn = null;
} else {
    echo "Invalid request method.";
}
?>
