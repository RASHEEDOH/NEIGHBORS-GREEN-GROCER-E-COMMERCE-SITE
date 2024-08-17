<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "neighbors_green_grocer";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT item_name, quantity, price, (quantity * price) as total FROM items";
$result = $conn->query($sql);

$items = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($items);
?>

