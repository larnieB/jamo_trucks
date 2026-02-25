<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning"); // Add this line
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Add this line
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight 'OPTIONS' request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "truck_management";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    exit;
}

$sql = "SELECT * FROM trucks ORDER BY created_at DESC";
$result = $conn->query($sql);

$trucks = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Since we stored images as a comma-separated string, convert back to array
        $row['images'] = $row['images'] ? explode(',', $row['images']) : [];
        $trucks[] = $row;
    }
}

echo json_encode($trucks);
$conn->close();
?>