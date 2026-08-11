// performance/statistics-engine.js

/**
 * Statistics Engine
 * محاسبات آماری (Win Rate, تعداد سیگنال‌ها و غیره)
 */

class StatisticsEngine {
    getStats(callback) {
        if (!window.STP_Database) return;

        window.STP_Database.getAllSignals((signals) => {
            const total = signals.length;
            const wins = signals.filter(s => s.status === 'WIN').length;
            const losses = signals.filter(s => s.status === 'LOSS').length;
            const pending = signals.filter(s => s.status === 'PENDING').length;

            const resolved = wins + losses;
            const winRate = resolved > 0 ? ((wins / resolved) * 100).toFixed(1) : 0;

            callback({
                total,
                wins,
                losses,
                pending,
                winRate
            });
        });
    }
}
window.STP_StatisticsEngine = new StatisticsEngine();
