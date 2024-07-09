document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            analyzeText(text);
        };
        reader.readAsText(file);
    }
});

function analyzeText(text) {
    const pattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}), (\d{1,2}:\d{2}) - (.+?): (.+)/;
    const messageCount = {};
    const lines = text.split('\n');

    lines.forEach(line => {
        const match = line.match(pattern);
        if (match) {
            const sender = match[3];
            if (!messageCount[sender]) {
                messageCount[sender] = 0;
            }
            messageCount[sender]++;
        }
    });

    displayResults(messageCount);
}

function displayResults(messageCount) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Resultados:</h2>';
    const ul = document.createElement('ul');
    for (const sender in messageCount) {
        const li = document.createElement('li');
        li.textContent = `${sender}: ${messageCount[sender]} mensajes`;
        ul.appendChild(li);
    }
    resultsDiv.appendChild(ul);
}
