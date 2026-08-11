// signal/signal-engine.js

class SignalEngine {
    constructor() {
        this.isProcessing = false;
        this.lastSignalTime = 0;
        this.cooldownMs = 60000; // 1 دقیقه
    }

    onNewCandle(candle) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            const candles = window.STP_CandleEngine.getLatestCandles(100);
            if (candles.length < 20) {
                this.isProcessing = false;
                return; // داده کافی نیست
            }

            // اجرای موتورهای تحلیلی
            const previousCandles = candles.slice(0, -1);
            const analysis = {
                currentCandle: candle,
                trendInfo: window.STP_MarketStructure.analyze(candles),
                patterns: window.STP_PriceAction.analyze(candle, previousCandles),
                ma: window.STP_MovingAverage.analyze(candles),
                sr: window.STP_SupportResistance.analyze(candles)
            };

            // محاسبه امتیاز
            const scoreResult = window.STP_ScoringEngine.calculateScore(analysis);

            // اعتبارسنجی
            const validation = window.STP_ValidationEngine.validate(scoreResult, analysis);

            if (validation.isValid) {
                const now = Date.now();
                if (now - this.lastSignalTime > this.cooldownMs) {
                    this.emitSignal(scoreResult.direction, scoreResult.score, analysis);
                    this.lastSignalTime = now;
                }
            }

        } catch (error) {
            console.error("STP Signal Engine Error:", error);
        }

        this.isProcessing = false;
    }

    emitSignal(direction, score, analysis) {
        const payload = {
            id: `SIG_${Date.now()}_1M_${direction}`,
            timestamp: Date.now(),
            pair: window.STP_ChartReader ? window.STP_ChartReader.currentPair : 'UNKNOWN',
            timeframe: '1M',
            direction,
            score,
            status: 'PENDING' // WIN/LOSS مشخص نیست
        };

        console.log("🔥 STP SIGNAL FIRED:", payload);

        // ارسال به Background برای Notification
        chrome.runtime.sendMessage({
            type: "SIGNAL_GENERATED",
            payload
        });

        // رسم روی چارت (در دمو مختصات ثابت می‌دهیم، در واقعیت باید محاسبه شود)
        if (window.STP_ChartOverlay) {
            window.STP_ChartOverlay.drawSignal(payload, {x: window.innerWidth / 2, y: window.innerHeight / 2});
        }

        // ذخیره در دیتابیس
        if (window.STP_Database) {
            window.STP_Database.saveSignal(payload);
        }
    }
}
window.STP_SignalEngine = new SignalEngine();
