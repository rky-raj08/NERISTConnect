/** 

// Function to fetch and display leave requests
async function fetchLeaveRequests() {
    try {
        // Fetch leave data from backend
        const response = await fetch('https://neristconnect.onrender.com/leave/all');
        const leaveRequests = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('leaveTable');
        tableBody.innerHTML = ""; // Clear existing data

        // Loop through each request and insert into the table
        leaveRequests.forEach(request => {
            const row = `
                <tr>
                    <td>${request.id}</td>
                    <td>${request.name}</td>
                    <td>${request.designation}</td>
                    <td>${request.department}</td>
                    <td>${request.no_of_days}</td>
                    <td>${formatDate(request.departure_date)}</td>
                    <td>${formatDate(request.arrival_date)}</td>
                    <td>${request.reason}</td>
                    <td>${request.substitution}</td>
                  


                    <td>${new Date(request.submitted_at).toLocaleString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching leave requests:', error);
    }
}


// Helper to format ISO date to YYYY-MM-DD
function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure 2 digits
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}


// Load data on page load
window.onload = fetchLeaveRequests;

*/

// Function to fetch and display leave requests
async function fetchLeaveRequests() {
    try {
        const response = await fetch('https://neristconnect.onrender.com/leave/all');
        const leaveRequests = await response.json();

        const tableBody = document.getElementById('leaveTable');
        tableBody.innerHTML = "";

        leaveRequests.forEach(request => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${request.id}</td>
                <td>${request.name}</td>
                <td>${request.designation}</td>
                <td>${request.department}</td>
                <td>${request.no_of_days}</td>
                <td>${formatDate(request.departure_date)}</td>
                <td>${formatDate(request.arrival_date)}</td>
                <td>${request.reason}</td>
                <td>${request.email}</td>
                <td>${request.substitution}</td>
                 <td>${request.status}</td>
                <td>${new Date(request.submitted_at).toLocaleString()}</td>
                <td>
                    <button class="approve-btn" data-id="${request.id}" data-email="${request.email}" data-name="${request.name}">Approve</button>
                    <button class="reject-btn" data-id="${request.id}" data-email="${request.email}" data-name="${request.name}">Reject</button>
                    <button class="delete-btn" data-id="${request.id}">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        attachButtonHandlers();
    } catch (error) {
        console.error('Error fetching leave requests:', error);
    }
}

// Attach event listeners to action buttons
function attachButtonHandlers() {
    document.querySelectorAll('.approve-btn').forEach(button => {
        button.addEventListener('click', () =>
            handleAction(button.dataset.id, 'approved', button.dataset.email, button.dataset.name)
        );
    });

    document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', () =>
            handleAction(button.dataset.id, 'rejected', button.dataset.email, button.dataset.name)
        );
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => handleDelete(button.dataset.id));
    });
}

// Function to send status update to backend and trigger email
async function handleAction(id, status, email, name) {
    try {
        const updateResponse = await fetch(`https://neristconnect.onrender.com/leave/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (updateResponse.ok) {
            // Send notification email
            await sendEmailNotification(email, name, status);

            alert(`Leave request ${status}`);
            fetchLeaveRequests(); // Refresh list
        } else {
            alert('Failed to update status');
        }
    } catch (error) {
        console.error(`Error updating status for request ${id}:`, error);
    }
}

// Function to delete leave request
async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
        const response = await fetch(`https://neristconnect.onrender.com/leave/delete/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Leave request deleted');
            fetchLeaveRequests(); // Refresh list
        } else {
            alert('Failed to delete request');
        }
    } catch (error) {
        console.error(`Error deleting request ${id}:`, error);
    }
}

// Function to trigger backend email notification
async function sendEmailNotification(email, name, status) {
    try {
        await fetch(`https://neristconnect.onrender.com/leave/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                name,
                status
            })
        });
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
}

// Helper to format ISO date
function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

// Load on page load
window.onload = fetchLeaveRequests;

