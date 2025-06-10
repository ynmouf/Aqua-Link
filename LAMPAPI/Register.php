<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$firstName = $inData["FirstName"];
$lastName  = $inData["LastName"];
$login     = $inData["Login"];
$password  = $inData["Password"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // 1) Check for duplicates
    $check = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
    $check->bind_param("s", $login);
    $check->execute();
    $dup = $check->get_result()->num_rows;
    $check->close();

    if ($dup > 0) {
        returnWithError("Username is already taken.");
    } else {
        // 2) Insert new user
        $stmt = $conn->prepare(
            "INSERT INTO Users (FirstName, LastName, Login, Password)
             VALUES (?, ?, ?, ?)"
        );
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);

        if (!$stmt->execute()) {
            // insertion error
            returnWithError($stmt->error);
        } else {
            // 3) grab the new ID
            $newId = $stmt->insert_id;
            $stmt->close();
            $conn->close();

            // 4) return success payload
            header('Content-Type: application/json');
            echo json_encode([
                "error"     => "",
                "id"        => $newId,
                "firstName" => $firstName,
                "lastName"  => $lastName
            ]);
            exit;
        }
    }
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function returnWithError($err) {
    header('Content-Type: application/json');
    echo json_encode(["error" => $err]);
    exit;
}
?>
