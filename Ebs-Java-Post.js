// XMLHttpRequest'i dinleme
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    // Yalnızca bu fonksiyon ilk kez çağrıldığında dinlemeyi başlat
    if (!this._listened) {
        this.addEventListener('load', function () {
            if (method.toUpperCase() === 'POST') {
                console.log(method.toUpperCase(), 'isteği yakalandı:', url);
                if (this.responseType === 'blob') {
                    console.log('Cevap: Blob verisi');
                } else {
                    console.log('Cevap:', this.responseText || 'Cevap yok');
                }
            }
        });
        this._listened = true; // Event listener'ı yalnızca bir kez ekle
    }

    return originalXHROpen.apply(this, arguments);
};

// fetch API'yi dinleme
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
    if (init && init.method === 'POST') {
        console.log(init.method.toUpperCase(), 'isteği yakalandı:', input);
        const bodyText = init.body ? await init.body.text() : '';
        console.log('Body:', bodyText);
    }
    return originalFetch.apply(this, arguments);
};

// TXT dosyasına veriyi kaydetme
function saveToFile(data) {
    const textContent = `URL: ${data.url}\nData: ${data.data || data.response || 'Cevap yok'}\n\n`;
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'request_log.txt';
    link.click();
}
