// analysis/price-action.js

class PriceAction {
    analyze(candle, previousCandles) {
        const patterns = [];

        // تشخیص همر (Hammer)
        if (candle.direction === 'bullish' && candle.lowerWick > (candle.body * 2) && candle.upperWick < candle.body) {
            patterns.push('HAMMER');
        }

        // تشخیص شوتینگ استار (Shooting Star)
        if (candle.direction === 'bearish' && candle.upperWick > (candle.body * 2) && candle.lowerWick < candle.body) {
            patterns.push('SHOOTING_STAR');
        }

        // تشخیص اینگالف (Engulfing)
        if (previousCandles.length > 0) {
            const prev = previousCandles[previousCandles.length - 1];
            if (candle.direction === 'bullish' && prev.direction === 'bearish' && candle.body > prev.body && candle.close > prev.open) {
                patterns.push('BULLISH_ENGULFING');
            }
            if (candle.direction === 'bearish' && prev.direction === 'bullish' && candle.body > prev.body && candle.close < prev.open) {
                patterns.push('BEARISH_ENGULFING');
            }
        }

        return patterns;
    }
}
window.STP_PriceAction = new PriceAction();
