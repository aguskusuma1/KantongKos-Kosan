<?php
// Izinkan CORS untuk testing lokal (di produksi, origin ini akan sama)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Konfigurasi Database (Ganti dengan kredensial Hostinger Anda)
$db_host = 'localhost';
$db_user = 'u928743533_kos'; // username database
$db_pass = 'Tabanan2005';     // password database
$db_name = 'u928743533_kantong'; // nama database

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "Koneksi database gagal. Cek konfigurasi di api.php"]);
    exit;
}

// Ambil input JSON
$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';
$user_id = $_SERVER['HTTP_X_USER_ID'] ?? null;

if ($action === 'register') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    if (!$email || !$password) {
        echo json_encode(["error" => "Email dan Password wajib diisi"]);
        exit;
    }
    
    $hash = password_hash($password, PASSWORD_BCRYPT);
    try {
        $stmt = $pdo->prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
        $stmt->execute([$email, $hash]);
        echo json_encode(["message" => "Registrasi berhasil"]);
    } catch(PDOException $e) {
        echo json_encode(["error" => "Email sudah terdaftar atau terjadi kesalahan"]);
    }
    exit;
}

if ($action === 'login') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password_hash'])) {
        // Simple token base, di aplikasi sungguhan gunakan JWT. Ini untuk demo.
        echo json_encode([
            "message" => "Login berhasil", 
            "user" => ["id" => $user['id'], "email" => $email]
        ]);
    } else {
        echo json_encode(["error" => "Email atau Password salah"]);
    }
    exit;
}

// Semua endpoint di bawah ini butuh auth (user_id)
if (!$user_id) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

if ($action === 'get_budget') {
    $month_year = $_GET['month_year'] ?? '';
    $stmt = $pdo->prepare("SELECT * FROM user_budgets WHERE user_id = ? AND month_year = ?");
    $stmt->execute([$user_id, $month_year]);
    $budget = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["data" => $budget]);
    exit;
}

if ($action === 'save_budget') {
    $month_year = $input['month_year'] ?? '';
    $total_budget = $input['total_budget'] ?? 0;
    
    $stmt = $pdo->prepare("
        INSERT INTO user_budgets (user_id, month_year, total_budget) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE total_budget = VALUES(total_budget)
    ");
    $stmt->execute([$user_id, $month_year, $total_budget]);
    
    // fetch saved budget
    $stmt = $pdo->prepare("SELECT * FROM user_budgets WHERE user_id = ? AND month_year = ?");
    $stmt->execute([$user_id, $month_year]);
    $budget = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["data" => $budget]);
    exit;
}

if ($action === 'get_expenses') {
    $start_date = $_GET['start_date'] ?? '';
    $end_date = $_GET['end_date'] ?? '';
    
    $stmt = $pdo->prepare("SELECT * FROM expenses WHERE user_id = ? AND expense_date >= ? AND expense_date <= ? ORDER BY expense_date ASC");
    $stmt->execute([$user_id, $start_date, $end_date]);
    $expenses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["data" => $expenses]);
    exit;
}

if ($action === 'add_expense') {
    $amount = $input['amount'] ?? 0;
    $description = $input['description'] ?? '';
    $expense_date = $input['expense_date'] ?? date('Y-m-d');
    
    $stmt = $pdo->prepare("INSERT INTO expenses (user_id, amount, description, expense_date) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $amount, $description, $expense_date]);
    
    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM expenses WHERE id = ?");
    $stmt->execute([$id]);
    $expense = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(["data" => $expense]);
    exit;
}

echo json_encode(["error" => "Aksi tidak dikenali"]);
