// js/searchContact.js
;(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', () => {
      const userId = localStorage.getItem('userID');
      if (!userId) return;

      fetch('LAMPAPI/SearchContact.php', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          search: input.value,    // whatever they type, spaces included
          UserId: userId
        })
      })
      .then(res => res.json())
      .then(data => {
        const table = document.getElementById('contactTable');
        table.innerHTML = '';
        (data.results || []).forEach(c => appendContactRow(c));
      })
      .catch(console.error);
    });

    // initial load
    input.dispatchEvent(new Event('input'));
  });

  function appendContactRow(c) {
    const row = document.createElement('div');
    row.className = 'contact-row';
    row.setAttribute('data-contact-id', c.ID);
    row.innerHTML = `
      <span class="contact-col name-col">${c.FirstName} ${c.LastName}</span>
      <span class="contact-col email-col">${c.Email}</span>
      <span class="contact-col phone-col">${c.Phone}</span>
      <div class="actions">
        <button class="icon-btn edit-btn"><img src="images/EditVector.svg" alt="Edit"></button>
        <button class="icon-btn delete-btn"><img src="images/DeleteVector.svg" alt="Delete"></button>
      </div>
    `;
    document.getElementById('contactTable').appendChild(row);
  }
})();
