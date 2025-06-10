<?php

    $inData = getRequestInfo();
    
    $searchResults = "";
    $searchCount = 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
       
        $normalized = str_replace(' ', '', $inData["search"]);
        $pattern    =  $normalized . "%";

       
        $stmt = $conn->prepare("
            SELECT ID, FirstName, LastName, Email, Phone
              FROM Contacts
             WHERE UserID = ?
               AND (
                    FirstName    LIKE ?
                 OR LastName     LIKE ?
                 OR REPLACE(CONCAT(FirstName, LastName), ' ', '') LIKE ?
                 OR Email        LIKE ?
                 OR Phone        LIKE ?
               )
        ");
        // Bind: i = UserID, sssss = the same pattern for each LIKE
        $stmt->bind_param(
            "isssss",
            $inData["UserId"],
            $pattern,
            $pattern,
            $pattern,
            $pattern,
            $pattern
        );
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc())
        {
            if( $searchCount > 0 ) $searchResults .= ",";
            $searchCount++;
            $searchResults .= '{'
                . '"ID":'.       $row["ID"]         .','
                . '"FirstName":"'.$row["FirstName"].'",'
                . '"LastName":"'.$row["LastName"].'",'
                . '"Email":"'.$row["Email"].'",'
                . '"Phone":"'.$row["Phone"].'"'
            . '}';
        }
        
        if( $searchCount == 0 )
        {
            returnWithError( "No Records Found" );
        }
        else
        {
            returnWithInfo( $searchResults );
        }
        
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError( $err )
    {
        $retValue = '{"results":[],"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $searchResults )
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }
    
?>
