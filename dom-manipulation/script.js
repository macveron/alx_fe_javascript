// Initialize the array of quotes
const quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" }
];

// Function to display a random quote from the quotes array
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');

  // Use innerHTML to format the quote and category
  quoteDisplay.innerHTML = `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
}

// Function to create the form for adding a new quote dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;

  document.body.appendChild(formContainer);
}

// Function to add a new quote based on user input
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Add event listener to the 'Show New Quote' button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Display the initial quote and create the quote form when the page loads
document.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();
  createAddQuoteForm();
});
