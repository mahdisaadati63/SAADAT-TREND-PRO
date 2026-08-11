// storage/database.js

class Database {
    constructor() {
        this.dbName = 'STP_Database';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    init() {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = (event) => {
            console.error("STP Database error:", event.target.errorCode);
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log("STP Database opened successfully.");
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('signals')) {
                const store = db.createObjectStore('signals', { keyPath: 'id' });
                store.createIndex('timestamp', 'timestamp', { unique: false });
                store.createIndex('status', 'status', { unique: false });
            }
        };
    }

    saveSignal(signal) {
        if (!this.db) return;
        const transaction = this.db.transaction(['signals'], 'readwrite');
        const store = transaction.objectStore('signals');
        store.add(signal);
    }

    updateSignalResult(id, status) {
        if (!this.db) return;
        const transaction = this.db.transaction(['signals'], 'readwrite');
        const store = transaction.objectStore('signals');
        const request = store.get(id);

        request.onsuccess = (event) => {
            const data = event.target.result;
            if (data) {
                data.status = status; // WIN / LOSS / DRAW
                store.put(data);
            }
        };
    }

    getAllSignals(callback) {
        if (!this.db) {
            setTimeout(() => this.getAllSignals(callback), 500);
            return;
        }
        const transaction = this.db.transaction(['signals'], 'readonly');
        const store = transaction.objectStore('signals');
        const request = store.getAll();

        request.onsuccess = (event) => {
            callback(event.target.result);
        };
    }
}
window.STP_Database = new Database();
