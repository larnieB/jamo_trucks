<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight 'OPTIONS' request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "truck_management";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// 1. Process Text Data from FormData
$fullName = $_POST['fullName'] ?? '';
$phoneNumber = $_POST['phoneNumber'] ?? '';
$email = $_POST['email'] ?? '';
$licenseClass = $_POST['licenseClass'] ?? '';
$experienceYears = $_POST['experienceYears'] ?? 0;
$currentLocation = $_POST['currentLocation'] ?? '';
$expectedSalary = $_POST['expectedSalary'] ?? 0;
$availability = $_POST['availability'] ?? 'Immediate';

// 2. Handle File Uploads (Documents/Images)
$uploadedFiles = [];
$uploadDir = "../assets/drivers/"; // Ensure this directory exists and is writable

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (isset($_FILES['documents'])) {
    foreach ($_FILES['documents']['tmp_name'] as $key => $tmpName) {
        $fileName = time() . "_" . $_FILES['documents']['name'][$key];
        $targetFilePath = $uploadDir . $fileName;
        
        if (move_uploaded_file($tmpName, $targetFilePath)) {
            // Save the relative path for the frontend to access via BASE_URL
            $uploadedFiles[] = "src/assets/drivers/" . $fileName;
        }
    }
}

// Convert image paths array to comma-separated string
$imagePathsString = implode(',', $uploadedFiles);

// 3. Insert into Database
$sql = "INSERT INTO drivers (
    full_name, 
    phone_number, 
    email, 
    license_class, 
    experience_years, 
    current_location, 
    expected_salary, 
    availability, 
    documents
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "ssssisiss", 
    $fullName, 
    $phoneNumber, 
    $email, 
    $licenseClass, 
    $experienceYears, 
    $currentLocation, 
    $expectedSalary, 
    $availability, 
    $imagePathsString
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Driver registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error saving to database: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>