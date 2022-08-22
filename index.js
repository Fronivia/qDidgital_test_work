// Получаем все задачи из Local Storage для их рендера
let localStorageData = JSON.parse(localStorage.getItem('tasks')) || [];

// Создаем массив подзадач, что бы отслеживать сколько их в текущей задаче
let currentSubtasks = [];
// Требуется для редактирования уже созданного таска
let filledTask = '';

// Получаем кнопки для назначения событий
const saveButton = document.querySelector('.js__subtask-save');
const addSubtaskButton = document.querySelector('.js__add-subtask');
const newTask = document.querySelector('.js__create-new-task');
// Вешаем обработчики

// Сохранить таски в Local storage
saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    saveTask();
});

// Добавить подзадачи
addSubtaskButton.addEventListener('click', (event) => {
    event.preventDefault()
    createSubtask();
})

// Очистить список и начать новую задачу
newTask.addEventListener('click', (event) => {
    event.preventDefault();
    clearInputs();
});

// Поле ввода имени задачи
const taskNameInput = document.querySelector('.js__task-name');

// Id необходим для более качественного контроя приложения
let id = 0;
// Функция, которая определяет айди при первом рендере
initId();

// создаем подзадачу
function createSubtask(filledTask) {
    // Смотрим редактируем ли мы или создаем новую подзадачу
    const sub = filledTask ? filledTask : { name: '', time: '' };

    const list = document.querySelector('.js__subtask-list');
    // Оборачиваем компоненты для удобной работы и создаем их
    const li = wrapElement('li')
        .addClass('subtask-item');

    const name = wrapElement('input')
        .addClass('subtask-item__input-name')
        .addPlaceholder('New task')
        .value(sub.name)
        .addListener('input', (event) => {
            sub.name = event.target.value;
            name.value(sub.name);
        })

    const time = wrapElement('input')
        .addClass('subtask-item__input-time')
        .addPlaceholder('0')
        .value(sub.time)
        .addListener('input', (event) => {
            sub.time = event.target.value.replace(/[^+\d]/g, '');
            time.value(sub.time);
        })


    const removeButton = wrapElement('button')
        .addClass('subtask-item__remove')
        .addListener('click', (event) => {
            event.preventDefault();
            currentSubtasks.find((el, i) => {
                el === sub && currentSubtasks.splice(i, 1);
                return el === sub;
            })

            li.$el.remove();
        })

    // Вставляем один элемент в другой и затем в ДОМ дерево.
    // Подзадачу добавляем в список Основной задачи
    list.append(li.append(name.$el, time.$el, removeButton.$el));
    currentSubtasks.push(sub);
}

// Сохраняем подзадачу
function saveTask() {
    // Получаем имя
    const taskName = taskNameInput.value;
    // Если нет имени возвращаем
    if (!taskName) return
    // Если редактируем подзадачу (через load), то изменяем её. Иначе делаем новую
    if (filledTask) {
        localStorageData = localStorageData.map(task => {
            if (task.id === filledTask.id) {
                return {
                    taskName: filledTask.taskName,
                    id: filledTask.id,
                    subtasks: currentSubtasks
                }
            }

            return task;
        })
    } else {
        // добавляем в массив для рендера
        localStorageData.push({
            taskName,
            id,
            subtasks: currentSubtasks,
        });
    }

    // Заносим его в локал стор
    localStorage.setItem('tasks', JSON.stringify(localStorageData));
    // рендерим и очищаем, попутно увеличиваем id
    renderTask();
    clearInputs();
    id +=1;
}

// Создаем подзадачу при сохранении в локал стор
function renderTask() {
    // Берем список и очищаем его
    const outerList = document.querySelector('.js__task-list');
    outerList.innerHTML = '';

    // Пробегаемся по массиву и рендерим каждую сохраненную подзадачу
    localStorageData.forEach(task => {
        const taskId = task.id;

        const outerLi = wrapElement('li')
            .addClass('task');

        const avatar =  wrapElement('div')
            .addClass('task__avatar');

        const subtasksContainer = wrapElement('div')
            .addClass('task_subtasks');

        const TaskTitle = wrapElement('h3')
            .addClass('subtask-list__title')
            .addText(task.taskName);

        const innerList = wrapElement('ul')
            .addClass('subtask-list');

        const innerLi = task.subtasks.map(sub => (
                wrapElement('li')
                    .addClass('subtask-list__item')
                    .addText(`${sub.name} - ${sub.time}`).$el
            )
        )

        const editButtonContainer =  wrapElement('div')
            .addClass('task__edit');

        // Кнопочка котоаря позволяет редактировать.
        // Определяем элемент по ID
        const editButton = wrapElement('button')
            .addClass('task__edit-button')
            .addText('load')
            .addListener('click', (event) => {
                event.preventDefault();
                const list = document.querySelector('.js__subtask-list');
                filledTask = localStorageData.find( task => {
                    if (taskId === task.id) return true;
                });
                list.innerHTML = '';
                taskNameInput.value = task.taskName;
                currentSubtasks = [];
                filledTask.subtasks.forEach(createSubtask);
            })

        // Вставляем элементы друг в друга
        // заметка: немного отрефакторить
        innerList.append(...innerLi);
        subtasksContainer.append(TaskTitle.$el, innerList.$el);
        editButtonContainer.append(editButton.$el);
        outerLi.append(avatar.$el, subtasksContainer.$el, editButtonContainer.$el);
        outerList.append(outerLi.$el);
    })
}

function wrapElement(elem) {
    elem = document.createElement(elem);
    return new Node(elem)
}

function clearInputs() {
    const taskNameButton = document.querySelector('.js__task-name');
    filledTask = '';
    taskNameButton.value = '';
    const list = document.querySelector('.js__subtask-list');
    list.innerHTML = '';
    currentSubtasks = [];
    createSubtask();
}

function initId() {
    localStorageData.forEach(task => {
        if (id <= task.id) id = task.id +1;
    })
}

// Для первого рендера делаем подзадачу (что бы было как на макете)
createSubtask();
// рендерим все сохраненные подзадачи при первом рендере
renderTask();
