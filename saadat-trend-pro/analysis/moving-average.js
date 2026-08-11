// analysis/moving-average.js

class MovingAverage {
    calculate(candles, period) {
        if (candles.length < period) return null;
        const subset = candles.slice(-period);
        const sum = subset.reduce((acc, val) => acc + val.close, 0);
        return sum / period;
    }

    analyze(candles) {
        return {
            ma6: this.calculate(candles, 6),
            ma14: this.calculate(candles, 14),
            ma50: this.calculate(candles, 50)
        };
    }
}
window.STP_MovingAverage = new MovingAverage();
