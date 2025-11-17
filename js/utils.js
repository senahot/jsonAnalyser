/**
 * Utility Functions
 * Reusable helper functions for the JSON Analyser
 */

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - The function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format bytes to human-readable size
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size string
 */
export function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Count JSON elements (objects, arrays, properties)
 * @param {*} obj - JSON object to analyze
 * @returns {Object} Statistics about the JSON
 */
export function analyzeJSON(obj) {
    let stats = {
        type: Array.isArray(obj) ? 'array' : typeof obj,
        objects: 0,
        arrays: 0,
        properties: 0,
        depth: 0
    };

    if (Array.isArray(obj)) {
        stats.arrays = 1;
        stats.arrayLength = obj.length;
    } else if (obj && typeof obj === 'object') {
        stats.objects = 1;
    }

    function traverse(item, depth = 0) {
        stats.depth = Math.max(stats.depth, depth);

        if (Array.isArray(item)) {
            item.forEach(element => traverse(element, depth + 1));
        } else if (item && typeof item === 'object') {
            Object.keys(item).forEach(key => {
                stats.properties++;
                traverse(item[key], depth + 1);
            });
        }
    }

    traverse(obj, 0);
    return stats;
}

/**
 * Syntax highlight JSON string
 * @param {string} json - JSON string to highlight
 * @returns {string} HTML string with syntax highlighting
 */
export function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            return true;
        } catch (err) {
            return false;
        } finally {
            document.body.removeChild(textArea);
        }
    }
}

/**
 * Show temporary notification (will be enhanced in later weeks)
 * @param {string} message - Message to show
 * @param {string} type - Type: 'success', 'error', 'info'
 */
export function showNotification(message, type = 'info') {
    // Simple console log for now, can be enhanced with toast notifications later
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Visual feedback in footer (temporary)
    const footer = document.getElementById('projectStatus');
    if (footer) {
        const originalText = footer.textContent;
        footer.textContent = message;
        setTimeout(() => {
            footer.textContent = originalText;
        }, 3000);
    }
}

/**
 * Validate if a string is valid JSON
 * @param {string} str - String to validate
 * @returns {Object} { valid: boolean, data: any, error: string|null }
 */
export function validateJSON(str) {
    try {
        const data = JSON.parse(str);
        return { valid: true, data, error: null };
    } catch (e) {
        return { valid: false, data: null, error: e.message };
    }
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Format JSON with indentation
 * @param {*} obj - Object to format
 * @param {number} spaces - Number of spaces for indentation
 * @returns {string} Formatted JSON string
 */
export function formatJSON(obj, spaces = 2) {
    return JSON.stringify(obj, null, spaces);
}
