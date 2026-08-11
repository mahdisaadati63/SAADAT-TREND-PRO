// signal/scoring-engine.js

class ScoringEngine {
    constructor() {
        this.maxScore = 100;
    }

    calculateScore(analysis) {
        let score = 0;
        let potentialDirection = 'WAIT';

        const { trendInfo, patterns, ma, sr, currentCandle } = analysis;

        // منطق امتیازدهی اولیه (نسخه دمو)

        // 1. بررسی روند (Market Structure) - 20 امتیاز
        if (trendInfo.trend === 'BULLISH') {
            score += 20;
            potentialDirection = 'CALL';
        } else if (trendInfo.trend === 'BEARISH') {
            score += 20;
            potentialDirection = 'PUT';
        }

        // 2. الگوهای کندلی (Price Action) - 15 امتیاز
        if (patterns.includes('HAMMER') || patterns.includes('BULLISH_ENGULFING')) {
            if (potentialDirection === 'CALL' || potentialDirection === 'WAIT') {
                score += 15;
                potentialDirection = 'CALL';
            }
        }
        if (patterns.includes('SHOOTING_STAR') || patterns.includes('BEARISH_ENGULFING')) {
            if (potentialDirection === 'PUT' || potentialDirection === 'WAIT') {
                score += 15;
                potentialDirection = 'PUT';
            }
        }

        // 3. تأیید MA (Moving Average) - 10 امتیاز
        if (ma.ma14 && ma.ma50) {
            if (potentialDirection === 'CALL' && ma.ma14 > ma.ma50 && currentCandle.close > ma.ma14) {
                score += 10;
            } else if (potentialDirection === 'PUT' && ma.ma14 < ma.ma50 && currentCandle.close < ma.ma14) {
                score += 10;
            }
        }

        // نرمال‌سازی به 100 (مثلا در نسخه کامل آیتم‌های بیشتری جمع می‌شود)
        // در اینجا برای اینکه دمو کار کند کمی ضریب می‌دهیم
        score = Math.min(score * 2, this.maxScore);

        return {
            score,
            direction: score > 0 ? potentialDirection : 'WAIT'
        };
    }
}
window.STP_ScoringEngine = new ScoringEngine();
