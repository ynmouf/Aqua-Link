// js/deleteContact.js
document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('contactTable');
  if (!table) return;

  table.addEventListener('click', e => {
    const btn = e.target.closest('button.delete-btn');
    if (!btn) return;

    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    const row = btn.closest('.contact-row');
    const contactId = row.getAttribute('data-contact-id');
    if (!contactId) return;

    // grab the current user’s ID from localStorage
    const userId = localStorage.getItem('userID');
    if (!userId) {
      alert('User not logged in.');
      return;
    }

    fetch('LAMPAPI/DeleteContact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ContactID: contactId,
        UserID:    userId       
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data.error) {
        alert('Error deleting contact: ' + data.error);
      } else {
       
        window.tablePager.removeContactById(+contactId);
      }
    })
    .catch(err => {
      console.error('Delete failed', err);
      alert('Network error on delete.');
    });
  });
});
