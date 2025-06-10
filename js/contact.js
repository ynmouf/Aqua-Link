// js/contact.js

document.addEventListener('DOMContentLoaded', () => {
  showGreeting();
  fetchAndRenderContacts('');   // load all

  tablePager.init();

  setupSearchListener();
  setupAddModal();
  setupAddForm();
  setupSignOut();

  // init pager + initial load
  tableFunctionality.init();
  fetchAndRenderContacts('');
});

function showGreeting() {
  const first = localStorage.getItem('firstName') || '';
  const last  = localStorage.getItem('lastName')  || '';
  const el    = document.getElementById('userName');
  el.textContent = first || last
    ? `${first}${first && last ? ' ' : ''}${last}`
    : 'User';
}

function setupSignOut() {
  document.getElementById('signOutButton').addEventListener('click', () => {
    ['firstName','lastName','isLoggedIn','userID'].forEach(k => localStorage.removeItem(k));
    window.location.href = 'index.html';
  });
}

function fetchAndRenderContacts(searchQuery) {
  const userId = localStorage.getItem('userID');
  if (!userId) return;

  fetch('LAMPAPI/SearchContact.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ search: searchQuery, UserId: userId })
  })
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('contactTable');
    container.innerHTML = '';

    // always clear the pager on a fresh fetch
    tablePager.setContacts([]);

    const results = Array.isArray(data.results) ? data.results : [];

    // if the server returned an error OR zero matches
    if (data.error || results.length === 0) {
      container.innerHTML = `
        <div class="no-contacts">
          <img src="images/no-contacts-found.png" alt="No contacts found" />
          <p>NO CONTACTS FOUND!</p>
        </div>
      `;
      return;
    }

    // otherwise hand the full result-set to pager
    tablePager.setContacts(results);
  })
  .catch(err => console.error('Error loading contacts:', err));
}

function setupSearchListener() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', e => {
    // jump back to page 1 on every new search
    tablePager.setContacts([]); 
    fetchAndRenderContacts(e.target.value);
  });
}

function appendContactRow(contact) {
  const first = contact.FirstName || contact.firstName || '';
  const last  = contact.LastName  || contact.lastName  || '';
  const email = contact.Email     || contact.email     || '';
  const phone = contact.Phone     || contact.phone     || '';
  const id    = contact.ID        || contact.ContactID || '';

  const row = document.createElement('div');
  row.className = 'contact-row';
  row.setAttribute('data-contact-id', id);

  row.innerHTML = `
    <span class="contact-col name-col">${first} ${last}</span>
    <span class="contact-col email-col">${email}</span>
    <span class="contact-col phone-col">${phone}</span>
    <div class="actions">
      <button class="icon-btn"><img src="images/EditVector.svg" alt="Edit" /></button>
      <button class="icon-btn delete-btn"><img src="images/DeleteVector.svg" alt="Delete" /></button>
    </div>
  `.trim();

  document.getElementById('contactTable').appendChild(row);
}

function setupAddModal() {
  const openBtn   = document.getElementById('openAddModalBtn');
  const modal     = document.getElementById('addContactModal');
  const cancelBtn = document.getElementById('cancelAddContactBtn');

  openBtn.addEventListener('click',  () => modal.classList.remove('hidden'));
  cancelBtn.addEventListener('click',() => modal.classList.add('hidden'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}

function setupAddForm() {
  const form = document.getElementById('addContactForm');
  const modal = document.getElementById('addContactModal');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const first = document.getElementById('firstNameInput').value.trim();
    const last  = document.getElementById('lastNameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    const userId = localStorage.getItem('userID');
    if (!userId) return alert('User not logged in.');

    fetch('LAMPAPI/AddContact.php', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ FirstName:first, LastName:last, Email:email, Phone:phone, UserID:userId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert('Error adding contact: ' + data.error);
      } else {
        fetchAndRenderContacts(document.getElementById('searchInput').value);
        form.reset();
        modal.classList.add('hidden');
      }
    })
    .catch(err => {
      console.error('Error adding contact:', err);
      alert('Network error. Please try again.');
    });
  });
}
