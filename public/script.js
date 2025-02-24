// Get references to portal buttons and form
const policePortalBtn = document.getElementById('police-portal');
const userPortalBtn = document.getElementById('user-portal');
const loginForm = document.querySelector('.login-form');

// Create a hidden input field for portal type
const portalInput = document.createElement('input');
portalInput.setAttribute('type', 'hidden');
portalInput.setAttribute('name', 'portal');

// Ensure the form exists before appending
if (loginForm) {
    loginForm.appendChild(portalInput);
}

// Event listeners for portal buttons
policePortalBtn?.addEventListener('click', function () {
    loginForm.style.display = 'block';
    document.getElementById('portal-title').innerText = 'Police Login Portal';
    document.getElementById('userid').setAttribute('placeholder', 'Enter Police ID');
    portalInput.value = 'police';
});

userPortalBtn?.addEventListener('click', function () {
    loginForm.style.display = 'block';
    document.getElementById('portal-title').innerText = 'User (Female) Login Portal';
    document.getElementById('userid').setAttribute('placeholder', 'Enter User ID');
    portalInput.value = 'user';
});




