<?php
// Include database configuration
require_once 'config.php';

// Set header untuk response JSON
header('Content-Type: application/json');

// Process form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validasi required fields
    $required = ['nama', 'email', 'telepon', 'alamat', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'persetujuan'];
    $missing = array_diff($required, array_keys($_POST));
    
    if (!empty($missing)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Data tidak lengkap: ' . implode(', ', $missing)]);
        exit();
    }

    // Validate and sanitize input data
    $nama = $conn->real_escape_string(trim($_POST["nama"]));
    $email = $conn->real_escape_string(trim($_POST["email"]));
    $telepon = $conn->real_escape_string(trim($_POST["telepon"]));
    $alamat = $conn->real_escape_string(trim($_POST["alamat"]));
    $tempat_lahir = $conn->real_escape_string(trim($_POST["tempat_lahir"]));
    $tanggal_lahir = $conn->real_escape_string(trim($_POST["tanggal_lahir"]));
    $jenis_kelamin = $conn->real_escape_string(trim($_POST["jenis_kelamin"]));
    $pekerjaan = isset($_POST["pekerjaan"]) ? $conn->real_escape_string(trim($_POST["pekerjaan"])) : '';
    $alasan = isset($_POST["alasan"]) ? $conn->real_escape_string(trim($_POST["alasan"])) : '';
    $persetujuan = $_POST["persetujuan"] === 'true' ? 1 : 0;
    
    // Validasi email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Format email tidak valid']);
        exit();
    }

    // Check if email already exists
    $check_email = "SELECT id FROM pendaftaran WHERE email = ?";
    if ($stmt = $conn->prepare($check_email)) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email sudah terdaftar. Silakan gunakan email lain.']);
            $stmt->close();
            $conn->close();
            exit();
        }
        $stmt->close();
    }
    
    // Prepare an insert statement
    $sql = "INSERT INTO pendaftaran (
        nama, 
        email, 
        telepon, 
        alamat, 
        tempat_lahir, 
        tanggal_lahir, 
        jenis_kelamin, 
        pekerjaan, 
        alasan,
        persetujuan,
        tanggal_daftar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    if ($stmt = $conn->prepare($sql)) {
        // Bind variables to the prepared statement as parameters
        $stmt->bind_param(
            "sssssssssi", 
            $nama, 
            $email, 
            $telepon, 
            $alamat, 
            $tempat_lahir, 
            $tanggal_lahir, 
            $jenis_kelamin, 
            $pekerjaan, 
            $alasan,
            $persetujuan
        );
        
        // Attempt to execute the prepared statement
        if ($stmt->execute()) {
            // Registration successful
            $last_id = $stmt->insert_id;
            
            // Send confirmation email (optional)
            $to = $email;
            $subject = "Pendaftaran PSHT Rayo Padepokan";
            $message = "Halo $nama,\n\nTerima kasih telah mendaftar di PSHT Rayo Padepokan. "
                . "Nomor pendaftaran Anda adalah: PSHT-$last_id\n\n"
                . "Silakan datang ke padepokan kami dengan membawa:\n"
                . "- Fotokopi KTP/Kartu Pelajar\n"
                . "- Pas foto 3x4 (2 lembar)\n"
                . "- Biaya pendaftaran Rp 250.000\n\n"
                . "Salam,\nPSHT Rayo Padepokan";
            $headers = "From: pendaftaran@psht-rayo.org";
            
            mail($to, $subject, $message, $headers);
            
            echo json_encode([
                'success' => true,
                'message' => 'Pendaftaran berhasil!',
                'registration_id' => $last_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan database. Silakan coba lagi.']);
        }
        
        // Close statement
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan persiapan query.']);
    }
    
    // Close connection
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit();
}
?>