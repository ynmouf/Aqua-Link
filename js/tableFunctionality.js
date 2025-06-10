// js/tableFunctionality.js
;(function(window){
  const pageSize = 10;
  let contacts = [];
  let currentPage = 1;

  const tableEl = document.getElementById('contactTable');
  let pagerEl = null;


  function initPagination() {
    pagerEl = document.createElement('div');
    pagerEl.id = 'contactPager';
    pagerEl.className = 'pager';
    tableEl.parentNode.insertBefore(pagerEl, tableEl.nextSibling);
  }

  /** Replace entire contact list (e.g. after search) */
  function setContacts(newContacts) {
    contacts = Array.isArray(newContacts) ? newContacts : [];
    currentPage = 1;
    renderPage();
  }

  // Compute how many pages needed
  function getTotalPages() {
    return Math.max(1, Math.ceil(contacts.length / pageSize));
  }

  // Main render: rows + pager buttons */
  function renderPage() {
    const totalPages = getTotalPages();
    const start = (currentPage - 1) * pageSize;
    const pageContacts = contacts.slice(start, start + pageSize);

    // 1) rebuild table rows
    tableEl.innerHTML = '';
    pageContacts.forEach(c => appendContactRow(c));

    // 2) rebuild pager
    pagerEl.innerHTML = '';

    // Prev arrow
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pager-arrow-btn';
    prevBtn.disabled = (currentPage === 1);
    prevBtn.textContent = 'Prev';
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
      }
    });
    pagerEl.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'pager-button' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.addEventListener('click', () => {
        if (i !== currentPage) {
          currentPage = i;
          renderPage();
        }
      });
      pagerEl.appendChild(btn);
    }

    // Next arrow
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pager-arrow-btn';
    nextBtn.disabled = (currentPage === totalPages);
    nextBtn.textContent = 'Next';
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage();
      }
    });
    pagerEl.appendChild(nextBtn);
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
        <button class="icon-btn edit-btn">
          <img src="images/EditVector.svg" alt="Edit" />
        </button>
        <button class="icon-btn delete-btn">
          <img src="images/DeleteVector.svg" alt="Delete" />
        </button>
      </div>
    `.trim();

    tableEl.appendChild(row);
  }

  /** Delete from array + clamp page, then re-render */
  function removeContactById(id) {
    contacts = contacts.filter(c => {
      const cid = c.ID != null ? c.ID : c.ContactID;
      return cid !== id;
    });

    const totalPages = getTotalPages();
    if (currentPage > totalPages) currentPage = totalPages;
    renderPage();
  }

  // expose API (alias both names so contact.js still works)
  const api = { init: initPagination, setContacts, renderPage, removeContactById };
  window.tablePager        = api;
  window.tableFunctionality = api;

  // auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', () => api.init());
})(window);
