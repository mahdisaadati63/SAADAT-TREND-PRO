// content/injected-websocket.js

(function() {
    console.log("STP: WebSocket Interceptor Injected Successfully");

    const OriginalWebSocket = window.WebSocket;

    // Monkey-patching WebSocket
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        // Listen for messages received from the server
        ws.addEventListener('message', function(event) {
            try {
                // فرض می‌کنیم داده‌های کوئوتکس به صورت JSON یا رشته متنی است.
                // در واقعیت ممکن است فرمت خاصی (مثل Socket.io یا باینری) داشته باشد
                // که نیاز به دیکد کردن دارد. اینجا ما پترن‌های متداول قیمت را می‌گیریم.

                let data = event.data;
                if (typeof data === 'string') {
                    // یک مثال ساده: استخراج قیمت اگر فرمتی شبیه به {"price": 1.0854, "symbol": "EURUSD"} داشته باشد
                    // یا پترن‌های عددی خاص. از آنجا که ساختار دقیق نامعلوم است، یک Regex کلی می‌زنیم:
                    if (data.includes('price') || data.includes('quote') || data.match(/"\w{6}":\s*\d+\.\d+/)) {
                        // ارسال داده‌ها به افزونه از طریق window.postMessage
                        window.postMessage({
                            type: 'STP_WS_MESSAGE',
                            payload: data
                        }, '*');
                    }
                }
            } catch (e) {
                // نادیده گرفتن خطاهای پارس کردن
            }
        });

        return ws;
    };

    window.WebSocket.prototype = OriginalWebSocket.prototype;
    window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
    window.WebSocket.OPEN = OriginalWebSocket.OPEN;
    window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
})();
