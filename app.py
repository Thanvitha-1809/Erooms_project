import time
import psutil

# Simulated exam application name (change to the actual application name)
EXAM_APP_NAME = "ExamApp"

def is_exam_app_active():
    """Check if the exam application is currently active."""
    for process in psutil.process_iter(attrs=['name']):
        if EXAM_APP_NAME.lower() in process.info['name'].lower():
            return True
    return False

def monitor_exam_app(interval=5):
    """Continuously monitor if the exam app is the active window."""
    try:
        print("Monitoring exam application activity...")
        while True:
            if not is_exam_app_active():
                print("Warning: The exam window is not active! Possible violation detected.")
            else:
                print("Exam application is active.")
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\nMonitoring stopped.")

# Start monitoring
monitor_exam_app(interval=5)
