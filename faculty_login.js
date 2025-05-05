const loginForm = document.getElementById('login-form');

const loginfaculty = async (username, password) => {
    const res = await fetch('https://neristconnect.onrender.com/faculty-login', {
        method: "POST",
        body: JSON.stringify({ username: username, password_hash: password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res;
};

const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target[0].value;
    const password = e.target[1].value;

    try {
        const response = await loginfaculty(username, password);
        const json = await response.json();

        if (json.error) {
            alert(json.error);
        } else {
            console.log(json.admin);

            // Save admin login details if needed
            localStorage.setItem("faculty_username", json.faculty.username);
            localStorage.setItem("faculty_password", json.faculty.password_hash);

            // Redirect to faculty Dashboard
            window.location.href = "/Faculty/index.html";
        }
    } catch (err) {
        console.error("Faculty login error:", err);
        alert("Something went wrong. Please try again.");
    }
};

loginForm.addEventListener('submit', handleLogin);


