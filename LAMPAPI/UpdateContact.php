<?php
  header('Content-Type: application/json');

  $inData = json_decode(file_get_contents('php://input'), true);

  $firstName = $inData["FirstName"]  ?? "";
  $lastName  = $inData["LastName"]   ?? "";
  $phone     = $inData["Phone"]      ?? "";
  $email     = $inData["Email"]      ?? "";
  $userId    = intval($inData["UserID"]   ?? 0);
  $contactId = intval($inData["ContactID"]?? 0);

  $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
  if ($conn->connect_error) {
    returnWithError($conn->connect_error);
  } else {

    $stmt = $conn->prepare("
      UPDATE Contacts
         SET FirstName = ?, LastName = ?, Phone = ?, Email = ?
       WHERE ID       = ?
         AND UserID   = ?
    ");
    $stmt->bind_param(
      "ssssii",
      $firstName,
      $lastName,
      $phone,
      $email,
      $contactId,
      $userId
    );

    if (!$stmt->execute()) {
      returnWithError($stmt->error);
    } else {
      returnWithError("");
    }

    $stmt->close();
    $conn->close();
  }

  function returnWithError($err) {
    echo json_encode(["error" => $err]);
  }
?>
