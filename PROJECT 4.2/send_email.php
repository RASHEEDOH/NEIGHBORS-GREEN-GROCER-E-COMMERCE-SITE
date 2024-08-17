<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $firstName = htmlspecialchars($_POST['firstName']);
    $middleName = htmlspecialchars($_POST['middleName']);
    $lastName = htmlspecialchars($_POST['lastName']);
    $email = htmlspecialchars($_POST['email']);
    $username = htmlspecialchars($_POST['username']);
    $dob = htmlspecialchars($_POST['dob']);
    $gender = htmlspecialchars($_POST['gender']);
    $paymentMethod = htmlspecialchars($_POST['paymentMethod']);
    $paymentNumber = htmlspecialchars($_POST['paymentNumber']);
    $password = htmlspecialchars($_POST['password']);
    $confirmPassword = htmlspecialchars($_POST['confirmPassword']);

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

        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert form data into the users table
        $stmt = $conn->prepare("INSERT INTO users (first_name, middle_name, last_name, email, username, dob, gender, payment_method, payment_number, password) 
                                VALUES (:first_name, :middle_name, :last_name, :email, :username, :dob, :gender, :payment_method, :payment_number, :password)");

        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':middle_name', $middleName);
        $stmt->bindParam(':last_name', $lastName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':dob', $dob);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':payment_method', $paymentMethod);
        $stmt->bindParam(':payment_number', $paymentNumber);
        $stmt->bindParam(':password', $hashedPassword);

        $stmt->execute();

        echo "User registered successfully!";
        // Redirect to login page after 3 seconds
        header("refresh:2;url=login.html");

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }

    $conn = null;
} else {
    echo "Invalid request method.";
}
?>
