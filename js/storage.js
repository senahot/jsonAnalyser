/**
 * Storage Module
 * Handles localStorage operations for saving queries and history
 */

export class StorageManager {
    constructor() {
        this.SAVED_QUERIES_KEY = 'jsonAnalyser_savedQueries';
        this.QUERY_HISTORY_KEY = 'jsonAnalyser_queryHistory';
        this.MAX_HISTORY_ITEMS = 50;
    }

    /**
     * Save a query with a name
     * @param {string} name - Query name
     * @param {string} query - JMESPath query
     * @param {string} description - Optional description
     * @returns {boolean} Success status
     */
    saveQuery(name, query, description = '') {
        if (!name || !query) {
            return false;
        }

        try {
            const savedQueries = this.getSavedQueries();

            const newQuery = {
                id: this.generateId(),
                name,
                query,
                description,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Check if query with same name exists
            const existingIndex = savedQueries.findIndex(q => q.name === name);
            if (existingIndex >= 0) {
                // Update existing
                newQuery.id = savedQueries[existingIndex].id;
                newQuery.createdAt = savedQueries[existingIndex].createdAt;
                savedQueries[existingIndex] = newQuery;
            } else {
                // Add new
                savedQueries.unshift(newQuery);
            }

            localStorage.setItem(this.SAVED_QUERIES_KEY, JSON.stringify(savedQueries));
            return true;
        } catch (error) {
            console.error('Error saving query:', error);
            return false;
        }
    }

    /**
     * Get all saved queries
     * @returns {Array} Saved queries
     */
    getSavedQueries() {
        try {
            const data = localStorage.getItem(this.SAVED_QUERIES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading saved queries:', error);
            return [];
        }
    }

    /**
     * Delete a saved query
     * @param {string} id - Query ID
     * @returns {boolean} Success status
     */
    deleteSavedQuery(id) {
        try {
            const savedQueries = this.getSavedQueries();
            const filtered = savedQueries.filter(q => q.id !== id);
            localStorage.setItem(this.SAVED_QUERIES_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting query:', error);
            return false;
        }
    }

    /**
     * Add query to history
     * @param {string} query - JMESPath query
     * @param {*} result - Query result (optional)
     */
    addToHistory(query) {
        if (!query || query.trim() === '') {
            return;
        }

        try {
            let history = this.getQueryHistory();

            // Remove duplicate if exists
            history = history.filter(item => item.query !== query);

            // Add to beginning
            history.unshift({
                id: this.generateId(),
                query,
                timestamp: new Date().toISOString()
            });

            // Limit history size
            if (history.length > this.MAX_HISTORY_ITEMS) {
                history = history.slice(0, this.MAX_HISTORY_ITEMS);
            }

            localStorage.setItem(this.QUERY_HISTORY_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Error adding to history:', error);
        }
    }

    /**
     * Get query history
     * @returns {Array} Query history
     */
    getQueryHistory() {
        try {
            const data = localStorage.getItem(this.QUERY_HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }

    /**
     * Clear query history
     * @returns {boolean} Success status
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.QUERY_HISTORY_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing history:', error);
            return false;
        }
    }

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Export saved queries to JSON
     * @returns {string} JSON string of saved queries
     */
    exportSavedQueries() {
        const queries = this.getSavedQueries();
        return JSON.stringify(queries, null, 2);
    }

    /**
     * Import saved queries from JSON
     * @param {string} jsonString - JSON string of queries
     * @returns {boolean} Success status
     */
    importSavedQueries(jsonString) {
        try {
            const importedQueries = JSON.parse(jsonString);
            if (!Array.isArray(importedQueries)) {
                throw new Error('Invalid format');
            }

            const currentQueries = this.getSavedQueries();
            const merged = [...importedQueries, ...currentQueries];

            // Remove duplicates by name
            const unique = merged.reduce((acc, query) => {
                if (!acc.find(q => q.name === query.name)) {
                    acc.push(query);
                }
                return acc;
            }, []);

            localStorage.setItem(this.SAVED_QUERIES_KEY, JSON.stringify(unique));
            return true;
        } catch (error) {
            console.error('Error importing queries:', error);
            return false;
        }
    }

    /**
     * Get storage usage statistics
     * @returns {Object} Storage stats
     */
    getStorageStats() {
        const savedQueries = this.getSavedQueries();
        const history = this.getQueryHistory();

        return {
            savedQueriesCount: savedQueries.length,
            historyCount: history.length,
            savedQueriesSize: new Blob([JSON.stringify(savedQueries)]).size,
            historySize: new Blob([JSON.stringify(history)]).size
        };
    }
}
