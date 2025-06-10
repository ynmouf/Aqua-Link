// Open the login modal
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'flex';
}

// Close the login modal
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none';
}

// Handle the form submission
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl  = document.getElementById('loginError');

  // Clear previous error
  errorEl.textContent = '';
  errorEl.style.display = 'none';

  // Basic validation
  if (!username || !password) {
    errorEl.textContent = 'Username and password are required.';
    errorEl.style.display = 'block';
    return false;
  }

  // Send credentials to the server
  fetch('LAMPAPI/Login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Login: username, Password: password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error === '') {
      // Save user info
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('lastName',  data.lastName  || '');
      if (data.id) {
        localStorage.setItem('userID', data.id);
      }
      localStorage.setItem('isLoggedIn', 'true');
      // Redirect to contacts page
      window.location.href = 'contact.html';
    } else {
      // Show server-side error
      errorEl.textContent = data.error;
      errorEl.style.display = 'block';
    }
  })
  .catch(err => {
    console.error('Fetch error during login:', err);
    errorEl.textContent = 'Network error. Please try again.';
    errorEl.style.display = 'block';
  });

  return false;
}

// Close the modal if user clicks outside the box
window.addEventListener('click', function(event) {
  const modal = document.getElementById('loginModal');
  if (event.target === modal) {
    closeLoginModal();
  }
});

// wire up the "Already have an account?" link in the signup modal
document.getElementById('toLoginLink')?.addEventListener('click', e => {
  e.preventDefault();
  closeSignupModal && closeSignupModal();
  openLoginModal();
});
