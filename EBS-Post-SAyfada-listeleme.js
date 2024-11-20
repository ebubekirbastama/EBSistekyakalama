// Sayfa altına veri gösterimi için component oluştur
const logContainer = document.createElement('div');
logContainer.style.position = 'fixed';
logContainer.style.bottom = '0';
logContainer.style.left = '0';
logContainer.style.width = '100%';
logContainer.style.height = '200px';
logContainer.style.overflowY = 'scroll';
logContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
logContainer.style.color = 'white';
logContainer.style.padding = '10px';
logContainer.style.zIndex = '9999';
document.body.appendChild(logContainer);

// Logları temizlemek için bir buton ekleyelim
const clearButton = document.createElement('button');
clearButton.textContent = 'Temizle';
clearButton.style.position = 'fixed';
clearButton.style.bottom = '220px';
clearButton.style.left = '10px';
clearButton.style.padding = '10px';
clearButton.style.backgroundColor = '#f44336';
clearButton.style.color = 'white';
clearButton.style.border = 'none';
clearButton.style.cursor = 'pointer';
document.body.appendChild(clearButton);

// Logları txt dosyasına indirmek için bir buton ekleyelim
const downloadButton = document.createElement('button');
downloadButton.textContent = 'Logları İndir';
downloadButton.style.position = 'fixed';
downloadButton.style.bottom = '220px';
downloadButton.style.left = '100px';
downloadButton.style.padding = '10px';
downloadButton.style.backgroundColor = '#4CAF50';
downloadButton.style.color = 'white';
downloadButton.style.border = 'none';
downloadButton.style.cursor = 'pointer';
document.body.appendChild(downloadButton);

// Gizle/Göster butonunu ekleyelim
const toggleButton = document.createElement('button');
toggleButton.textContent = 'Gizle';
toggleButton.style.position = 'fixed';
toggleButton.style.bottom = '220px';
toggleButton.style.left = '200px';
toggleButton.style.padding = '10px';
toggleButton.style.backgroundColor = '#007BFF';
toggleButton.style.color = 'white';
toggleButton.style.border = 'none';
toggleButton.style.cursor = 'pointer';
document.body.appendChild(toggleButton);

// Logları içeren array
let logEntries = [];

// XMLHttpRequest'i dinleme
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    // Yalnızca bu fonksiyon ilk kez çağrıldığında dinlemeyi başlat
    if (!this._listened) {
        this.addEventListener('load', function () {
            if (method.toUpperCase() === 'POST') {
                const message = `${method.toUpperCase()} isteği yakalandı: ${url}`;
                console.log(message);
                addLogToContainer(message);
                
                if (this.responseType === 'blob') {
                    const blobMessage = 'Cevap: Blob verisi';
                    console.log(blobMessage);
                    addLogToContainer(blobMessage);
                } else {
                    const responseMessage = this.responseText || 'Cevap yok';
                    console.log('Cevap:', responseMessage);
                    addLogToContainer(`Cevap: ${responseMessage}`);
                }
            }
        });
        this._listened = true; // Event listener'ı yalnızca bir kez ekle
    }

    // POST verisini yazdırma
    const originalXHRSend = this.send;
    this.send = function (body) {
        if (method.toUpperCase() === 'POST') {
            const postDataMessage = `POST verisi: ${body ? body : 'Veri yok'}`;
            console.log(postDataMessage);
            addLogToContainer(postDataMessage);
        }
        return originalXHRSend.apply(this, arguments);
    };

    return originalXHROpen.apply(this, arguments);
};

// fetch API'yi dinleme
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
    if (init && init.method === 'POST') {
        const message = `${init.method.toUpperCase()} isteği yakalandı: ${input}`;
        console.log(message);
        addLogToContainer(message);

        // POST isteği ile gönderilen veriyi yazdırma
        const bodyText = init.body ? await init.body.text() : '';
        console.log('Body:', bodyText);
        addLogToContainer(`Body: ${bodyText}`);
    }
    return originalFetch.apply(this, arguments);
};

// Anlık logları sayfanın en altındaki alana ekle
function addLogToContainer(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logEntries.push(message); // Logları array'e ekle
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight; // Otomatik scroll
}

// Logları txt dosyasına indir
downloadButton.addEventListener('click', () => {
    const blob = new Blob([logEntries.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // URL'yi serbest bırak
});

// Logları temizle
clearButton.addEventListener('click', () => {
    logContainer.innerHTML = ''; // Görünümü temizle
    logEntries = []; // Array'i temizle
});

// Gizle/Göster butonunu işlevsel hale getirelim
toggleButton.addEventListener('click', () => {
    if (logContainer.style.display === 'none') {
        logContainer.style.display = 'block';
        toggleButton.textContent = 'Gizle';
    } else {
        logContainer.style.display = 'none';
        toggleButton.textContent = 'Göster';
    }
});
