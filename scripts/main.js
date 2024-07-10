document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            console.log('Archivo leído correctamente:', text.slice(0, 500)); // Muestra los primeros 500 caracteres del archivo
            analyzeText(text);
        };
        reader.readAsText(file, 'UTF-8');
    } else {
        console.log('No se seleccionó ningún archivo');
    }
});

function analyzeText(text) {
    const pattern = /\[(\d{1,2}\/\d{1,2}\/\d{2,4}), (\d{1,2}:\d{2}:\d{2})(?:\s?([aApP]\.?[mM]\.?))?\] (.+?): (.+)/;
    const messageCount = {};
    const lines = text.split('\n');
    const filteredMessages = [];

    const dateInput = document.getElementById('dateInput').value;

    console.log('Comenzando análisis de texto');
    lines.forEach(line => {
        const match = line.match(pattern);
        if (match) {
            const date = match[1];
            let time = match[2];
            const period = match[3];
            const sender = match[4];
            const message = match[5];

            if (period) {
                time = convertTo24HourFormat(time, period);
            }

            const formattedDate = convertDateFormat(date);

            if (!dateInput || formattedDate === dateInput) {
                if (!messageCount[sender]) {
                    messageCount[sender] = 0;
                }
                messageCount[sender]++;

                if (formattedDate === dateInput) {
                    filteredMessages.push(`[${formattedDate}, ${time}] ${sender}: ${message}`);
                }
            }
        }
    });

    console.log('Análisis completado', messageCount);
    displayResults(messageCount);
    displayFilteredMessages(filteredMessages);
}

function displayResults(messageCount) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Resultados:</h2>';

    const messageArray = Object.entries(messageCount);

    messageArray.sort((a, b) => b[1] - a[1]);

    const ol = document.createElement('ol');
    messageArray.forEach(([sender, count]) => {
        const li = document.createElement('li');
        li.textContent = `${sender}: ${count} mensajes`;
        ol.appendChild(li);
    });

    resultsDiv.appendChild(ol);
    console.log('Resultados mostrados en el DOM');
}

function displayFilteredMessages(filteredMessages) {
    const filteredMessagesDiv = document.getElementById('filteredMessages');
    filteredMessagesDiv.innerHTML = '<h2>Los mensajes insanos en cuestión:</h2>';

    if (filteredMessages.length === 0) {
        filteredMessagesDiv.innerHTML += '<p>No se encontraron mensajes en la fecha seleccionada.</p>';
    } else {
        const ul = document.createElement('ul');
        filteredMessages.forEach(message => {
            const li = document.createElement('li');
            li.textContent = message;
            ul.appendChild(li);
        });
        filteredMessagesDiv.appendChild(ul);
    }
    console.log('Mensajes filtrados mostrados en el DOM');
}

function analyzeFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            console.log('Contenido del archivo:', text.slice(0, 500)); // Muestra los primeros 500 caracteres del archivo
            analyzeText(text);
        };
        reader.readAsText(file, 'UTF-8');
    } else {
        alert('Por favor, selecciona un archivo de texto.');
    }
}

// Función para convertir el formato de fecha DD/MM/YY a YYYY-MM-DD
function convertDateFormat(date) {
    const parts = date.split('/');
    if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = `20${parts[2]}`; // Asumiendo que los años de 2 dígitos son del 2000 en adelante
        return `${year}-${month}-${day}`;
    }
    return date; // Si no se puede convertir, devolver la fecha original
}

// Función para convertir el formato de 12 horas a 24 horas
function convertTo24HourFormat(time, period) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    if (period.toLowerCase().includes('p') && hours < 12) {
        return `${hours + 12}:${minutes}:${seconds}`;
    }
    if (period.toLowerCase().includes('a') && hours === 12) {
        return `00:${minutes}:${seconds}`;
    }
    return time;
}
