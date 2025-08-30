# Daily School Email Digest with Gemini

A Google Apps Script tool that automatically summarizes the million emails that your kid's school sends every day using the Gemini API and compiles them into a single digest, keeping your inbox clean.

## Features

- **Automated Summaries:** Uses the Google Gemini API to intelligently summarize email content.
- **Inbox Cleanup:** Automatically archives school emails, removing clutter from your inbox.
- **Daily Digest:** Sends a single, compiled email with all the summaries.
- **Customizable:** Easily configurable with your own school email addresses.

---

## Setup Instructions

This tool requires two main components: a **Gmail filter** and a **Google Apps Script**.

### Part 1: Set Up the Gmail Filter

The filter will automatically apply a label and archive emails from specific senders.

1.  Open Gmail and click the "Show search options" icon (the sliders) in the search bar.
2.  In the "From" field, enter your school email addresses using the `OR` operator, for example:
    `from:(kidschool1.com) OR from:(@kidschool2.org)`
3.  Click "Create filter" at the bottom right.
4.  In the next window, check these two boxes:
    - `[ ] Skip the Inbox (Archive it)`
    - `[ ] Apply the label:` and then choose `New label...` and name it `School Digest`.
5.  Click "Create filter" to save.

### Part 2: Set Up the Google Apps Script

This script will read the labeled emails, summarize them with Gemini, and send you the digest.

1.  **Get a Gemini API Key:** Go to [Google AI Studio](https://aistudio.google.com/) and create a new API key. **Copy this key immediately.**
2.  **Create a New Apps Script Project:** Go to [Google Apps Script](https://script.google.com/) and click "New project."
3.  **Add the API Key:**
    - On the left, go to **Project Settings** (the gear icon).
    - Scroll down to "Script properties" and click "Add script property."
    - For the "Property," enter `GEMINI_API_KEY`.
    - For the "Value," paste your API key. Click "Save."
4.  **Copy the Code:** Go back to the code editor (`Code.gs`) and paste the entire script from this repository into the editor, replacing any existing code.
5.  **Set Up the Trigger:**
    - On the left, click the **Triggers** icon (the clock).
    - Click "Add Trigger."
    - Set the function to run to `createDailyGeminiDigest`.
    - Set the time-based trigger to "Day timer" and choose a time that works for you.
6.  Click "Save." The first time you do this, you will be prompted to authorize the script. Follow the steps to grant it the necessary permissions.

Each day, at the time you have chosen in your script trigger, you will get a single, concise digest email summarizing all of the school communications from the day. And if you want, you can go read the full emails by searching for the "School Digest" label.

## Security and Disclaimer

This script requires access to your Gmail account to read, send, and archive emails. Please review the code to ensure you are comfortable with the permissions you are granting. Your Gemini API key is a personal credential; please do not share it.

---

## License

This project is licensed under the MIT License.
