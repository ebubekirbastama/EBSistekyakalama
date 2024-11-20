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
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight; // Otomatik scroll
}
