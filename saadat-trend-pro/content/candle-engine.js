// content/candle-engine.js

/**
 * Candle Engine
 * مسئول پردازش و ساخت آبجکت‌های استاندارد کندل از داده‌های خام.
 */

class CandleEngine {
    constructor() {
        this.candles = [];
    }

    /**
     * @param {Object} rawData {open, high, low, close, timestamp, volume}
     * @returns {Object} Standardized candle object
     */
    processCandle(rawData) {
        const { open, high, low, close, timestamp, volume } = rawData;

        const body = Math.abs(close - open);
        const range = high - low;
        const upperWick = high - Math.max(open, close);
        const lowerWick = Math.min(open, close) - low;
        const direction = close > open ? 'bullish' : (close < open ? 'bearish' : 'doji');

        const candle = {
            timestamp,
            open,
            high,
            low,
            close,
            volume: volume || 0,
            body,
            range,
            upperWick,
            lowerWick,
            direction,
            isForming: false // خواهد بود true اگر کندل هنوز بسته نشده باشد
        };

        return candle;
    }

    addCandle(candle) {
        this.candles.push(candle);
        // محدود کردن سایز آرایه برای جلوگیری از memory leak
        if (this.candles.length > 2000) {
            this.candles.shift();
        }
    }

    getLatestCandles(count) {
        return this.candles.slice(-count);
    }
}

window.STP_CandleEngine = new CandleEngine();
