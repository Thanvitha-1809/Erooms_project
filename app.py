from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "secret"

# Sample data
users = {
    "examiner": {"username": "examiner", "password": "pass", "role": "examiner"},
    "student": {"username": "student", "password": "pass", "role": "student"}
}

exams = [
    {"id": 1, "title": "Math Quiz", "questions": ["2+2?", "5-3?", "3*2?"]},
    {"id": 2, "title": "Science Quiz", "questions": ["What is H2O?", "What is gravity?"]}
]

# Home route
@app.route('/')
def index():
    return render_template('index.html')

# Login route
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if username in users and users[username]['password'] == password:
        session['user'] = users[username]
        return redirect(url_for('dashboard'))

    return "Invalid credentials. Try again."

# Dashboard route
@app.route('/dashboard')
def dashboard():
    if 'user' in session:
        if session['user']['role'] == 'examiner':
            return render_template('dashboard.html', user_type="examiner")
        elif session['user']['role'] == 'student':
            return render_template('dashboard.html', user_type="student", exams=exams)
    return redirect(url_for('index'))

# Create exam route (For Examiner)
@app.route('/create_exam', methods=['GET', 'POST'])
def create_exam():
    if 'user' in session and session['user']['role'] == 'examiner':
        if request.method == 'POST':
            exam_title = request.form['title']
            questions = request.form.getlist('questions')
            exams.append({"id": len(exams) + 1, "title": exam_title, "questions": questions})
            return redirect(url_for('dashboard'))

        return '''
            <form method="POST">
                <label>Exam Title:</label>
                <input type="text" name="title"><br>
                <label>Question 1:</label>
                <input type="text" name="questions"><br>
                <label>Question 2:</label>
                <input type="text" name="questions"><br>
                <label>Question 3:</label>
                <input type="text" name="questions"><br>
                <input type="submit" value="Create Exam">
            </form>
        '''
    return redirect(url_for('index'))

# Take exam route (For Student)
@app.route('/take_exam/<int:exam_id>', methods=['GET', 'POST'])
def take_exam(exam_id):
    if 'user' in session and session['user']['role'] == 'student':
        selected_exam = next((exam for exam in exams if exam['id'] == exam_id), None)
        if request.method == 'POST':
            # Collect answers (for simplicity, we're not storing answers in this example)
            return redirect(url_for('dashboard'))

        return render_template('take_exam.html', exam=selected_exam)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
