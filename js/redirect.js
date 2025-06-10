document.addEventListener('DOMContentLoaded', () => {
  const signupModal = document.getElementById('signupModal');
  const loginModal  = document.getElementById('loginModal');
  const toLoginLink = document.getElementById('toLoginLink');
  const toSignupLink = document.getElementById('toSignupLink');

  if (toLoginLink) {
    toLoginLink.addEventListener('click', e => {
      e.preventDefault();
      if (signupModal) signupModal.style.display = 'none';
      if (loginModal)  loginModal.style.display  = 'flex';
    });
  }

  if (toSignupLink) {
    toSignupLink.addEventListener('click', e => {
      e.preventDefault();
      if (loginModal)  loginModal.style.display  = 'none';
      if (signupModal) signupModal.style.display = 'flex';
    });
  }
});
