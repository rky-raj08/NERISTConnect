document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.getElementById("certificateTable");

    try {
        const response = await fetch("http://localhost:5000/certificates/all");
        const certificates = await response.json();

        certificates.forEach((certificate, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${certificate.name}</td>
                <td>${certificate.roll}</td>
                <td>${certificate.email}</td>
                <td>${certificate.certificate_type}</td>
                <td>${certificate.reason}</td>
                <td id="status-${certificate.id}">${certificate.status || 'Pending'}</td>
                <td>
                    <button class="approve-btn" data-id="${certificate.id}">Approve</button>
                    <button class="reject-btn" data-id="${certificate.id}">Reject</button>
                    <button class="delete-btn" data-id="${certificate.id}">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners for approve and reject buttons
        document.querySelectorAll(".approve-btn").forEach(button => {
            button.addEventListener("click", () => updateCertificateStatus(button.dataset.id, "Approved"));
        });

        document.querySelectorAll(".reject-btn").forEach(button => {
            button.addEventListener("click", () => updateCertificateStatus(button.dataset.id, "Rejected"));
        });

        // ✅ Delete button listeners
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => deleteCertificate(button.dataset.id, button));
        });

    } catch (error) {
        console.error("Error fetching certificates:", error);
        tableBody.innerHTML = "<tr><td colspan='8'>Failed to load data.</td></tr>";
    }
});

// Function to update status and send email if approved
async function updateCertificateStatus(id, status) {
    try {
        const response = await fetch(`http://localhost:5000/certificate/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            document.getElementById(`status-${id}`).textContent = status;

            // If approved, send email
            if (status === "Approved") {
                const row = document.querySelector(`button[data-id="${id}"]`).closest("tr");
                const email = row.children[3].textContent;
                const certificate_type = row.children[4].textContent;

                await fetch("http://localhost:5000/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        subject: "Certificate Approval Notification",
                        message: `Your ${certificate_type} certificate has been approved. Please collect it from the office within 2 days.`
                    })
                });
            }
        } else {
            alert("Failed to update status.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

// ✅ Function to delete certificate (newly added)
async function deleteCertificate(id, button) {
    if (!confirm("Are you sure you want to delete this certificate request?")) return;

    const row = button.closest("tr");

    try {
        const response = await fetch(`http://localhost:5000/certificates/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            row.remove(); // ✅ Remove row from UI
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error deleting certificate:", error);
        alert("Server error! Please try again later.");
    }
}
