<?php
$servername = "localhost";
$username = "root";
$password = ""; // Change if you have a password set for your MySQL root user
$dbname = "neighbors_green_grocer";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

// Generate a unique order ID
$orderID = time(); // Using the current timestamp as a simple unique identifier

foreach ($data as $item) {
    $itemName = $conn->real_escape_string($item['name']);
    $quantity = (int)$item['quantity'];
    $price = (float)$item['price'];
    $sql = "INSERT INTO orders (item_name, quantity, price, order_id) VALUES ('$itemName', $quantity, $price, $orderID)";
    if (!$conn->query($sql)) {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
