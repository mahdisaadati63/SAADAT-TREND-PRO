// analysis/market-structure.js

class MarketStructure {
    constructor() {
        this.trend = 'SIDEWAY'; // BULLISH, BEARISH, SIDEWAY
        this.highs = [];
        this.lows = [];
        this.lookback = 5;
    }

    analyze(candles) {
        if (candles.length < this.lookback * 2) return this.trend;

        // منطق پایه‌ای برای تشخیص HH/HL و LH/LL
        // در نسخه اصلی اینجا سوئینگ‌ها با دقت محاسبه می‌شوند.

        const recentCandles = candles.slice(-20);
        let currentTrend = 'SIDEWAY';

        const closes = recentCandles.map(c => c.close);
        const firstHalf = closes.slice(0, 10);
        const secondHalf = closes.slice(10);

        const avgFirst = firstHalf.reduce((a,b)=>a+b,0) / 10;
        const avgSecond = secondHalf.reduce((a,b)=>a+b,0) / 10;

        if (avgSecond > avgFirst * 1.0005) {
            currentTrend = 'BULLISH';
        } else if (avgSecond < avgFirst * 0.9995) {
            currentTrend = 'BEARISH';
        }

        this.trend = currentTrend;
        return {
            trend: this.trend,
            hasBOS: false, // Break of Structure
            hasChoCh: false // Change of Character
        };
    }
}
window.STP_MarketStructure = new MarketStructure();
