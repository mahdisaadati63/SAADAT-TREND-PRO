// content/chart-reader.js

/**
 * Chart Reader
 * مسئول استخراج داده‌ها از چارت Quotex.
 * از آنجا که چارت در Canvas/SVG رندر می‌شود، ممکن است نیاز به اسکرپینگ مقادیر متنی
 * یا رهگیری WebSocket/API داخلی داشته باشد.
 * این نسخه یک Placeholder اولیه برای رهگیری المان‌های DOM (قیمت جاری) است.
 */

class ChartReader {
    constructor() {
        this.currentPair = "UNKNOWN";
        this.currentPrice = 0;
        this.initObserver();
    }

    initObserver() {
        console.log("STP ChartReader: Initializing observer...");

        // در کوئوتکس معمولاً المان‌هایی برای نمایش قیمت فعلی وجود دارد.
        // انتخاب‌گرها باید با بررسی دقیق DOM کوئوتکس تنظیم شوند.
        // اینجا به صورت عمومی می‌نویسیم تا قابل تطبیق باشد.

        this.observer = new MutationObserver((mutations) => {
            // شبیه‌سازی خواندن تیک‌های قیمت (در نسخه اصلی باید دقیق‌تر پیاده‌سازی شود)
            // یا می‌توان از رهگیری درخواست‌های شبکه در صورت امکان استفاده کرد.
        });

        this.observer.observe(document.body, { childList: true, subtree: true });

        // 1. تزریق اسکریپت WebSocket به داخل صفحه
        this.injectWebSocketInterceptor();

        // 2. گوش دادن به پیام‌های دریافتی از WebSocket
        this.listenForWebSocketData();

        // 3. در صورت نیاز به عنوان Fallback، مکانیزم DOM Scraping را اجرا می‌کنیم
        this.startDOMScrapingFallback();

        // متغیرهای ساخت کندل
        this.currentTickCandle = null;
    }

    injectWebSocketInterceptor() {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('content/injected-websocket.js');
        script.onload = function() {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(script);
        console.log("STP ChartReader: Injected WS script.");
    }

    listenForWebSocketData() {
        window.addEventListener('message', (event) => {
            if (event.source !== window || event.data.type !== 'STP_WS_MESSAGE') {
                return;
            }

            const rawData = event.data.payload;
            // در اینجا باید ساختار دقیق JSON کوئوتکس پارس شود.
            // به عنوان نمونه شبیه‌سازی استخراج قیمت:
            const priceMatch = rawData.match(/(\d+\.\d{4,5})/);
            if (priceMatch) {
                const price = parseFloat(priceMatch[1]);
                this.handleNewTick(price);
            }
        });
    }

    startDOMScrapingFallback() {
        // اگر WebSocket کار نکرد، از روی المان قیمت در صفحه (مثلا دکمه سبز/قرمز) می‌خوانیم
        setInterval(() => {
            // این انتخاب‌گرها باید در محیط واقعی کوئوتکس تست و پیدا شوند
            const priceElement = document.querySelector('.current-price-value, [data-test="price"]');
            if (priceElement) {
                const priceText = priceElement.innerText.replace(/[^0-9.]/g, '');
                const price = parseFloat(priceText);
                if (!isNaN(price)) {
                    this.handleNewTick(price);
                }
            }
        }, 1000); // خواندن هر ثانیه
    }

    handleNewTick(price) {
        this.currentPrice = price;
        const now = Date.now();

        // محاسبه زمان شروع کندل ۱ دقیقه‌ای (رند کردن زمان به دقیقه)
        const currentMinute = Math.floor(now / 60000) * 60000;

        // آیا یک کندل جدید شروع شده است؟
        if (!this.currentTickCandle || this.currentTickCandle.timestamp !== currentMinute) {

            // بستن کندل قبلی و ارسال به موتور
            if (this.currentTickCandle) {
                this.currentTickCandle.isForming = false;
                const processed = window.STP_CandleEngine.processCandle(this.currentTickCandle);
                window.STP_CandleEngine.addCandle(processed);

                // اطلاع به موتور تحلیل پس از بسته شدن کندل
                if (window.STP_SignalEngine) {
                    window.STP_SignalEngine.onNewCandle(processed);
                }
            }

            // باز کردن کندل جدید
            this.currentTickCandle = {
                timestamp: currentMinute,
                open: price,
                high: price,
                low: price,
                close: price,
                volume: 0,
                isForming: true
            };
        } else {
            // به‌روزرسانی کندل جاری (در حال تشکیل - زرد رنگ)
            this.currentTickCandle.close = price;
            if (price > this.currentTickCandle.high) this.currentTickCandle.high = price;
            if (price < this.currentTickCandle.low) this.currentTickCandle.low = price;
            this.currentTickCandle.volume += 1; // یک تیک اضافه شد
        }
    }
}

// تزریق فوری به محض لود شدن اسکریپت
window.STP_ChartReader = new ChartReader();
