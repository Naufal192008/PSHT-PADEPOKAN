<?php
$servername = "localhost";
$username = "username_db";
$password = "password_db";
$dbname = "nama_database";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
