// Fetch all water complaints on page load
window.onload = fetchWaterComplaints;

// Function to fetch water complaints from the backend
async function fetchWaterComplaints() {
    try {
        const response = await fetch("https://neristconnect.onrender.com/water_complaints/all");
        const complaints = await response.json(); // assuming it's an array of complaints
        console.log(complaints); // Check the fetched data in console

        // Now populate the complaints in the table
        const complaintsTableBody = document.getElementById('complaintsBody');

        // Clear existing rows before adding new ones
        complaintsTableBody.innerHTML = "";

        // Loop through the complaints and add them to the table
        complaints.forEach(complaint => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${complaint.id}</td>
                <td>${complaint.student_name}</td>
                <td>${complaint.block_name}</td>
                <td>${complaint.department}</td>
                <td>${complaint.room_number}</td>
                <td>${complaint.issue}</td>
                <td><button onclick="deleteComplaint(${complaint.id})">Delete</button></td>
            `;
            complaintsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching complaints:", error);
        alert("Error fetching complaints!");
    }
}

// Function to delete a complaint
async function deleteComplaint(id) {
    try {
        const response = await fetch(`https://neristconnect.onrender.com/water_complaints/delete/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (response.ok) {
            alert("Complaint deleted successfully!");
            fetchWaterComplaints(); // Re-fetch the complaints after deletion
        } else {
            alert(result.error || "Failed to delete complaint.");
        }
    } catch (error) {
        console.error("Error deleting complaint:", error);
        alert("Error deleting complaint!");
    }
}
