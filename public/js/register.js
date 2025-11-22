// Show/hide password functionality for register form
document.addEventListener("DOMContentLoaded", function () {
    const showBtn = document.getElementById("show-password")
    const passwordInput = document.getElementById("account_password")

    if(showBtn && passwordInput){
        showBtn.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text"
            showBtn.textContent = "Hide Password"
        } else {
            passwordInput.type = "password"
            showBtn.textContent = "Show Password"
        }
        })
    }
})
