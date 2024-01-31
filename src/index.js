function fetchAndDisplayQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
      .then(response => response.json())
      .then(quotes => {
        const quotesList = document.querySelector('#quotes-list'); // Assuming you have a <ul> with this ID
        quotesList.innerHTML = ''; // Clear existing quotes
        quotes.forEach(quote => {
          const li = document.createElement('li');
          li.className = 'quote-card';
          li.innerHTML = `
            <blockquote class="blockquote">
              <p class="mb-0">${quote.text}</p>
              <footer class="blockquote-footer">${quote.author}</footer>
              <br>
              <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
              <button class='btn-danger'>Delete</button>
            </blockquote>
          `;
          quotesList.appendChild(li);
  
          // Add event listeners for like and delete buttons
          li.querySelector('.btn-success').addEventListener('click', () => likeQuote(quote.id));
          li.querySelector('.btn-danger').addEventListener('click', () => deleteQuote(quote.id, li));
        });
      });
  }
  document.querySelector('#new-quote-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const quoteText = formData.get('text'); // Assuming your input has the name 'text'
    const quoteAuthor = formData.get('author'); // Assuming your input has the name 'author'
  
    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: quoteText,
        author: quoteAuthor,
      }),
    })
    .then(response => response.json())
    .then(newQuote => {
      // Optionally, fetch and display all quotes again to include the new one
      fetchAndDisplayQuotes();
    });
  });
  function deleteQuote(quoteId, quoteElement) {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: 'DELETE',
    })
    .then(() => {
      quoteElement.remove(); // Remove the quote from the page
    });
  }
  function likeQuote(quoteId) {
    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteId: quoteId,
        createdAt: Math.floor(Date.now() / 1000), // Current time in UNIX format
      }),
    })
    .then(() => {
      // Optionally, fetch and display all quotes again to update the likes count
      fetchAndDisplayQuotes();
    });
  }