// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Select the complaints module by its ID
    const complaintsModule = document.getElementById('Complaints-module');
    const electricityModule = document.getElementById('electricity-module');
    const waterSupplyModule = document.getElementById('water-supply-module');
    const wasteManagementModule = document.getElementById('waste-management-module');
    const CertificateModule = document.getElementById('Cetificate-module');
    const LibraryModule = document.getElementById('Library-module');

    const userAvatar = document.getElementById('userChar');
    const userDetails = document.getElementById('userDetails');
    // const userEmail = document.getElementById('userEmail');
    // userEmail.innerText += " "+ userEmail2
    
    const logoutBtn = document.getElementById('logout-btn')
    // dsghjkfghj
    const userEmail2 = localStorage.getItem('username')
    if(!userEmail2){
        window.location.href = './index.html'
    }
    
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        window.location.href = './index.html'
    })
    let showId = false
    userAvatar.addEventListener('click', function () {
        showId = !showId
        if (showId) {
            userDetails.innerHTML += "<p >Email: " + userEmail2 + "</p>"
        }
        else {
            userDetails.innerHTML = ""
        }
    });

    // Add a click event listener to redirect to the complaints page
    complaintsModule.addEventListener('click', function () {
        window.location.href = './nerist_ums_login/Complaint1.html'; // Link to the complaints page
    });

    electricityModule.addEventListener('click', function () {
        window.location.href = './Student/electricity.html'; // Link to the electricity page
    });

    waterSupplyModule.addEventListener('click', function () {
        window.location.href = './Student/water.html'; // Link to the electricity page
    });

    wasteManagementModule.addEventListener('click', function () {
        window.location.href = './Student/waste.html'; // Link to the waste page
    });

    CertificateModule.addEventListener('click', function () {
        window.location.href = './Certificates.html'; // Link to the waste page
    });

    LibraryModule.addEventListener('click', function () {
        window.location.href = './Library_front.html'; // Link to the waste page
    });


    // Handle Suggestion Box Submission
    /* const suggestionBox = document.getElementById("suggestion-text");
     const submitButton = document.getElementById("submit-suggestion");
 
     submitButton.addEventListener("click", async () => {
         const suggestionText = suggestionBox.value.trim();
         if (suggestionText === "") {
             alert("Please enter a suggestion before submitting.");
             return;
         }
 
         // Send suggestion to backend
         const response = await fetch("http://localhost:5000/feedback/submit", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ suggestion: suggestionText }),
         });
 
         const result = await response.json();
         alert(result.message);
         suggestionBox.value = ""; // Clear input after submission
     });*/
});


function smoothScrollTo() {
    window.scrollTo({
        top: 2000,  // Scrolls down to the vertical position of 1000px
        behavior: 'smooth'  // Smooth scrolling effect
    });
}

// 🔒 Prevent back button from returning to login page
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};


