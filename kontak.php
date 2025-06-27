<?php
// Include database configuration
require_once 'config.php';

// Process form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize input data
    $name = $conn->real_escape_string(trim($_POST["name"]));
    $email = $conn->real_escape_string(trim($_POST["email"]));
    $subject = $conn->real_escape_string(trim($_POST["subject"]));
    $message = $conn->real_escape_string(trim($_POST["message"]));
    
    // Prepare an insert statement
    $sql = "INSERT INTO kontak (nama, email, subjek, pesan, tanggal_kirim) VALUES (?, ?, ?, ?, NOW())";
    
    if ($stmt = $conn->prepare($sql)) {
        // Bind variables to the prepared statement as parameters
        $stmt->bind_param("ssss", $name, $email, $subject, $message);
        
        // Attempt to execute the prepared statement
        if ($stmt->execute()) {
            // Send notification email (optional)
            $to = "info@psht-rayo.org";
            $email_subject = "Pesan Baru dari Website: $subject";
            $email_body = "Anda menerima pesan baru dari website PSHT Rayo Padepokan.\n\n".
                          "Nama: $name\n".
                          "Email: $email\n".
                          "Pesan:\n$message";
            $headers = "From: $email";
            
            mail($to, $email_subject, $email_body, $headers);
            
            // Redirect to thank you page
            header("Location: terima-kasih.html");
            exit();
        } else {
            echo "Terjadi kesalahan. Silakan coba lagi nanti.";
        }
        
        // Close statement
        $stmt->close();
    }
    
    // Close connection
    $conn->close();
} else {
    // Not a POST request, redirect to contact page
    header("Location: kontak.html");
    exit();
}
?>