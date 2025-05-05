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


/*// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Select sidebar menu items by text
    const dashboardPage = document.querySelector('.sidebar ul li:nth-child(1)');
    const studentPage = document.querySelector('.sidebar ul li:nth-child(2)');
    const facultyPage = document.querySelector('.sidebar ul li:nth-child(3)');
    const logoutPage = document.querySelector('.sidebar ul li:nth-child(4)');

    // Redirect to the respective pages when clicked
    dashboardPage.addEventListener('click', function () {
        window.location.href = './Dashboard.html'; // Update with actual path
    });

    studentPage.addEventListener('click', function () {
        window.location.href = '/Admin/Studnet_A/student_admin.html'; // Update with actual path
    });

    facultyPage.addEventListener('click', function () {
        window.location.href = './faculty.html'; // Update with actual path
    });

    logoutPage.addEventListener('click', function () {
        window.location.href = './logout.html'; // Update with actual path
    });


    

    // Example: Smooth scrolling function
    function smoothScrollTo() {
        window.scrollTo({
            top: 2000, // Adjust scrolling position as needed
            behavior: 'smooth'
        });
    }
});

*/