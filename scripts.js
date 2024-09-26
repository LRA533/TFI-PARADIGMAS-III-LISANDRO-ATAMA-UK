let currentQuestion = 1;
let score = 0;
const answers = {
    q1: 'a',
    q2: 'b',
    q3: 'b'
};
let timer;
let timeLeft = 8; // Cambiado a 8 segundos

function showQuiz() {
    toggleVisibility('.title-container', false);
    toggleVisibility('.ww2-container', false);
    toggleVisibility('#quizForm', true);
    toggleVisibility('#results', false);
    resetTimer(); // Reiniciar el temporizador al mostrar el cuestionario
    showCurrentQuestion();
    startTimer();
}

function goBack() {
    toggleVisibility('.title-container', true);
    toggleVisibility('.ww2-container', true);
    toggleVisibility('#quizForm', false);
    toggleVisibility('#results', false);
    resetQuiz();
}

function resetQuiz() {
    currentQuestion = 1;
    score = 0;
    resetTimer(); // Reiniciar el temporizador
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    clearInterval(timer);
    document.getElementById('errorMessage').style.display = 'none'; // Ocultar mensaje de error
}

function resetTimer() {
    timeLeft = 8; // Cambiado a 8 segundos
    document.getElementById('time').textContent = timeLeft;
}

function startTimer() {
    clearInterval(timer); // Asegurarse de que no haya múltiples temporizadores
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion(); // Avanzar a la siguiente pregunta cuando se agota el tiempo
        }
    }, 1000);
}

function showCurrentQuestion() {
    document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
    document.getElementById(`question${currentQuestion}`).style.display = 'block';
}

function nextQuestion(event) {
    const currentAnswer = document.querySelector(`input[name=q${currentQuestion}]:checked`);
    
    // Ocultar el mensaje de error al mostrar una nueva pregunta
    document.getElementById('errorMessage').style.display = 'none';

    // Si hay respuesta seleccionada, verificar si es correcta
    if (currentAnswer) {
        if (currentAnswer.value === answers[`q${currentQuestion}`]) {
            score++;
        }
    } else {
        // Si se presiona el botón y no hay respuesta seleccionada, mostrar mensaje de error
        if (event && event.target.classList.contains('submit-btn')) {
            document.getElementById('errorMessage').style.display = 'block'; // Mostrar mensaje de error
            return; // Salir de la función para no avanzar a la siguiente pregunta
        }
    }

    currentQuestion++;
    if (currentQuestion > 3) {
        clearInterval(timer);
        checkAnswers();
    } else {
        resetTimer(); // Reiniciar el temporizador para la siguiente pregunta
        showCurrentQuestion();
        startTimer(); // Iniciar el temporizador
    }
}

function checkAnswers() {
    let answersDetails = '';
    for (let [key, value] of Object.entries(answers)) {
        const selected = document.querySelector(`input[name=${key}]:checked`);
        const questionTitle = document.querySelector(`#question${key.replace('q', '')} .question-title`).textContent;
        const selectedOption = selected ? selected.value : 'No seleccionada';
        const correctOption = value;

        const options = document.querySelectorAll(`#question${key.replace('q', '')} .question-options label`);
        const optionsText = Array.from(options).map(option => option.textContent.trim()).join('<br>');

        answersDetails += `<strong>Pregunta ${key.replace('q', '')}:</strong><br>${questionTitle}<br>${optionsText}<br>Opción seleccionada: ${selectedOption}<br>Opción correcta: ${correctOption}<br><br>`;
    }

    const result = document.getElementById('result');
    result.innerHTML = `Acertaste ${score} de 3 preguntas.`;
    document.getElementById('answersDetails').innerHTML = `<strong>Respuestas:</strong><br>${answersDetails}`;
    toggleVisibility('#quizForm', false);
    toggleVisibility('#results', true);
}

function toggleVisibility(selector, isVisible) {
    document.querySelector(selector).style.display = isVisible ? 'block' : 'none';
}

