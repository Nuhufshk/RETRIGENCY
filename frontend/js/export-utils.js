/**
 * Export Utilities
 * Handles JSON to CSV conversion and file downloads.
 */

const ExportUtils = (() => {
    /**
     * Converts an array of objects to a CSV string.
     * @param {Array<Object>} data - The data to convert.
     * @returns {string} The CSV string.
     */
    function convertToCSV(data) {
        if (!data || data.length === 0) return '';

        // Extract headers from the first object
        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Add header row
        csvRows.push(headers.join(','));

        // Add data rows
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header];
                const escaped = ('' + val).replace(/"/g, '""'); // Escape quotes
                return `"${escaped}"`; // Wrap in quotes
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }

    /**
     * Triggers a browser download for a raw string content.
     * @param {string} content - The file content.
     * @param {string} fileName - The name of the file.
     * @param {string} contentType - The MIME type.
     */
    function downloadFile(content, fileName, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    return {
        convertToCSV,
        downloadFile
    };
})();

// Attach to window if not using modules
window.ExportUtils = ExportUtils;
