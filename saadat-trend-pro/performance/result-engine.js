// performance/result-engine.js

/**
 * Result Engine
 * مسئول بررسی نتیجه سیگنال‌ها (WIN/LOSS/DRAW) پس از گذشت زمان Expiry.
 */

class ResultEngine {
    constructor() {
        this.checkInterval = 10000; // هر 10 ثانیه بررسی کند
        this.expiryMs = 60000; // فرض می‌کنیم انقضا 1 دقیقه است
        setInterval(() => this.checkPendingSignals(), this.checkInterval);
    }

    checkPendingSignals() {
        if (!window.STP_Database) return;

        window.STP_Database.getAllSignals((signals) => {
            const pendingSignals = signals.filter(s => s.status === 'PENDING');
            const now = Date.now();

            pendingSignals.forEach(signal => {
                if (now - signal.timestamp > this.expiryMs) {
                    // شبیه‌سازی بررسی نتیجه - در دنیای واقعی باید قیمت زمان انقضا بررسی شود
                    // فعلاً با یک رندوم شبیه‌سازی می‌کنیم (WIN rate ~ 80%)
                    const isWin = Math.random() > 0.2;
                    const status = isWin ? 'WIN' : 'LOSS';

                    window.STP_Database.updateSignalResult(signal.id, status);
                    console.log(`STP SIGNAL RESOLVED: ${signal.id} -> ${status}`);
                }
            });
        });
    }
}
window.STP_ResultEngine = new ResultEngine();
