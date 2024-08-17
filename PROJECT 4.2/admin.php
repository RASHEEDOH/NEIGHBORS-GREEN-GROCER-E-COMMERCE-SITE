<?php
session_start();
include('db_connection.php');

// Check if the user is logged in and is an admin
if (!isset($_SESSION['username']) || $_SESSION['role'] != 'admin') {
    header("Location: login.php");
    exit();
}

// Function to fetch and display table data
function displayTable($conn, $tableName) {
    $sql = "SELECT * FROM $tableName";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "<h2>" . ucfirst(str_replace('_', ' ', $tableName)) . " Table</h2>";
        echo "<div class='table-container'>";
        echo "<table><tr>";

        // Fetch table headers
        $fieldInfo = $result->fetch_fields();
        foreach ($fieldInfo as $field) {
            echo "<th>{$field->name}</th>";
        }

        echo "</tr>";

        // Fetch table rows
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            foreach ($row as $value) {
                echo "<td>{$value}</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
        echo "</div>";
    } else {
        echo "<p>No data found in $tableName table.</p>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="main_logo.JPG">
    <title>Admin - NEIGHBORS GREEN GROCER</title>
    <link href="https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap" rel="stylesheet"> 
    <style>
        /* Basic reset for margins and padding */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Kumbh Sans', sans-serif;
        }

        /* Styling for the navigation bar */
        .navigation {
            background-color: #2c3e50;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
        }
        .LOGO {
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-left: 10px;
        }

        .LOGO img {
            width: 100px;
            height: 80px;
        }
        .LOGO a {
            color: #ecf0f1;
            text-decoration: none;
            font-size: 24px;
            font-weight: bold;
        }

        .links_menu {
            list-style: none;
            display: flex;
        }

        .links_item {
            margin-left: 20px;
        }

        .links_item a, .SignUp {
            color: #ecf0f1;
            text-decoration: none;
            font-size: 18px;
            display: flex;
        }

        .SignUp {
            background-color: #e74c3c;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .SignUp:hover {
            background-color: #c0392b;
        }

        .admin-panel {
            max-width: 1000px;
            margin: 50px auto;
            padding: 20px;
            background-color: #ecf0f1;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .admin-panel h1, .admin-panel h2 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
        }

        .table-container {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 16px;
            table-layout: auto;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #2c3e50;
            color: white;
        }

        td {
            background-color: #ffffff;
        }
    </style>
</head>
<body>
    <nav class="navigation">
        <div class="LOGO">
            <a href="home.html"><img src="neighbors_logo.png" alt="Logo"></a>
            <a href="home.html">NEIGHBORS GREEN GROCER</a> 
        </div>          
        <ul class="links_menu">
            <li class="links_item">
                <a href="home.html" class="navigation_link">HOME</a>
            </li>
            <li class="links_item">
                <a href="Recipes.html" class="navigation_link">RECIPES</a>
            </li>
            <li class="links_item">
                <a href="shop.html" class="navigation_link">SHOP</a>
            </li>
            <li class="links_item">
                <a href="order.html" class="navigation_link">ORDER</a>
            </li> 
            <li class="links_item">
                <button id="logout-button" class="SignUp">Logout</button>
            </li>               
        </ul>       
    </nav>

    <div class="admin-panel">
        <h1>WELCOME ADMIN</h1>
        <?php
        // Display the items table
        displayTable($conn, 'items');
        // Display the users table
        displayTable($conn, 'users');
        // Display the orders table
        displayTable($conn, 'orders');
        ?>
    </div>

    <script>
        document.getElementById('logout-button').addEventListener('click', function(event) {
            event.preventDefault();
            const userConfirmed = confirm('Are you sure you want to log out?');
            if (userConfirmed) {
                window.location.href = 'logout.php';
            }
        });
    </script>
</body>
</html>

<?php
$conn->close();
?>
