document.addEventListener("DOMContentLoaded", () => {
    const suggestionBox = document.getElementById("suggestion-text");
    const submitButton = document.getElementById("submit-suggestion");

    submitButton.addEventListener("click", async () => {
        const suggestionText = suggestionBox.value.trim();
        if (suggestionText === "") {
            alert("Please enter a suggestion before submitting.");
            return;
        }

        try {
            const response = await fetch("https://neristconnect.onrender.com/feedback/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: suggestionText }), // ✅ Corrected key
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                suggestionBox.value = ""; // Clear input on success
            } else {
                alert("Error: " + (result.error || "Something went wrong"));
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to connect to the server.");
        }
    });
});
