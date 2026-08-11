// ui/popup.js

document.addEventListener('DOMContentLoaded', () => {
    // برای گرفتن دیتابیس نیاز به دسترسی به پنجره فعال (content script) داریم
    // اینجا از chrome.tabs.sendMessage استفاده می‌کنیم یا از storage

    document.getElementById('fullDashboardBtn').addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("ui/dashboard.html") });
    });

    // درخواست گرفتن استتوس (فعلا شبیه‌سازی می‌کنیم تا سیستم پیام‌رسانی کامل پیاده شود)
    document.getElementById('winRate').innerText = '82.4%';
    document.getElementById('totalSignals').innerText = '145';
    document.getElementById('wins').innerText = '119';
    document.getElementById('losses').innerText = '26';
});
