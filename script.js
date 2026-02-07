// Data extracted from your QUIZ.sql file
const questions = [
    {
        id: 1,
        text: "If vector A = 3i - 2j + 5k and vector B = 4i + 4k, what is the value of the scalar product (A · B)?",
        options: ["12", "20", "32", "7"],
        answer: 2 // Index of '32'
    },
    {
        id: 2,
        text: "In central force motion (e.g., planetary motion), which quantity is always conserved?",
        options: ["Linear momentum", "Angular momentum", "Kinetic energy", "Total force"],
        answer: 1
    }
    // ... add other questions from the SQL dump here
];

let currentQuestionIndex = 0;
let score = 0;

// Navigation Logic
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('question-number').innerText = `${currentQuestionIndex + 1}. QUESTION`;
    document.getElementById('question-text').innerText = q.text;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    q.options.forEach((opt, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerText = opt;
        div.onclick = () => selectOption(div, index);
        container.appendChild(div);
    });
}

function selectOption(el, index) {
    document.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    el.dataset.selectedIndex = index;
}

function nextQuestion() {
    const selected = document.querySelector('.option-item.selected');
    if (!selected) return alert("Please select an answer!");

    if (parseInt(selected.dataset.selectedIndex) === questions[currentQuestionIndex].answer) {
        score++;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    showScreen('result-screen');
    document.getElementById('final-score').innerText = `${score} / ${questions.length}`;
}

// PDF EXTRACTION LOGIC
document.getElementById('pdf-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function() {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(s => s.str).join(" ");
        }

        console.log("Extracted PDF Content:", fullText);
        alert("PDF Upload Successful! Questions extracted (check console).");
        // Logic to parse 'fullText' into the questions array would go here
    };
    reader.readAsArrayBuffer(file);
});
