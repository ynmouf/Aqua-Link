// Open the signup modal
function openSignupModal() {
  const modal = document.getElementById('signupModal');
  if (modal) modal.style.display = 'flex';
}

// Close the signup modal
function closeSignupModal() {
  const modal = document.getElementById('signupModal');
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#signupModal form');
  if (!form) return;

  // Grab each input
  const [firstInput, lastInput, loginInput, pwInput, pwConfInput] =
    Array.from(form.querySelectorAll('input'));

  // Remove any inline error messages
  function clearErrors() {
    form.querySelectorAll('.error-text').forEach(e => e.remove());
    const apiErr = document.getElementById('signupError');
    if (apiErr) {
      apiErr.textContent = '';
      apiErr.style.display = 'none';
    }
  }

  // Show an inline error under the given field
  function showError(field, message) {
    const err = document.createElement('div');
    err.className = 'error-text';
    err.textContent = message;
    const wrapper = field.closest('.input-wrapper');
    wrapper.parentNode.insertBefore(err, wrapper.nextSibling);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const first  = firstInput.value.trim();
    const last   = lastInput.value.trim();
    const login  = loginInput.value.trim();
    const pw     = pwInput.value;
    const pwConf = pwConfInput.value;

    let valid = true;
    const nameRegex = /^[A-Za-z]+$/;
    const pwRegex   = /^(?=.*\d).{6,}$/;

    // 1) Non-empty
    [firstInput, lastInput, loginInput, pwInput, pwConfInput].forEach(f => {
      if (!f.value.trim()) {
        valid = false;
        showError(f, 'This field cannot be blank.');
      }
    });

    // 2) Names only letters
    if (first && !nameRegex.test(first)) {
      valid = false;
      showError(firstInput, 'First name must be letters only.');
    }
    if (last && !nameRegex.test(last)) {
      valid = false;
      showError(lastInput, 'Last name must be letters only.');
    }

    // 3) Password strength
    if (pw && !pwRegex.test(pw)) {
      valid = false;
      showError(pwInput, 'Must be ≥6 chars and include a number.');
    }

    // 4) Match confirmation
    if (pw && pwConf && pw !== pwConf) {
      valid = false;
      showError(pwConfInput, 'Passwords do not match.');
    }

    if (!valid) return; // stop on validation errors

    // 5) Submit to API
    fetch('LAMPAPI/Register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        FirstName: first,
        LastName:  last,
        Login:     login,
        Password:  pw
      })
    })
    .then(res => res.json())
    .then(data => {
      const apiErr = document.getElementById('signupError');
      if (data.error === '') {
        // Success: store and redirect
        localStorage.setItem('userID',     data.id);
        localStorage.setItem('firstName',  data.firstName);
        localStorage.setItem('lastName',   data.lastName);
        localStorage.setItem('isLoggedIn','true');
        window.location.href = 'contact.html';
      } else {
        // Server-side error at top
        apiErr.textContent = data.error;
        apiErr.style.display = 'block';
      }
    })
    .catch(err => {
      console.error('Signup fetch error:', err);
      const apiErr = document.getElementById('signupError');
      apiErr.textContent = 'Network error — please try again.';
      apiErr.style.display = 'block';
    });
  });

  // Close if clicking outside the modal box
  window.addEventListener('click', function (event) {
    const modal = document.getElementById('signupModal');
    if (event.target === modal) {
      closeSignupModal();
    }
  });

  // Link from login modal
  document.getElementById('toSignupLink')?.addEventListener('click', e => {
    e.preventDefault();
    closeLoginModal && closeLoginModal();
    openSignupModal();
  });
});
