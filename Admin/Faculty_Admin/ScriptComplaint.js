/** 
async function fetchComplaints() {
    try {
        const response = await fetch('https://neristconnect.onrender.com/complaints/all');
        const complaints = await response.json();

        const tableBody = document.getElementById('complaintsTable');
        tableBody.innerHTML = ""; // Clear existing rows

        complaints.forEach(complaint => {
            const row = `
                <tr>
                    <td>${complaint.id}</td>
                    <td>${complaint.name}</td>
                    <td>${complaint.email}</td>
                    <td>${complaint.category}</td>
                    <td>${complaint.priority}</td>
                    <td>${complaint.details}</td>
                    <td>${complaint.timestamp}</td>
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

*/


/**
 * Fetch faculty complaints from the backend and populate the table
 */
async function fetchFacultyComplaints() {
    try {
        const response = await fetch('https://neristconnect.onrender.com/faculty-complaints/all');
        const complaints = await response.json();

        const tableBody = document.getElementById('complaintsTable');
        tableBody.innerHTML = ""; // Clear existing rows

        complaints.forEach(complaint => {
            const row = `
                <tr>
                    <td>${complaint.id}</td>
                    <td>${complaint.name}</td>
                    <td>${complaint.email}</td>
                    <td>${complaint.department}</td>
                    <td>${complaint.category}</td>
                    <td>${complaint.priority}</td>
                    <td>${complaint.details}</td>
                    <td>${complaint.timestamp}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching faculty complaints:', error);
    }
}

// Fetch faculty complaints when the page loads
window.onload = fetchFacultyComplaints;
