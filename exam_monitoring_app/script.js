let questions = [];
let tabSwitchCount = 0;
let examSubmitted = false;
let switchLog = [];

// Show and hide different pages
function showHomePage() {
    document.getElementById("homePage").style.display = "block";
    document.getElementById("teacherPage").style.display = "none";
    document.getElementById("studentPage").style.display = "none";
}

function showTeacherPage() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("teacherPage").style.display = "block";
}

function showStudentPage() {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("studentPage").style.display = "block";
    loadExam();
}

// Add questions to the exam
function addQuestion() {
    const questionText = document.getElementById("question").value;
    const options = [
        document.getElementById("option1").value,
        document.getElementById("option2").value,
        document.getElementById("option3").value,
        document.getElementById("option4").value,
    ];
    const correctAnswer = document.getElementById("correctAnswer").value;
    questions.push({ question: questionText, options: options, correctAnswer: correctAnswer });

    // Clear fields
    document.getElementById("question").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("option4").value = "";
}

// Schedule the exam and save questions to localStorage
function scheduleExam() {
    localStorage.setItem("scheduledExam", JSON.stringify(questions));
    document.getElementById("scheduledMessage").style.display = "block";
}

// Load the exam for students from localStorage
function loadExam() {
    const savedQuestions = JSON.parse(localStorage.getItem("scheduledExam"));
    const examForm = document.getElementById("examQuestions");
    examForm.innerHTML = "";
    if (savedQuestions && savedQuestions.length > 0) {
        savedQuestions.forEach((q, index) => {
            let optionsHtml = '';
            q.options.forEach((option, optIndex) => {
                optionsHtml += `
                    <input type="radio" name="question${index}" value="${optIndex + 1}"> ${option}<br>
                `;
            });
            examForm.innerHTML += `
                <div>
                    <label>${q.question}</label><br>
                    ${optionsHtml}<br><br>
                </div>
            `;
        });
    } else {
        examForm.innerHTML = "<p>No exam scheduled.</p>";
    }
}

// Submit the exam
function submitExam() {
    examSubmitted = true;
    const savedQuestions = JSON.parse(localStorage.getItem("scheduledExam"));
    const studentAnswers = [];
    if (savedQuestions) {
        savedQuestions.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            const answer = selectedOption ? selectedOption.value : null;
            studentAnswers.push({
                question: q.question,
                studentAnswer: answer,
                correctAnswer: q.correctAnswer,
                isCorrect: answer === q.correctAnswer
            });
        });
    }
    localStorage.setItem("studentExamResults", JSON.stringify(studentAnswers));
    alert("Exam submitted successfully!");

    // Show result message
    const resultDiv = document.getElementById("resultMessage");
    resultDiv.innerHTML = "Exam Results:<br>";
    studentAnswers.forEach((result, i) => {
        resultDiv.innerHTML += `<b>Q${i + 1}:</b> ${result.question}<br> 
                                Your Answer: Option ${result.studentAnswer}<br>
                                Correct Answer: Option ${result.correctAnswer}<br>
                                Result: ${result.isCorrect ? "Correct" : "Incorrect"}<br><br>`;
    });
    resultDiv.style.display = "block";

    // Log and save tab switch details
    localStorage.setItem("switchLog", JSON.stringify(switchLog));
}

// Track tab switches and warn the student
window.addEventListener("blur", function () {
    if (examSubmitted) return;

    tabSwitchCount++;
    switchLog.push({ timestamp: new Date().toISOString() });

    if (tabSwitchCount <= 3) {
        alert(`Warning: You have switched tabs ${tabSwitchCount} times.`);
    }
    if (tabSwitchCount === 3) {
        alert("You have been automatically logged out. The exam will be submitted now.");
        submitExam();
    }
});
