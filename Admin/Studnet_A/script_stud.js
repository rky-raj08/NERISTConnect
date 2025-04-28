document.addEventListener('DOMContentLoaded', function () {
// Select specific modules
const complaintsModule = document.querySelector('.module:nth-child(1)');
const certificatesModule = document.querySelector('.module:nth-child(2)');
const waterModule = document.querySelector('.module:nth-child(3)');
const libraryModule = document.querySelector('.module:nth-child(4)');
const electricityModule = document.querySelector('.module:nth-child(5)');
const feedbackModule = document.querySelector('.module:nth-child(6)');


// Add event listeners for each module
complaintsModule.addEventListener('click', function () {
    window.location.href = '/Admin/complaint.html'; // Link to complaints page
});

certificatesModule.addEventListener('click', function () {
    window.location.href = '/Admin/Studnet_A/Certificate_admin.html'; // Link to certificates page
});

libraryModule.addEventListener('click', function () {
    window.location.href = '/Admin/Studnet_A/Library.html'; // Link to library page
});

electricityModule.addEventListener('click', function () {
    window.location.href = '/Admin/Studnet_A/Electricity_admin.html'; // Link to electricity page
});


waterModule.addEventListener('click', function () {
    window.location.href = '/Admin/Studnet_A/admin_water.html'; // Link to electricity page
});

feedbackModule.addEventListener('click', function () {
    window.location.href = '/Admin/Studnet_A/feedback.html'; // Link to feedback page
});
// Example: Smooth scrolling function
function smoothScrollTo() {
    window.scrollTo({
        top: 2000, // Adjust scrolling position as needed
        behavior: 'smooth'
    });
}
});