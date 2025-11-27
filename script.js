// Toggle completed when clicking a task (but ignore clicks on the close button)
document.getElementById('taskList').addEventListener('click', function(e) {
    if (e.target.classList.contains('close')) return; // let close handler manage removal
    const li = e.target.closest('li');
    if (li) {
        li.classList.toggle('completed');
        saveTasks(); // persist immediately when toggling completed
    }
});

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
    
function AddTask() {
    if (taskInput.value.trim() == '') {
        alert('Please enter a task.');
    }
    else {
        const li = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = taskInput.value;
        li.appendChild(textSpan);

        const span = document.createElement('span');
        span.textContent = '\u00D7';
        span.className = 'close';
        li.appendChild(span);

        // animate in
        li.classList.add('animate-in');
        li.addEventListener('animationend', function handler() {
            li.classList.remove('animate-in');
            li.removeEventListener('animationend', handler);
        });

        taskList.appendChild(li);
        taskInput.value = '';
        saveTasks(); // save after adding
    }
}

// Close button functionality
taskList.addEventListener('click', function(e) {
    if (e.target.classList.contains('close')) {
        const li = e.target.parentElement;
        // play remove animation then remove and save
        li.classList.add('animate-out');
        li.addEventListener('animationend', function handler() {
            li.removeEventListener('animationend', handler);
            li.remove();
            saveTasks();
            
            // Check if this was the last task
            if (taskList.querySelectorAll('li').length === 0) {
                // First add fade-out to trigger the transition
                taskList.classList.add('fade-out');
                // Wait for fade out to complete before adding empty class
                taskList.addEventListener('transitionend', function hideHandler(e) {
                    if (e.propertyName === 'opacity') {
                        taskList.removeEventListener('transitionend', hideHandler);
                        taskList.classList.add('empty');
                    }
                });
            }
        });
    }
});

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(function(li) {
        tasks.push({
            text: li.firstChild.textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskListVisibility();
}

function updateTaskListVisibility() {
    if (taskList.querySelectorAll('li').length === 0) {
        taskList.classList.add('empty');
        // Add animation class to container
        taskList.classList.add('fade-out');
        // Remove animation class after it completes
        taskList.addEventListener('transitionend', function handler() {
            taskList.classList.remove('fade-out');
            taskList.removeEventListener('transitionend', handler);
        });
    } else {
        taskList.classList.remove('empty');
        taskList.classList.add('fade-in');
        // Remove animation class after it completes
        taskList.addEventListener('transitionend', function handler() {
            taskList.classList.remove('fade-in');
            taskList.removeEventListener('transitionend', handler);
        });
    }
}

function showTasks() {
    // clear existing list first
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Immediately hide if there are no tasks
    if (tasks.length === 0) {
        taskList.classList.add('empty');
        return;
    }
    
    // Remove empty class if there are tasks
    taskList.classList.remove('empty');
    
    tasks.forEach(function(task) {
        const li = document.createElement('li');
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        li.appendChild(textSpan);

        if (task.completed) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = '\u00D7';
        span.className = 'close';
        li.appendChild(span);

        taskList.appendChild(li);
    });
}

window.onload = function() {
    showTasks();
    // Ensure empty state is set correctly on load
    if (taskList.querySelectorAll('li').length === 0) {
        taskList.classList.add('empty');
    }
};

window.onunload = function() {
    saveTasks();
};  

