// toggle.js
document.addEventListener('DOMContentLoaded', () => {
  // Find every toggle-password button
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input    = document.getElementById(targetId);
      if (!input) return;

      // Flip the input.type
      const isPwd = input.type === 'password';
      input.type  = isPwd ? 'text' : 'password';

      // Swap the icon classes
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-eye', !isPwd);
      icon.classList.toggle('fa-eye-slash', isPwd);
    });
  });
});
