<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight 'OPTIONS' request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "truck_management"; // Assumed from your existing getTrucks.php

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    exit;
}

// Fetch all drivers
$sql = "SELECT * FROM drivers ORDER BY id DESC";
$result = $conn->query($sql);

$drivers = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Convert comma-separated document paths back into an array
        $row['documents'] = $row['documents'] ? explode(',', $row['documents']) : [];
        $drivers[] = $row;
    }
}

echo json_encode($drivers);
$conn->close();
?>