# Budget Planner

Budget Planner is a web-based application designed to help users track their income and expenses. Users can add, edit, and delete transactions while monitoring their financial balance. The application integrates Firebase for authentication and data storage and features an AI chatbot for assistance.

## Features
- **User Authentication:** Secure login with Firebase authentication.
- **Dashboard Overview:** Displays current balance, total income, and total expenses.
- **Transaction Management:** Add, edit, and delete income and expense transactions.
- **Search & Filter:** Real-time search by transaction name and filtering options.
- **Responsive Design:** Optimized for desktop and mobile devices.

## Steps to Set Up

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/YourUsername/budget-planner.git
cd budget-planner
```

### 2️⃣ Install Dependencies
This project runs on HTML, CSS, and JavaScript, so no dependencies are required.

### 3️⃣ Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project.
3. Enable Firestore Database and Authentication (Google Sign-In).
4. Copy your Firebase configuration and paste it into `firebase.js`.
5. Modify Firestore database rules as needed.

### 4️⃣ Configure the AI Chatbot (Google Gemini AI)
1. Sign up for an API key from [Google Gemini AI](https://ai.google.com/gemini).
2. Add the API key inside `chatbot.js`.
3. If using Firestore, store the API key in a collection for security.

### 5️⃣ Running the App Locally
To run the app locally:
- Open `index.html` in a browser.

### 6️⃣ Deployment
The app is deployed using GitHub Pages.
- Go to your repository settings on GitHub.
- Enable GitHub Pages from the `gh-pages` branch.

## Live Site
[Budget Planner - Live](https://gaganmander01.github.io/webtrends-gk/)
