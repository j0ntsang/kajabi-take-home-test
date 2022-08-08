document.addEventListener("DOMContentLoaded", function() {
  window.current_page = 1;

  // Select the table element
  const table = document.getElementById('reqres__users-table');
  // Define static table headings
  // TODO: Add sort?
  const tableHeadings = ['', 'Name', 'Email'];

  // Debounce for search functionality
  function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  // Generate table headings
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

  // Generate table body
  function generateTable(table, data, per_page, filter, event) {
    // Assign selector to existing table body or create new
    const tableBody = document.querySelector('tbody') || table.createTBody();

    // If input change was detected, wipe the table body of current results
    if (event !== null) {
      tableBody.innerHTML = '';
    }

    // Filtered Array by email or renders all
    let filteredData = Object.values(data).filter((user) => {
      if (typeof filter !== "undefined") {
        const email = user.email.toLowerCase();
        return email.includes(filter.toLowerCase());
      }
      return true;
    });

    // Empty results messaging
    if (filteredData.length < 1) {
      let emptyRow = tableBody.insertRow();
      let emptyCell = emptyRow.insertCell();
      emptyCell.setAttribute('colspan', '3');
      emptyCell.classList.add('table__no-results');
      emptyCell.innerHTML = "There are no users that meet search criteria";
    }
    // Construct the table row
    else {
      const total_results = filteredData.length;
      let i = 0;

      while (i < total_results) {
        window.current_page;
        let row = tableBody.insertRow();
        const { id, first_name, last_name, email, avatar } = filteredData[i];
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

        // Add event listener to view user results
        row.addEventListener('click', function(e) {
          const userDetails = document.querySelector('.reqres__user-details');
          const iframe = document.createElement('iframe');
          const url = window.location.href;
          window.location = `${url}user/${id}`;
        });

        i++;
      }
    }
  }

  // Generate Pagination navigation
  function generatePagination(pages) {
    const pagination = document.querySelector('.pagination');

    // Previous Button
    const previousItem = document.createElement('li');
    previousItem.classList.add('page-item');
    const previousButton = document.createElement('button');
    previousButton.classList.add('page-link');
    previousButton.setAttribute('aria-label', 'Go to previous page');
    previousButton.innerHTML = 'Previous';
    previousItem.appendChild(previousButton);
    pagination.appendChild(previousItem);

    // Page Links
    let i = 1;
    while (i <= pages) {
      const listItem = document.createElement('li');
      listItem.classList.add('page-item');
      const listButton = document.createElement('button');
      listButton.classList.add('page-link');
      if (window.current_page === i) {
        listButton.classList.add('active');
      }
      listButton.setAttribute('aria-label', `Go to page ${i}`);
      listButton.innerHTML = i;
      listButton.addEventListener('click', function(e) {
        const buttons = document.querySelectorAll('.page-link');
        buttons.forEach(button => {
          button.classList.remove('active');
        });
        window.current_page = i;
        e.target.classList.add('active');
      });
      listItem.appendChild(listButton);
      pagination.appendChild(listItem);
      i++;
    }

    // Next Button
    const nextItem = document.createElement('li');
    nextItem.classList.add('page-item');
    const nextbutton = document.createElement('button');
    nextbutton.classList.add('page-link');
    nextbutton.setAttribute('aria-label', 'Go to next page');
    nextbutton.innerHTML = 'Next';
    nextItem.appendChild(nextbutton);
    pagination.appendChild(nextItem);
  }

  // Check for query string in URL
  // Legacy: This was added to support page & user params in the URL
  const queryString = window.location.search;
  if (queryString === "") {

    // Grab the data passed from the controller
    const userData = JSON.parse(prefetch_data);

    // Generate initial table head & body
    generateTableHead(table, tableHeadings);
    generateTable(table, userData, per_page);

    // Capture the search filter elements
    const searchFilter = document.getElementById('reqres-search');
    const searchFilterReset = document.getElementById('reqres-search-clear');

    // Bind event listener for filtering
    searchFilter.addEventListener('input', function (e) {
      const filter = e.target.value;
      debounce(generateTable(table, userData, per_page, filter, e));
    });

    // Bind event listener for clearing search
    searchFilterReset.addEventListener('click', function (e) {
      searchFilter.value = '';
      generateTable(table, userData, per_page);
    });

    // Generate the pagination elements
    generatePagination(total_pages);
  }
});