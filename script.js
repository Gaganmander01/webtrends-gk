import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { collection, addDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Select Elements
const logoutBtn = document.getElementById("logoutBtn");
const addIncomeBtn = document.getElementById("addIncomeBtn");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");
const transactionTable = document.getElementById("transactionTable");

// Check if User is Logged In & Show Logout Button
onAuthStateChanged(auth, (user) => {
    if (user) {
        logoutBtn.style.display = "block"; // Show Logout Button
        fetchTransactions(user.uid); // Fetch user-specific transactions
    } else {
        logoutBtn.style.display = "none"; // Hide Logout Button
        window.location.href = "signin.html"; // Redirect to Sign In
    }
});

// Logout Functionality
logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("Logged Out Successfully!");
            window.location.href = "signin.html"; // Redirect to Sign In
        })
        .catch(error => alert(error.message));
});

// Fetch Transactions & Update UI with Filtering
function fetchTransactions(userId) {
    const transactionsRef = collection(db, "transactions");
    const userTransactionsQuery = query(transactionsRef, where("userId", "==", userId));

    onSnapshot(userTransactionsQuery, (snapshot) => {
        let transactions = [];
        snapshot.forEach((doc) => transactions.push(doc.data()));

        updateTransactionTable(transactions); // Call function to display transactions
    });
}

// Function to Update Table Based on Selected Filter
function updateTransactionTable(transactions) {
    const filterType = document.getElementById("filterType").value; // Get selected filter
    let balance = 0, income = 0, expenses = 0;
    transactionTable.innerHTML = "";

    transactions.forEach(transaction => {
        if (filterType === "All" || transaction.type === filterType) { 
            let row = `
                <tr>
                    <td>${transaction.name}</td>
                    <td>$${transaction.amount}</td>
                    <td>${transaction.type}</td>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                </tr>
            `;
            transactionTable.innerHTML += row;
        }

        if (transaction.type === "Income") {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });

    balance = income - expenses;
    balanceAmount.textContent = `$${balance}`;
    incomeAmount.textContent = `$${income}`;
    expenseAmount.textContent = `$${expenses}`;
}

// Event Listener for Filter Change
document.getElementById("filterType").addEventListener("change", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) fetchTransactions(user.uid);
    });
});


// Add Transaction Function (Associating UID)
function addTransaction(type) {
    const user = auth.currentUser; // Get the current logged-in user
    if (!user) {
        alert("You must be logged in to add transactions.");
        return;
    }

    let transactionName = prompt(`Enter ${type} Name:`);
    let transactionAmount = parseFloat(prompt(`Enter ${type} Amount:`));

    if (!transactionName || isNaN(transactionAmount) || transactionAmount <= 0) {
        alert("Invalid input. Please try again.");
        return;
    }

    addDoc(collection(db, "transactions"), {
        userId: user.uid, // Store the user's UID with the transaction
        name: transactionName,
        amount: transactionAmount,
        type: type,
        date: new Date().toISOString()
    })
    .then(() => alert(`${type} Added Successfully!`))
    .catch(error => alert("Error adding transaction: " + error.message));
}

// Attach Event Listeners
addIncomeBtn.addEventListener("click", () => addTransaction("Income"));
addExpenseBtn.addEventListener("click", () => addTransaction("Expense"));

const API_KEY = "AIzaSyDyMCEs84dSfMJaUIvPiYp-1ovBivxF6n0";

document.getElementById("openChat").addEventListener("click", () => {
    document.querySelector(".chat-container").style.display = "flex";
});

document.getElementById("closeChat").addEventListener("click", () => {
    document.querySelector(".chat-container").style.display = "none";
});

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const message = inputField.value.trim();
    if (!message) return;

    appendMessage(message, "user-message");
    inputField.value = "";

    const response = await getAIResponse(message);
    appendMessage(response, "bot-message");
}

function appendMessage(text, className) {
    const chatBox = document.getElementById("chatBox");
    const messageElement = document.createElement("p");
    messageElement.className = className;
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getAIResponse(userInput) {
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=" + API_KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: { text: userInput } })
        });

        const data = await response.json();
        return data.candidates[0]?.output || "Sorry, I couldn't understand that.";
    } catch (error) {
        console.error("Error fetching response:", error);
        return "Error connecting to AI service.";
    }
}
