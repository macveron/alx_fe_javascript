let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { id: 1, text: "The journey of a thousand miles begins with one step.", category: "Inspiration" },
  { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { id: 3, text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Individuality" }
];

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Sync quotes with server and handle conflicts
async function syncQuotes() {
  await fetchQuotesFromServer();
  await saveQuotesToServer();
  alert("Quotes synced with server!"); // User feedback for successful sync
}

// Fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    // Simulate extracting necessary quote information
    const fetchedQuotes = serverQuotes.map((item) => ({
      id: item.id,
      text: item.title, // Using 'title' field to simulate quote text
      category: "General" // Default category, as JSONPlaceholder lacks categories
    }));

    resolveConflicts(fetchedQuotes);
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Save local quotes to server (Simulation only)
async function saveQuotesToServer() {
  try {
    for (const quote of quotes) {
      await fetch(SERVER_URL, {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("Error saving quotes to server:", error);
  }
}

// Resolve conflicts between local and server quotes
function resolveConflicts(serverQuotes) {
  const localQuoteIds = quotes.map(quote => quote.id);
  const newServerQuotes = serverQuotes.filter(quote => !localQuoteIds.includes(quote.id));

  // If there are new quotes from the server, notify the user
  if (newServerQuotes.length > 0) {
    alert('New quotes were added from the server.');
    quotes.push(...newServerQuotes);
    saveQuotes();
  }
}

// Add a new quote to local storage and sync with server
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      id: Date.now(),
      text: newQuoteText,
      category: newQuoteCategory
    };
    quotes.push(newQuote);
    saveQuotes();
    saveQuotesToServer(); // Sync new quote to the server
    populateCategories();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories for filtering
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(quote => quote.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Load the last selected filter from local storage
  const lastSelectedCategory = localStorage.getItem('selectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  return selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
}

// Show a random quote
function showRandomQuote() {
  const filteredQuotes = filterQuotes();
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = 'No quotes available for this category.';
  } else {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById('quoteDisplay').innerHTML = filteredQuotes[randomIndex].text;
  }
}

// Sync data periodically (e.g., every 60 seconds)
setInterval(syncQuotes, 60000);

// Initialize the app
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
window.onload = () => {
  syncQuotes(); // Fetch quotes on load
  populateCategories();
  showRandomQuote();
};
