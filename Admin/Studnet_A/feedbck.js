// Function to fetch and display suggestions
async function fetchSuggestions() {
    try {
        // Fetch suggestions from the backend
        const response = await fetch('https://neristconnect.onrender.com/feedback/all');
        const suggestions = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('suggestion-list');
        tableBody.innerHTML = ""; // Clear any existing data

        // Loop through suggestions and insert them into the table
        suggestions.forEach(suggestion => {
            const row = `
                <tr>
                    <td>${suggestion.id}</td>  <!-- Match database column names -->
                    <td>${suggestion.message}</td>
                    <td>${new Date(suggestion.timestamp).toLocaleString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Fetch suggestions when the page loads
window.onload = fetchSuggestions;
