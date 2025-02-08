# Budget Tracker

## Overview

The Budget Tracker is a simple web application that allows users to track their expenses in multiple currencies, convert totals between currencies, and gain AI-generated insights on spending behavior.

## Features

- Add expenses with amount, currency, and category.
- Automatically convert expenses to EUR for unified tracking.
- View total spent in EUR and convert it to other currencies.
- Persist expense data using local storage.
- Delete expenses when needed.
- AI-generated spending insights based on current and previous spending trends.

## Technologies Used

- HTML, CSS, JavaScript
- Local Storage for saving expenses
- Frankfurter API for currency conversion
- OpenAI API (GPT-3.5) for spending insights

## Installation

1. Clone the repository or download the files.
2. Open `index.html` in a web browser.

## Usage

1. Enter an expense amount, select a currency, and specify a category.
2. Click `Add Expense` to save the expense.
3. View total spent and convert between different currencies.
4. Click `Convert Total` to change the displayed currency.
5. Click `Delete` next to an expense to remove it from history.
6. AI-generated insights are displayed when new expenses are added.

## API Configuration

To enable AI insights, replace `YOUR_API_KEY` in `script.js` with your actual OpenAI API key.

## API Details

### Frankfurter API

The Frankfurter API is used for real-time currency conversion. It fetches the latest exchange rates and converts the expense amount to EUR.

- Endpoint: `https://api.frankfurter.app/latest?amount={amount}&from={from_currency}&to={to_currency}`
- Example: `https://api.frankfurter.app/latest?amount=100&from=USD&to=EUR`

### OpenAI API

The OpenAI API is utilized to generate spending insights based on the user's expense data.

- Endpoint: `https://api.openai.com/v1/chat/completions`
- Request Method: `POST`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_API_KEY`
- Example Request Body:
  ```json
  {
    "model": "gpt-3.5-turbo",
    "messages": [{ "role": "user", "content": "You spent a total of 500 this month. Last month, you spent 300. Provide insights on this spending behavior." }]
  }
  ```
- Response: AI-generated insights based on current and previous spending trends.

## Future Improvements

- User authentication for personal expense tracking.
- Advanced analytics and data visualization.
- More AI-driven insights and recommendations.

