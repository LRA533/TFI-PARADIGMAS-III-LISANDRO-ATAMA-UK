let currentQuestion = 1;
let score = 0;
const answers = {
    q1: 'a',
    q2: 'b',
    q3: 'b'
};
let timer;
let timeLeft = 10; // Tiempo en segundos para cada pregunta

function showNameInput() {
    toggleVisibility('#nameInputContainer', true);
}

function startQuiz() {
    const userName = document.getElementById('userName').value;
    if (userName.trim() === '') {
        alert('Por favor, ingresa tu nombre.');
        return;
    }
    toggleVisibility('.title-container', false);
    toggleVisibility('.ww2-container', false);
    toggleVisibility('#nameInputContainer', false);
    toggleVisibility('#quizForm', true);
    resetTimer();
    showCurrentQuestion();
    startTimer();
}

function goBack() {
    toggleVisibility('.title-container', true);
    toggleVisibility('.ww2-container', true);
    toggleVisibility('#quizForm', false);
    toggleVisibility('#results', false);
    toggleVisibility('#nameInputContainer', false);
    resetQuiz();
    
    document.getElementById('userName').value = '';
}

function resetQuiz() {
    currentQuestion = 1;
    score = 0;
    resetTimer();
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    clearInterval(timer);
    document.getElementById('errorMessage').style.display = 'none';
}

function resetTimer() {
    timeLeft = 10; 
    document.getElementById('time').textContent = timeLeft;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function showCurrentQuestion() {
    document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
    document.getElementById(`question${currentQuestion}`).style.display = 'block';
}

function nextQuestion(event) {
    const currentAnswer = document.querySelector(`input[name=q${currentQuestion}]:checked`);
    document.getElementById('errorMessage').style.display = 'none';

    if (currentAnswer) {
        if (currentAnswer.value === answers[`q${currentQuestion}`]) {
            score++;
        }
    } else {
        if (event && event.target.classList.contains('submit-btn')) {
            document.getElementById('errorMessage').style.display = 'block';
            return;
        }
    }

    currentQuestion++;
    if (currentQuestion > 3) {
        clearInterval(timer);
        checkAnswers();
    } else {
        resetTimer();
        showCurrentQuestion();
        startTimer();
    }
}

function checkAnswers() {
    let answersDetails = [];
    for (let [key, value] of Object.entries(answers)) {
        const selected = document.querySelector(`input[name=${key}]:checked`);
        const questionTitle = document.querySelector(`#question${key.replace('q', '')} .question-title`).textContent;
        const selectedOption = selected ? selected.value : 'no seleccionada';
        const correctOption = value;
        
        // Definir las opciones para cada pregunta
        let opcionesDisponibles = '';
        if (key === 'q1') {
            opcionesDisponibles = 'a: 1939<br>b: 1941<br>c: 1945';
        } else if (key === 'q2') {
            opcionesDisponibles = 'a: Francia<br>b: Alemania<br>c: Italia';
        } else if (key === 'q3') {
            opcionesDisponibles = 'a: La invasión de Polonia<br>b: El ataque a Pearl Harbor<br>c: La firma del Tratado de Versalles';
        }
        
        answersDetails.push({
            pregunta: questionTitle,
            opciones: `Opciones disponibles:<br>${opcionesDisponibles}`,
            respuesta_seleccionada: `Opción seleccionada: ${selectedOption === 'no seleccionada' ? 'no seleccionada' : selectedOption}`,
            respuesta_correcta: `Opción correcta: ${correctOption}`,
        });
    }

    const userName = document.getElementById('userName').value;
    saveResults(userName, answersDetails);

    // Mostrar el resultado final
    const result = document.getElementById('result');
    result.innerHTML = `Acertaste ${score} de 3 preguntas.`;
    document.getElementById('answersDetails').innerHTML = `<strong>Respuestas:</strong><br>${answersDetails.map(answer => 
        `<strong>Pregunta:</strong> ${answer.pregunta}<br>
        ${answer.opciones}<br>
        ${answer.respuesta_seleccionada}<br>
        ${answer.respuesta_correcta}<br><br>`
    ).join('')}`;

    // Ocultar el formulario del cuestionario y mostrar los resultados
    toggleVisibility('#quizForm', false);
    toggleVisibility('#results', true);
}

function toggleVisibility(selector, isVisible) {
    document.querySelector(selector).style.display = isVisible ? 'block' : 'none';
}

function saveResults(userName, answersDetails) {
    fetch('/ruta/a/tu/archivo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: userName,
            respuestas: answersDetails
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
