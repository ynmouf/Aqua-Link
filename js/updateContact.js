// js/updateContact.js

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('contactTable');
  if (!table) return;

  table.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const row = btn.closest('.contact-row');
    if (!row) return;

    // 1) EDIT
    if (btn.querySelector('img')?.alt === 'Edit') {
      enterEditMode(row);
      return;
    }

    // 2) SAVE
    if (btn.classList.contains('save-inline')) {
      saveEdit(row);
      return;
    }

    // 3) CANCEL
    if (btn.classList.contains('cancel-inline')) {
      cancelEdit(row);
      return;
    }
  });
});

function enterEditMode(row) {
  if (row.classList.contains('editing')) return;
  row.classList.add('editing');

  // grab current values
  const nameSpan  = row.querySelector('.name-col');
  const emailSpan = row.querySelector('.email-col');
  const phoneSpan = row.querySelector('.phone-col');
  const [first, ...rest] = nameSpan.textContent.trim().split(' ');
  const last = rest.join(' ');

  // replace text with inputs
  nameSpan.innerHTML  = `<input type="text" class="edit-first" value="${first}" />
                         <input type="text" class="edit-last"  value="${last}"  />`;
  emailSpan.innerHTML = `<input type="email" class="edit-email" value="${emailSpan.textContent.trim()}" />`;
  phoneSpan.innerHTML = `<input type="tel"   class="edit-phone" value="${phoneSpan.textContent.trim()}" />`;

  // swap action buttons
  const actions = row.querySelector('.actions');
  actions.innerHTML = `
    <button class="save-inline">SAVE</button>
    <button class="cancel-inline">CANCEL</button>
  `;
}

function cancelEdit(row) {
  // restore original values from defaultValue
  const firstInput  = row.querySelector('.edit-first');
  const lastInput   = row.querySelector('.edit-last');
  const emailInput  = row.querySelector('.edit-email');
  const phoneInput  = row.querySelector('.edit-phone');

  const first = firstInput.defaultValue;
  const last  = lastInput.defaultValue;
  const email = emailInput.defaultValue;
  const phone = phoneInput.defaultValue;

  row.querySelector('.name-col').textContent  = `${first} ${last}`.trim();
  row.querySelector('.email-col').textContent = email;
  row.querySelector('.phone-col').textContent = phone;

  // restore the edit/delete icons
  const actions = row.querySelector('.actions');
  actions.innerHTML = `
    <button class="icon-btn"><img src="images/EditVector.svg"   alt="Edit"></button>
    <button class="icon-btn delete-btn"><img src="images/DeleteVector.svg" alt="Delete"></button>
  `;
  row.classList.remove('editing');
}

function saveEdit(row) {
  const userId = localStorage.getItem('userID');
  if (!userId) {
    return alert('User not logged in');
  }

  const contactId = row.getAttribute('data-contact-id');
  const first     = row.querySelector('.edit-first').value.trim();
  const last      = row.querySelector('.edit-last').value.trim();
  const email     = row.querySelector('.edit-email').value.trim();
  const phone     = row.querySelector('.edit-phone').value.trim();

  fetch('LAMPAPI/UpdateContact.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      FirstName: first,
      LastName:  last,
      Email:     email,
      Phone:     phone,
      UserID:    userId,
      ContactID: parseInt(contactId, 10)
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert('Error updating contact: ' + data.error);
        return cancelEdit(row);
      }
      // on success, write new values back into the row
      row.querySelector('.name-col').textContent  = `${first} ${last}`.trim();
      row.querySelector('.email-col').textContent = email;
      row.querySelector('.phone-col').textContent = phone;

      // restore action icons
      const actions = row.querySelector('.actions');
      actions.innerHTML = `
        <button class="icon-btn"><img src="images/EditVector.svg"   alt="Edit"></button>
        <button class="icon-btn delete-btn"><img src="images/DeleteVector.svg" alt="Delete"></button>
      `;
      row.classList.remove('editing');
    })
    .catch(err => {
      console.error('Network error updating contact:', err);
      alert('Network error. Please try again.');
      cancelEdit(row);
    });
}
