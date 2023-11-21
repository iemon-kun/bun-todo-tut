// ToDoリストを取得して表示する関数
function fetchToDos() {
    fetch('/todo')
        .then(response => response.json())
        .then(toDos => {
            saveToDos(toDos);
            displayToDos(toDos);
        })
        .catch(error => {
            console.error('Error fetching todos:', error);
            displayError('Failed to load todos.');
            // サーバーからの取得に失敗した場合、ローカルストレージから読み込む
            const savedToDos = loadToDos();
            if (savedToDos.length > 0) {
                displayToDos(savedToDos);
            }
        });
}

// ToDoリストを表示する関数
function displayToDos(toDos) {
    const listElement = document.getElementById('todo-list');
    listElement.innerHTML = ''; // リストをクリア
    toDos.forEach(toDo => {
        const listItem = document.createElement('li');
        listItem.textContent = toDo.title;

        if (toDo.completed) {
            listItem.classList.add('completed');
        }

        // チェックボックスの追加
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.checked = toDo.completed;
        checkBox.onchange = () => toggleComplete(toDo.id, checkBox.checked);
        listItem.prepend(checkBox);

        // 削除ボタンの追加
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteToDo(toDo.id);
        listItem.appendChild(deleteButton);

        listElement.appendChild(listItem);
    });
}


// 新しいToDoを追加する関数
function addToDo(event) {
    event.preventDefault(); // デフォルトの送信動作を防ぐ
    const toDoInput = document.getElementById('todo-input');
    const toDoTitle = toDoInput.value.trim();
    if (!toDoTitle) return; // 空の場合は追加しない

    fetch('/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: toDoTitle }),
    })
        .then(response => response.json())
        .then(newToDo => {
            fetchToDos(); // リストを更新
            toDoInput.value = ''; // 入力フィールドをクリア
        })
        .catch(error => {
            console.error('Error adding todo:', error);
            displayError('Failed to load todo.');
        });
}

// ToDoアイテムを削除する関数
function deleteToDo(toDoId) {
    fetch(`/todo/${toDoId}`, {
        method: 'DELETE',
    })
        .then(() => {
            fetchToDos(); // リストを更新
        })
        .catch(error => {
            console.error('Error deleting todo:', error);
            displayError('Failed to load todo.');
        });
}

// ToDoの完了状態を切り替える関数
function toggleComplete(toDoId, isCompleted) {
    fetch(`/todo/${toDoId}/complete`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: isCompleted }),
    })
        .then(() => {
            fetchToDos(); // リストを更新
        })
        .catch(error => {
            console.error('Error toggling todo:', error);
            displayError('Failed to load todo.');
        });
}

// ページ読み込み時にToDoリストを取得
document.addEventListener('DOMContentLoaded', fetchToDos);

// フォームの送信イベントリスナーを追加
const form = document.getElementById('todo-form');
form.addEventListener('submit', addToDo);

// エラーメッセージの表示
function displayError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// ローカルストレージへの保存と読み込み
function saveToDos(toDos) {
    localStorage.setItem('toDos', JSON.stringify(toDos));
}

function loadToDos() {
    const savedToDos = localStorage.getItem('toDos');
    return savedToDos ? JSON.parse(savedToDos) : [];
}