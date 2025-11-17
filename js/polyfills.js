/**
 * Browser Polyfills
 * Provides compatibility shims for older browsers
 */

/**
 * Polyfill for crypto.randomUUID()
 * Required for browsers that don't support this Web Crypto API method
 * Introduced in: Chrome 92, Firefox 95, Safari 15.4
 */
(function() {
    'use strict';

    if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
        crypto.randomUUID = function() {
            // Use cryptographically secure random values if available
            if (typeof crypto.getRandomValues === 'function') {
                // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
                return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c) {
                    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
                });
            } else {
                // Fallback to Math.random (less secure but compatible)
                console.warn('crypto.getRandomValues not available, using Math.random fallback');
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
        };
        console.log('crypto.randomUUID polyfill installed');
    }
})();
