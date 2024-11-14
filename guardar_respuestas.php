<?php
// Conexión a la base de datos
$con = mysqli_connect("localhost", "root", "feb22mar02AR.", "histgame");

if (!$con) {
    die("Error de conexión: " . mysqli_connect_error());
}

// Respuestas correctas
$respuestas_correctas = ['q1' => 'a', 'q2' => 'b', 'q3' => 'b'];
$respuestas_usuario = [];
$puntaje = 0;

// Evitamos inyecciones SQL en el nombre del usuario
$nombre_usuario = mysqli_real_escape_string($con, $_POST['nombre']);

// Insertar el nombre del usuario y obtener el ID
$sql = "INSERT INTO users (name) VALUES ('$nombre_usuario')";
mysqli_query($con, $sql);
$usuario_id = mysqli_insert_id($con);

// Iterar sobre las preguntas y guardar respuestas
foreach ($respuestas_correctas as $pregunta => $respuesta_correcta) {
    $respuesta_usuario = isset($_POST['respuestas'][$pregunta]) ? $_POST['respuestas'][$pregunta] : 'no seleccionada';
    
    if ($respuesta_usuario === $respuesta_correcta) {
        $puntaje++;
    }

    // Guardar la respuesta en la tabla 'answers'
    $sql_respuesta = "INSERT INTO answers (user_id, question_id, selected_answer, correct_answer) 
                      VALUES ($usuario_id, '$pregunta', '$respuesta_usuario', '$respuesta_correcta')";
    mysqli_query($con, $sql_respuesta);
}

// Insertar los resultados finales en la tabla 'results'
$sql_resultado = "INSERT INTO results (user_id, score) VALUES ($usuario_id, $puntaje)";
mysqli_query($con, $sql_resultado);

// Cerrar conexión
mysqli_close($con);

// Mostrar resultados
echo "<h3>Resultados:</h3>";
echo "<p>Acertaste $puntaje de 3 preguntas.</p>";

foreach ($respuestas_usuario as $pregunta => $respuestas) {
    echo "<p>";
    echo ucfirst(str_replace('_', ' ', $pregunta)) . ":<br>";
    echo "Opción seleccionada: " . $respuestas['respuesta_usuario'] . "<br>";
    echo "Opción correcta: " . $respuestas['respuesta_correcta'] . "<br>";
    echo "</p>";
}
?>

