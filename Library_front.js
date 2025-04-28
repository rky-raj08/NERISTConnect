// Function to fetch and display books
async function fetchBooks() {
    try {
        // Fetch book details from the backend
        const response = await fetch('http://localhost:5000/books');
        const books = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('bookTable');
        tableBody.innerHTML = ""; // Clear any existing data

        // Loop through books and insert them into the table
        books.forEach(book => {
            const row = `
                <tr>
                    <td>${book.name}</td>   <!-- Match database column names -->
                    <td>${book.author}</td>
                    <td>${book.category}</td>
                    <td>${book.isbn}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Fetch books when the page loads
window.onload = fetchBooks;

// Search module (non-intrusive)
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const tableRows = document.querySelectorAll('#bookTable tr');
        let matchFound = false;

        tableRows.forEach(row => {
            const bookName = row.cells[0]?.textContent.toLowerCase();
            if (bookName.includes(query)) {
                row.style.display = '';
                matchFound = true;
            } else {
                row.style.display = 'none';
            }
        });

        const noResultRow = document.getElementById('no-result');
        if (!matchFound) {
            if (!noResultRow) {
                const row = document.createElement('tr');
                row.id = 'no-result';
                const cell = document.createElement('td');
                cell.colSpan = 4;
                cell.textContent = 'No book present with this name.';
                cell.style.textAlign = 'center';
                row.appendChild(cell);
                document.getElementById('bookTable').appendChild(row);
            }
        } else {
            if (noResultRow) {
                noResultRow.remove();
            }
        }
    });
});
