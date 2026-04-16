const STORAGE_KEY = 'tw-todos-app';
let todos = [];

function initTodoApp() {
    const form = document.getElementById('todo-form');
    form.addEventListener('submit', handleTodoSubmit);
    loadTodos();
    renderTodos();
}

function handleTodoSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('todo-input');
    const value = input.value.trim();
    const validation = validateTodoText(value);

    if (validation !== true) {
        showFeedback(validation, 'danger');
        return;
    }

    addTodo(value);
    input.value = '';
    showFeedback('Tarefa adicionada com sucesso.', 'success');
}

function validateTodoText(text) {
    if (text.length < 3) {
        return 'A tarefa deve ter ao menos 3 caracteres.';
    }

    if (!/^[A-ZÀ-Ú]/.test(text)) {
        return 'A tarefa deve começar com letra maiúscula.';
    }

    return true;
}

function addTodo(text) {
    todos.push({ id: Date.now(), text });
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
    showFeedback('Tarefa removida.', 'info');
}

function moveTodo(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= todos.length) {
        return;
    }

    [todos[index], todos[targetIndex]] = [todos[targetIndex], todos[index]];
    saveTodos();
    renderTodos();
}

function renderTodos() {
    const list = document.getElementById('todo-list');
    const emptyMessage = document.getElementById('empty-message');
    list.innerHTML = '';

    if (todos.length === 0) {
        emptyMessage.classList.remove('d-none');
        return;
    }

    emptyMessage.classList.add('d-none');

    todos.forEach((todo, index) => {
        const item = document.createElement('div');
        item.className = 'list-group-item list-group-item-action d-flex align-items-center';

        const text = document.createElement('div');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const controls = document.createElement('div');
        controls.className = 'todo-controls';

        const upButton = document.createElement('button');
        upButton.type = 'button';
        upButton.className = 'btn btn-sm btn-outline-secondary';
        upButton.textContent = '↑';
        upButton.disabled = index === 0;
        upButton.title = 'Move up';
        upButton.addEventListener('click', () => moveTodo(index, -1));

        const downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.className = 'btn btn-sm btn-outline-secondary';
        downButton.textContent = '↓';
        downButton.disabled = index === todos.length - 1;
        downButton.title = 'Move down';
        downButton.addEventListener('click', () => moveTodo(index, 1));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'btn btn-sm btn-danger';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTodo(index));

        controls.append(upButton, downButton, deleteButton);
        item.append(text, controls);
        list.appendChild(item);
    });
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        todos = stored ? JSON.parse(stored) : [];
    } catch (error) {
        todos = [];
    }
}

function showFeedback(message, type = 'danger') {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.classList.remove('text-danger', 'text-success', 'text-info');
    feedback.classList.add(type === 'success' ? 'text-success' : type === 'info' ? 'text-info' : 'text-danger');

    if (type !== 'danger') {
        window.setTimeout(() => {
            feedback.textContent = '';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', initTodoApp);
