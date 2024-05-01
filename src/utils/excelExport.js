import * as XLSX from 'xlsx';

const exportToExcel = (data, itemNames) => {
    // Prepare data for export
    // const dataArray = Object.entries(data).map(([id, count]) => ({ id, count }));

    const dataArray = Object.entries(data).map(([itemCode, count]) => ({
        Item: itemNames[itemCode] || "", // use item name from itemNames array if available
        Count: count || 0
    }));

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataArray);

    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Stock Counts');

    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Initiate file download
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_counts.xlsx';
    a.click();
    URL.revokeObjectURL(url);
}

// Utility function to convert string to array buffer
const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export default exportToExcel;

