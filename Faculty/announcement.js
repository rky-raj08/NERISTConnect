document.addEventListener("DOMContentLoaded", function () {
    const newsItems = document.querySelectorAll(".news");
    let index = 0;

    function showNextAnnouncement() {
        newsItems.forEach((item, i) => {
            item.classList.remove("active"); // Remove active class from all
        });

        newsItems[index].classList.add("active"); // Show current announcement
        index = (index + 1) % newsItems.length; // Loop back when reaching the end
    }

    // Show the first announcement immediately
    showNextAnnouncement();

    // Change announcements every 3 seconds
    setInterval(showNextAnnouncement, 3000);
});
