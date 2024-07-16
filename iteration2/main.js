window.onload = () => {
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let db;
    const note = document.getElementById('notifications');
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const title = document.getElementById('title');
    const hours = document.getElementById('deadline-hours');
    const minutes = document.getElementById('deadline-minutes');
    const day = document.getElementById('deadline-day');
    const month = document.getElementById('deadline-month');
    const year = document.getElementById('deadline-year');

    note.appendChild(createListItem('App initialised.'));
    const DBOpenRequest = window.indexedDB.open('toDoList', 4);

    DBOpenRequest.onerror = (event) => {
        note.appendChild(createListItem('Error loading database.'));
    };

    DBOpenRequest.onsuccess = (event) => {
        note.appendChild(createListItem('Database initialised.'));
        db = DBOpenRequest.result;
        displayData();
    };

    DBOpenRequest.onupgradeneeded = (event) => {
        db = event.target.result;
        db.onerror = (event) => {
            note.appendChild(createListItem('Error loading database.'));
        };
        
        const objectStore = db.createObjectStore('toDoList', { keyPath: 'taskTitle' });
        objectStore.createIndex('hours', 'hours', { unique: false });
        objectStore.createIndex('minutes', 'minutes', { unique: false });
        objectStore.createIndex('day', 'day', { unique: false });
        objectStore.createIndex('month', 'month', { unique: false });
        objectStore.createIndex('year', 'year', { unique: false });

        objectStore.add({ taskTitle: 'Example Task', hours: '12', minutes: '00', day: '01', month: 'January', year: '2020' });
        objectStore.add({ taskTitle: 'Buy groceries', hours: '14', minutes: '30', day: '05', month: 'February', year: '2024' });
objectStore.add({ taskTitle: 'Finish report', hours: '17', minutes: '00', day: '10', month: 'March', year: '2024' });
objectStore.add({ taskTitle: 'Call mom', hours: '19', minutes: '15', day: '15', month: 'April', year: '2024' });
objectStore.add({ taskTitle: 'Gym workout', hours: '07', minutes: '30', day: '20', month: 'May', year: '2024' });
objectStore.add({ taskTitle: 'Team meeting', hours: '10', minutes: '00', day: '25', month: 'June', year: '2024' });
objectStore.add({ taskTitle: 'Dentist appointment', hours: '15', minutes: '45', day: '30', month: 'July', year: '2024' });
objectStore.add({ taskTitle: 'Birthday party', hours: '20', minutes: '00', day: '02', month: 'August', year: '2024' });
objectStore.add({ taskTitle: 'Car maintenance', hours: '11', minutes: '30', day: '07', month: 'September', year: '2024' });
objectStore.add({ taskTitle: 'Book flight', hours: '09', minutes: '00', day: '12', month: 'October', year: '2024' });
objectStore.add({ taskTitle: 'Volunteer work', hours: '13', minutes: '45', day: '17', month: 'November', year: '2024' });
objectStore.add({ taskTitle: 'Christmas shopping', hours: '16', minutes: '30', day: '22', month: 'December', year: '2024' });
// objectStore.add({ taskTitle: 'New Year's resolution', hours: '00', minutes: '01', day: '01', month: 'January', year: '2025' });
// objectStore.add({ taskTitle: 'Start online course', hours: '18', minutes: '00', day: '06', month: 'February', year: '2025' });
objectStore.add({ taskTitle: 'Spring cleaning', hours: '08', minutes: '30', day: '11', month: 'March', year: '2025' });
objectStore.add({ taskTitle: 'Tax preparation', hours: '14', minutes: '00', day: '16', month: 'April', year: '2025' });
objectStore.add({ taskTitle: 'Plant garden', hours: '10', minutes: '30', day: '21', month: 'May', year: '2025' });
objectStore.add({ taskTitle: 'Summer vacation', hours: '09', minutes: '00', day: '26', month: 'June', year: '2025' });
objectStore.add({ taskTitle: 'Home renovation', hours: '11', minutes: '45', day: '31', month: 'July', year: '2025' });
objectStore.add({ taskTitle: 'Back to school prep', hours: '15', minutes: '30', day: '05', month: 'August', year: '2025' });
objectStore.add({ taskTitle: 'Quarterly review', hours: '13', minutes: '00', day: '10', month: 'September', year: '2025' });
        note.appendChild(createListItem('Object store created.'));
    };

    function displayData() {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.lastChild);
        }

        const objectStore = db.transaction('toDoList').objectStore('toDoList');
        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor) {
                note.appendChild(createListItem('Entries all displayed.'));
                return;
            }

            const { hours, minutes, day, month, year, taskTitle } = cursor.value;
            const ordDay = ordinal(day);
            const toDoText = `${taskTitle} — ${hours}:${minutes}, ${month} ${ordDay} ${year}.`;
            const listItem = createListItem(toDoText);

            taskList.appendChild(listItem);
            const deleteButton = document.createElement('button');
            listItem.appendChild(deleteButton);
            deleteButton.textContent = 'X';
            deleteButton.setAttribute('data-task', taskTitle);
            deleteButton.onclick = (event) => {
                deleteItem(event);
            };

            cursor.continue();
        };
    }

    taskForm.addEventListener('submit', addData, false);

    function addData(e) {
        e.preventDefault();

        if (title.value === '' || hours.value === null || minutes.value === null || day.value === '' || month.value === '' || year.value === null) {
            note.appendChild(createListItem('Data not submitted — form incomplete.'));
            return;
        }

        const newItem = [
            { taskTitle: title.value, hours: hours.value, minutes: minutes.value, day: day.value, month: month.value, year: year.value },
        ];

        const transaction = db.transaction(['toDoList'], 'readwrite');
        transaction.oncomplete = () => {
            note.appendChild(createListItem('Transaction completed: database modification finished.'));
            displayData();
        };

        transaction.onerror = () => {
            note.appendChild(createListItem(`Transaction not opened due to error: ${transaction.error}`));
        };

        const objectStore = transaction.objectStore('toDoList');
        const objectStoreRequest = objectStore.add(newItem[0]);
        objectStoreRequest.onsuccess = (event) => {
            note.appendChild(createListItem('Request successful.'));
            title.value = '';
            hours.value = null;
            minutes.value = null;
            day.value = '01';
            month.value = 'January';
            year.value = '2020';
        };
    }

    function deleteItem(event) {
        const dataTask = event.target.getAttribute('data-task');
        const transaction = db.transaction(['toDoList'], 'readwrite');
        transaction.objectStore('toDoList').delete(dataTask);
        transaction.oncomplete = () => {
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
            note.appendChild(createListItem(`Task "${dataTask}" deleted.`));
        };
    }

    function createListItem(contents) {
        const listItem = document.createElement('li');
        listItem.textContent = contents;
        return listItem;
    }

    const sqlQuery = document.getElementById('sql-query');
    const executeQueryBtn = document.getElementById('execute-query');
    const queryResult = document.getElementById('query-result');

    executeQueryBtn.addEventListener('click', executeQuery);

    function executeQuery() {
        const query = sqlQuery.value.trim().toLowerCase();
        if (!query) {
            note.appendChild(createListItem('Please enter a SQL query.'));
            return;
        }

        if (query.startsWith('select')) {
            const transaction = db.transaction(['toDoList'], 'readonly');
            const objectStore = transaction.objectStore('toDoList');
            const request = objectStore.getAll();

            request.onsuccess = (event) => {
                const results = event.target.result;
                displayQueryResults(results);
            };

            request.onerror = (event) => {
                note.appendChild(createListItem(`Error executing query: ${event.target.error}`));
            };
        } else {
            note.appendChild(createListItem('Only SELECT queries are supported in this playground.'));
        }
    }

    function displayQueryResults(results) {
        queryResult.innerHTML = '';
        if (results.length === 0) {
            queryResult.textContent = 'No results found.';
            return;
        }

        const table = document.createElement('table');
        const headerRow = table.insertRow();
        
        for (const key in results[0]) {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        }

        results.forEach(result => {
            const row = table.insertRow();
            for (const key in result) {
                const cell = row.insertCell();
                cell.textContent = result[key];
            }
        });

        queryResult.appendChild(table);
    }
};

function ordinal(day) {
    const n = day.toString();
    const last = n.slice(-1);
    if (last === '1' && n !== '11') return `${n}st`;
    if (last === '2' && n !== '12') return `${n}nd`;
    if (last === '3' && n !== '13') return `${n}rd`;
    return `${n}th`;
}