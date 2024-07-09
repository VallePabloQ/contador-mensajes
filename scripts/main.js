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
    // Expresión regular para capturar la fecha y el remitente
    const pattern = /\[(\d{1,2}\/\d{1,2}\/\d{2,4}), \d{2}:\d{2}:\d{2}\] (.+?): (.+)/;
    const messageCount = {};
    const lines = text.split('\n');

    // Obtener la fecha filtrada por el usuario
    const dateInput = document.getElementById('dateInput').value;

    console.log('Comenzando análisis de texto');
    lines.forEach(line => {
        const match = line.match(pattern);
        if (match) {
            const date = match[1]; // Captura la fecha en formato DD/MM/YY
            const sender = match[2];
            
            // Convertir la fecha capturada al formato deseado para comparar
            const formattedDate = convertDateFormat(date);

            // Verificar si se seleccionó una fecha y si coincide con la fecha del mensaje
            if (!dateInput || formattedDate === dateInput) {
                if (!messageCount[sender]) {
                    messageCount[sender] = 0;
                }
                messageCount[sender]++;
            }
        }
    });

    console.log('Análisis completado', messageCount);
    displayResults(messageCount);
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
