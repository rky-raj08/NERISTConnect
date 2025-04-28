// Function to fetch and display complaints
async function fetchComplaints() {
    try {
        // Fetch complaints from the backend
        const response = await fetch('http://localhost:5000/Ecomplaints/all');
        const complaints = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('complaintTable');
        tableBody.innerHTML = ""; // Clear any existing data

        // Loop through complaints and insert them into the table
        complaints.forEach(complaint => {
            const row = `
                <tr>
                    <td>${complaint.student_name}</td>
                    <td>${complaint.block_name}</td>
                    <td>${complaint.department}</td>
                    <td>${complaint.room_number}</td>
                    <td>${complaint.issue}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
    }
}

// Fetch complaints when the page loads
window.onload = fetchComplaints;
