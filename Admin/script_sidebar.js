document.addEventListener("DOMContentLoaded", function () {
    // Fetch and insert the sidebar dynamically
    fetch("sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            attachSidebarEvents(); // Call function to handle click events after sidebar loads
        })
        .catch(error => console.error("Error loading the sidebar:", error));
});

// Function to handle sidebar navigation
function attachSidebarEvents() {
    document.querySelectorAll(".sidebar ul li").forEach(item => {
        item.addEventListener("click", function () {
            let text = this.innerText.trim(); // Get the text of clicked item
            
            // Redirect based on clicked item
            if (text === "Dashboard") {
                window.location.href = "/Admin/Dashboard.html"; // Redirect to Dashboard page
            } else if (text === "Students") {
                window.location.href = "/Admin/Studnet_A/student_admin.html"; // Redirect to Students page
            } else if (text === "Faculty") {
                window.location.href = "/Admin/Studnet_A/faculty_admin.html"; // Redirect to Faculty page
            } else if (text === "Logout") {
                window.location.href = "/admin_login.html"; // Redirect to Logout page
            }
        });
    });
}
