
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

    // POST verisini yazdırma
    const originalXHRSend = this.send;
    this.send = function (body) {
        if (method.toUpperCase() === 'POST') {
            console.log('POST verisi:', body ? body : 'Veri yok');
        }
        return originalXHRSend.apply(this, arguments);
    };

    return originalXHROpen.apply(this, arguments);
};

// fetch API'yi dinleme
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
    if (init && init.method === 'POST') {
        console.log(init.method.toUpperCase(), 'isteği yakalandı:', input);

        // POST isteği ile gönderilen veriyi yazdırma
        const bodyText = init.body ? await init.body.text() : '';
        console.log('Body:', bodyText);
    }
    return originalFetch.apply(this, arguments);
};
