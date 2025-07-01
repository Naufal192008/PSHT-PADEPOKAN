<?php
// Aktifkan error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database configuration
require_once 'config.php';

// Set header untuk response JSON
header('Content-Type: application/json');

// Process form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Validasi required fields
        $required = ['nama', 'email', 'telepon', 'alamat', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin'];
        $missing = array_diff($required, array_keys($_POST));
        
        if (!empty($missing)) {
            throw new Exception('Data tidak lengkap: ' . implode(', ', $missing));
        }

        // Validate and sanitize input data
        $nama = trim($_POST["nama"]);
        $email = trim($_POST["email"]);
        $telepon = trim($_POST["telepon"]);
        $alamat = trim($_POST["alamat"]);
        $tempat_lahir = trim($_POST["tempat_lahir"]);
        $tanggal_lahir = trim($_POST["tanggal_lahir"]);
        $jenis_kelamin = trim($_POST["jenis_kelamin"]);
        $pekerjaan = isset($_POST["pekerjaan"]) ? trim($_POST["pekerjaan"]) : '';
        $alasan = isset($_POST["alasan"]) ? trim($_POST["alasan"]) : '';
        $persetujuan = isset($_POST["persetujuan"]) && $_POST["persetujuan"] === 'true' ? 1 : 0;
        
        // Validasi panjang input
        if (strlen($nama) > 100) throw new Exception('Nama terlalu panjang (maks 100 karakter)');
        if (strlen($email) > 100) throw new Exception('Email terlalu panjang (maks 100 karakter)');
        if (strlen($telepon) > 20) throw new Exception('Nomor telepon terlalu panjang (maks 20 digit)');
        
        // Validasi email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Format email tidak valid');
        }

        // Check if email already exists
        $check_email = "SELECT id FROM pendafarzan WHERE email = ?";
        $stmt = $conn->prepare($check_email);
        if (!$stmt) throw new Exception('Persiapan query gagal: ' . $conn->error);
        
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows > 0) {
            throw new Exception('Email sudah terdaftar. Silakan gunakan email lain.');
        }
        $stmt->close();
        
        // Prepare an insert statement
        $sql = "INSERT INTO pendafarzan (
            nama, email, telepon, alamat, tempat_lahir, 
            tanggal_lahir, jenis_kelamin, pekerjaan, alasan,
            persetujuan, tanggal_daftar
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new Exception('Persiapan query gagal: ' . $conn->error);
        
        // Bind variables to the prepared statement as parameters
        $stmt->bind_param(
            "sssssssssi", 
            $nama, $email, $telepon, $alamat, $tempat_lahir, 
            $tanggal_lahir, $jenis_kelamin, $pekerjaan, $alasan,
            $persetujuan
        );
        
        // Execute the prepared statement
        if (!$stmt->execute()) {
            throw new Exception('Eksekusi query gagal: ' . $stmt->error);
        }
        
        // Registration successful
        $last_id = $stmt->insert_id;
        $stmt->close();
        
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
        
        // Hanya mencoba mengirim email, tapi tidak menghentikan proses jika gagal
        @mail($to, $subject, $message, $headers);
        
        echo json_encode([
            'success' => true,
            'message' => 'Pendaftaran berhasil!',
            'registration_id' => $last_id
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    } finally {
        if (isset($stmt) && $stmt) $stmt->close();
        if (isset($conn) && $conn) $conn->close();
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
}
?>