// This function runs daily to create a summary of school emails.
function createDailyGeminiDigest() {
  const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
  const GEMINI_API_KEY = SCRIPT_PROPERTIES.getProperty('GEMINI_API_KEY');

  if (!GEMINI_API_KEY) {
    Logger.log('API key not found. Please add it to script properties.');
    return;
  }

  const labelName = 'School Digest';
  const label = GmailApp.getUserLabelByName(labelName);

  if (!label) {
    Logger.log('Label "' + labelName + '" not found. Please create it in Gmail.');
    return;
  }

  const threads = label.getThreads();
  if (threads.length === 0) {
    Logger.log('No new school emails found. Exiting script.');
    return;
  }

  let digestBody = '<h1>Daily School Email Digest</h1>';
  let emailCount = 0;

  for (const thread of threads) {
    const messages = thread.getMessages();
    // This is a new variable to store the link.
    const threadUrl = thread.getPermalink(); 

    for (const message of messages) {
      if (message.isUnread()) {
        const emailBody = message.getPlainBody();
        const emailSubject = message.getSubject();
        const sender = message.getFrom();

        try {
          const prompt = `Summarize the following school-related email. Extract and highlight any key dates, deadlines, or action items (e.g., "Reply by Dec 1st", "Bring supplies on Monday"). If no specific actions are needed, simply provide a concise summary.
          
          Email Subject: ${emailSubject}
          
          Email Body: ${emailBody}`;

          const summary = getGeminiSummary(prompt, GEMINI_API_KEY);
          
          digestBody += `<hr><h2>${emailSubject}</h2>`;
          digestBody += `<p><strong>From:</strong> ${sender}</p>`;
          digestBody += `<p><strong>Date:</strong> ${message.getDate()}</p>`;
          digestBody += `<p>${summary}</p>`;
          // New line added to embed the URL as a link
          digestBody += `<p><a href="${threadUrl}" target="_blank">View Original Email</a></p>`;

          emailCount++;
          message.markRead();
        } catch (e) {
          Logger.log('Failed to get summary for email: ' + emailSubject + '. Error: ' + e.message);
          const snippet = emailBody.substring(0, 200) + '...';
          digestBody += `<hr><h2>${emailSubject}</h2>`;
          digestBody += `<p><strong>From:</strong> ${sender}</p>`;
          digestBody += `<p><strong>Date:</strong> ${message.getDate()}</p>`;
          digestBody += `<p><i>(Error summarizing, here is a snippet)</i>: ${snippet}</p>`;
          digestBody += `<p><a href="${threadUrl}" target="_blank">View Original Email</a></p>`;
          message.markRead();
        }
      }
    }
    thread.moveToArchive();
  }

  if (emailCount > 0) {
    const subjectLine = 'Daily School Email Digest - ' + new Date().toLocaleDateString();
    GmailApp.sendEmail(Session.getActiveUser().getEmail(), subjectLine, '', {
      htmlBody: digestBody
    });
    Logger.log('Successfully sent daily digest with ' + emailCount + ' emails.');
  }
}

// Helper function to call the Gemini API.
function getGeminiSummary(prompt, apiKey) {
  const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(API_ENDPOINT, options);
  const data = JSON.parse(response.getContentText());

  if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text;
  } else {
    Logger.log('Gemini API Error Response: ' + JSON.stringify(data));
    throw new Error('Could not retrieve a valid summary from the Gemini API.');
  }
}
