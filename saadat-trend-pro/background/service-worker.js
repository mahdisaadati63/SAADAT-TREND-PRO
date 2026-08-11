// background/service-worker.js

console.log("SAADAT TREND PRO: Background Service Worker initialized.");

chrome.runtime.onInstalled.addListener(() => {
    console.log("SAADAT TREND PRO Extension Installed.");
    // تنظیمات پیش‌فرض را می‌توان اینجا ست کرد
    chrome.storage.local.set({
        stp_settings: {
            minScore: 80,
            showSignals: true,
            alertSound: true
        }
    });
});

// این Background script در آینده برای ارتباط با سرور پایتون استفاده خواهد شد.
// فعلاً فقط پیام‌ها را بین اجزا (مثلا popup و content script) هدایت می‌کند.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SIGNAL_GENERATED") {
        console.log("New Signal Received in Background:", request.payload);

        // می‌توان اینجا برای کاربر Notification ارسال کرد
        chrome.storage.local.get(['stp_settings'], (result) => {
            if (result.stp_settings && result.stp_settings.alertSound) {
                // ارسال دستور پخش صدا به مرورگر یا نمایش نوتیفیکیشن
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: '../ui/icon128.png',
                    title: 'SAADAT TREND PRO - NEW SIGNAL',
                    message: `${request.payload.pair} - ${request.payload.direction} - Score: ${request.payload.score}`,
                    priority: 2
                });
            }
        });
        sendResponse({status: "received"});
    }

    // مسیر ارتباط با پایتون در آینده (placeholder)
    if (request.type === "SEND_TO_PYTHON") {
        // fetch('https://your-python-server.com/api', { ... })
        sendResponse({status: "pending"});
    }
});
