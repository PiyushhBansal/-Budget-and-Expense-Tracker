// Function to load expenses from local storage
function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const totalElement = document.getElementById("totalAmount");
    let total = 0;

    expenses.forEach((expense, index) => {
        const table = document.getElementById("expenseTable");
        const row = table.insertRow();
        row.innerHTML = 
            `<td>${expense.amount}</td>
            <td>${expense.currency}</td>
            <td>${expense.category}</td>
            <td>${expense.converted.toFixed(2)} EUR</td>
            <td><button class="btn-delete" data-index="${index}">Delete</button></td>`;
        
        total += expense.converted;
    });

    totalElement.textContent = total.toFixed(2);
    document.getElementById("selectedCurrency").textContent = "EUR"; // Default currency
}

// Function to save expenses to local storage
function saveExpenseToLocalStorage(amount, currency, category, converted) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ amount, currency, category, converted });
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to delete an expense
function deleteExpense(index) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1); // Remove the expense at the specified index
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Update local storage
    refreshExpenseTable(); // Refresh the table to reflect changes
}

// Function to refresh the expense table
function refreshExpenseTable() {
    const table = document.getElementById("expenseTable");
    table.innerHTML = ""; // Clear the current table
    loadExpenses(); // Reload expenses from local storage
}

// Load expenses when the page loads
window.onload = loadExpenses;

document.getElementById("addExpense").addEventListener("click", async function() {
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;
    const category = document.getElementById("category").value;

    if (!amount || !category) {
        alert("Please enter all fields");
        return;
    }

    const converted = await convertCurrency(amount, currency, "EUR");
    const table = document.getElementById("expenseTable");
    const row = table.insertRow();
    row.innerHTML = 
        `<td>${amount}</td>
        <td>${currency}</td>
        <td>${category}</td>
        <td>${converted.toFixed(2)} EUR</td>
        <td><button class="btn-delete">Delete</button></td>`; // Add delete button

    // Update total
    const totalElement = document.getElementById("totalAmount");
    const currentTotal = parseFloat(totalElement.textContent) || 0;
    totalElement.textContent = (currentTotal + converted).toFixed(2);

    // Save expense to local storage
    saveExpenseToLocalStorage(amount, currency, category, converted);

    // Clear inputs
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";

    // Get insights
    const previousTotal = 100; // Replace with actual previous total spent
    const insight = await getSpendingInsight(totalElement.textContent, previousTotal);
    document.getElementById("insight").textContent = insight;
});

// Convert total to selected currency
document.getElementById("convertTotal").addEventListener("click", async function() {
    const totalAmount = parseFloat(document.getElementById("totalAmount").textContent);
    const newCurrency = document.getElementById("convertCurrency").value;

    if (newCurrency === "EUR") {
        document.getElementById("selectedCurrency").textContent = "EUR";
        return;
    }

    const convertedTotal = await convertCurrency(totalAmount, "EUR", newCurrency);
    document.getElementById("totalAmount").textContent = convertedTotal.toFixed(2);
    document.getElementById("selectedCurrency").textContent = newCurrency;
});

// Event delegation for delete buttons
document.getElementById("expenseTable").addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-delete")) {
        const index = event.target.getAttribute("data-index");
        deleteExpense(index);
    }
});

async function convertCurrency(amount, from, to) {
    try {
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
        const data = await res.json();
        return data.rates[to] || amount;
    } catch (error) {
        alert("Error fetching exchange rates");
        return amount;
    }
}

async function getSpendingInsight(totalSpent, previousTotal) {
    const prompt = `You spent a total of ${totalSpent} this month. Last month, you spent ${previousTotal}. Provide insights on this spending behavior.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_API_KEY` // Replace with your OpenAI API key
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // or any other model you prefer
            messages: [{ role: "user", content: prompt }],
        }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
}