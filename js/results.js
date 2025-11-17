/**
 * Results Export Module
 * Handles exporting query results to various formats (JSON, CSV)
 */

export class ResultsExporter {
    constructor() {
        // CSV configuration
        this.csvDelimiter = ',';
        this.csvLineBreak = '\n';
    }

    /**
     * Export data to JSON file
     * @param {*} data - Data to export
     * @param {string} filename - Optional filename
     */
    exportToJSON(data, filename = 'query-results.json') {
        if (!data) {
            throw new Error('No data to export');
        }

        const jsonString = JSON.stringify(data, null, 2);
        this.downloadFile(jsonString, filename, 'application/json');
    }

    /**
     * Export data to CSV file
     * @param {*} data - Data to export (must be array of objects)
     * @param {string} filename - Optional filename
     */
    exportToCSV(data, filename = 'query-results.csv') {
        if (!data) {
            throw new Error('No data to export');
        }

        // Convert data to array if it's not
        let dataArray = Array.isArray(data) ? data : [data];

        // Filter out non-object items
        dataArray = dataArray.filter(item => item && typeof item === 'object' && !Array.isArray(item));

        if (dataArray.length === 0) {
            throw new Error('Data must contain objects to export as CSV');
        }

        const csv = this.convertToCSV(dataArray);
        this.downloadFile(csv, filename, 'text/csv');
    }

    /**
     * Convert array of objects to CSV string
     * @param {Array} data - Array of objects
     * @returns {string} CSV string
     */
    convertToCSV(data) {
        if (!data || data.length === 0) {
            return '';
        }

        // Get all unique keys from all objects
        const allKeys = new Set();
        data.forEach(item => {
            Object.keys(item).forEach(key => allKeys.add(key));
        });

        const headers = Array.from(allKeys);

        // Create header row
        const headerRow = headers.map(header => this.escapeCSVValue(header)).join(this.csvDelimiter);

        // Create data rows
        const dataRows = data.map(item => {
            return headers.map(header => {
                const value = item[header];
                return this.formatCSVValue(value);
            }).join(this.csvDelimiter);
        });

        // Combine header and data rows
        return [headerRow, ...dataRows].join(this.csvLineBreak);
    }

    /**
     * Format a value for CSV
     * @param {*} value - Value to format
     * @returns {string} Formatted value
     */
    formatCSVValue(value) {
        if (value === null || value === undefined) {
            return '';
        }

        if (typeof value === 'object') {
            // Convert objects/arrays to JSON string
            return this.escapeCSVValue(JSON.stringify(value));
        }

        return this.escapeCSVValue(String(value));
    }

    /**
     * Escape CSV value (handle quotes and commas)
     * @param {string} value - Value to escape
     * @returns {string} Escaped value
     */
    escapeCSVValue(value) {
        // If value contains delimiter, quotes, or newlines, wrap in quotes
        if (value.includes(this.csvDelimiter) || value.includes('"') || value.includes('\n')) {
            // Escape quotes by doubling them
            return '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
    }

    /**
     * Download file to user's computer
     * @param {string} content - File content
     * @param {string} filename - Filename
     * @param {string} mimeType - MIME type
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }

    /**
     * Get appropriate filename with timestamp
     * @param {string} baseName - Base filename
     * @param {string} extension - File extension
     * @returns {string} Filename with timestamp
     */
    getTimestampedFilename(baseName, extension) {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        return `${baseName}-${timestamp}.${extension}`;
    }
}
