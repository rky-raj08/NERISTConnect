const loginForm = document.getElementById('login-form')
// const handleLogin = () =>{    
//     console.log('clicked')
// }

// dfghjkl;
document.addEventListener('DOMContentLoaded', function(){
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')
    if(username && password){
        window.location.href = "./W_page.html"
    }
})

const loginUser = async (username, password) => {
    result = false;
    const res = await fetch('http://localhost:5000/login', {
        method: "POST",
        body: JSON.stringify({ username: username, password_hash: password }),
        headers: {
            "Content-Type": "application/json",
        },
    })

    return res;
}



const handleLogin = async (e) => {
    e.preventDefault()
    const username = e.target[0].value
    const password = e.target[1].value
    const res = loginUser(username, password)
    res
        .then((response) => response.json())
        .then(json => {
            if(json.error){
                alert(json.error)
            }else{
         
                // redirect 
                console.log(json.user);
                localStorage.setItem("username",json.user.username)
                localStorage.setItem("password",json.user.password_hash)
                window.location.href = "./W_page.html"
            }
        })
        .catch(err => {
            console.log(err,"dskgn")
        })

    // console.log(e.target[0].value)
    // console.log(e.target[1].value)

}


// loginBtn.addEventListener('click',handleLogin)

loginForm.addEventListener('submit', (e) => handleLogin(e))





