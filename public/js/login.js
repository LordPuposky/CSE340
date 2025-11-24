// Toggle password visibility
document.addEventListener('DOMContentLoaded', function () {
    const showPasswordBtn = document.getElementById('show-password');
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
            } else {
                passwordInput.type = "password";
            }
        });
    }
});
