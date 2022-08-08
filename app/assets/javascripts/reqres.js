document.addEventListener("DOMContentLoaded", function() {
  const table = document.getElementById('reqres-users-table');
  const tableHeadings = ['', 'Name', 'Email'];

  function generateTableHead(table) {
    let thead = table.createTHead();
    let row = thead.insertRow();

    for (let key of tableHeadings) {
      let th = document.createElement('th');
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }

  function generateTable(table, data) {
    let tbody = table.createTBody();
    for (let element of data) {
      let row = tbody.insertRow();
      const { id, first_name, last_name, email, avatar } = element;
      const user = { full_name: `${first_name} ${last_name}`, email };

      let avatarElement = document.createElement('img');
      let avatarCell = row.insertCell();
      avatarElement.setAttribute('src', avatar);
      avatarElement.setAttribute('alt', '');
      avatarCell.classList.add('avatar')
      avatarCell.appendChild(avatarElement);

      for (key in user) {
        let cell = row.insertCell();
        let text = document.createTextNode(user[key]);
        cell.appendChild(text);
      }

      row.addEventListener('click', function(e) {
        const url = window.location.href;
        window.location = `${url}?user=${id}`;
      });
    }
  }

  const queryString = window.location.search;
  if (queryString === "") {
    generateTableHead(table, tableHeadings);
    generateTable(table, JSON.parse(prefetch_data));
  }
});