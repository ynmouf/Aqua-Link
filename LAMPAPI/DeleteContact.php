<?php
  $inData = json_decode(file_get_contents('php://input'), true);

  $contactId = $inData["ContactID"];
  $userId    = $inData["UserID"];

  $conn = new mysqli("localhost","TheBeast","WeLoveCOP4331","COP4331");
  if ($conn->connect_error) {
    returnWithError($conn->connect_error);
  } else {
    // Delete only the single contact by its ID *and* ensure it belongs to this user
    $stmt = $conn->prepare(
      "DELETE FROM Contacts 
         WHERE ID = ? AND UserID = ?"
    );
    $stmt->bind_param("ii", $contactId, $userId);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithError("");
  }

  function returnWithError($err) {
    header('Content-Type: application/json');
    echo '{"error":"' . $err . '"}';
  }
?>

