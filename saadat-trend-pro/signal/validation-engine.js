// signal/validation-engine.js

class ValidationEngine {
    constructor() {
        this.minScoreThreshold = 80; // تنظیمات کاربری می‌تواند این را تغییر دهد
    }

    setThreshold(score) {
        this.minScoreThreshold = score;
    }

    validate(scoreResult, analysis) {
        if (scoreResult.direction === 'WAIT') {
            return { isValid: false, reason: 'NO_DIRECTION' };
        }

        if (scoreResult.score < this.minScoreThreshold) {
            return { isValid: false, reason: 'LOW_SCORE' };
        }

        // در نسخه اصلی بررسی‌هایی مثل No Look-Ahead Bias، Cooldown و غیره اینجا انجام می‌شود

        return { isValid: true, reason: 'PASSED' };
    }
}
window.STP_ValidationEngine = new ValidationEngine();
