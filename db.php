<?php
// db.php: Conexión a la base de datos

$servername = "localhost";
$username = "root";
$password = "feb22mar03AR.";
$dbname = "histgame";

// Crear conexión
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Verificar la conexión
if (!$conn) {
    die("Conexión fallida: " . mysqli_connect_error());
}
?>
