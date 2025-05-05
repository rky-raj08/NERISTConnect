
function selectUser(userType) {
    document.getElementById("query-box").style.display = "block";
    
    // Redirect based on user type after a short delay
    setTimeout(function() {
        if (userType === 'student') {
            window.location.href = '../index.html'; // Redirect to student page
        } else if (userType === 'faculty') {
            window.location.href = '../faculty_login.html'; // Redirect to faculty page
        }

        else if (userType === 'admin') 
            window.location.href = '../admin_login.html';
        
    }, 1000); // 1-second delay for better user experience
}
