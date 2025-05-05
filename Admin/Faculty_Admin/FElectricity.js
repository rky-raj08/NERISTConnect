// Function to fetch and display complaints
async function fetchComplaints() {
    try {
        // Fetch complaints from the backend
        const response = await fetch('https://neristconnect.onrender.com/FEcomplaints/all');
        const complaints = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('complaintTable');
        tableBody.innerHTML = ""; // Clear any existing data

        // Loop through complaints and insert them into the table
        complaints.forEach(complaint => {
            const row = `
                <tr>
                    <td>${complaint.id}</td>
                    <td>${complaint.name}</td>
                    <td>${complaint.email}</td>
                    <td>${complaint.department}</td>
                    <td>${complaint.address}</td>
                    <td>${complaint.issue}</td>
                     <td>${complaint.submitted_at}</td>
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
