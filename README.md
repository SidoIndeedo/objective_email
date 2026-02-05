# Objective Email

Objective Email is an AI-powered email management tool that helps users quickly understand and organize their inbox. With the exponential growth of email communication, it’s easy to miss important messages or spend hours reading irrelevant emails. Objective Email solves this problem by fetching your emails, generating concise AI summaries, tagging content, and highlighting important messages—helping you save time and focus on what matters.

## Features

- **Gmail Integration**: Connect your Gmail account securely and fetch emails directly.
- **AI Summarization**: Uses fine-tuned LLMs (via Cerebras API) to summarize emails
- **Email Tagging**: Automatically generates tags for each email.
- **HTML Rendering**: Emails are rendered in their original HTML format for better readability.
- **Search & Filter**: Search emails by sender, subject, or content.
- **Pagination & Auto Refresh**: Handles large inboxes efficiently.

## Technologies Used

- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **Frontend**: React, TypeScript, Tailwind CSS
- **APIs**: Google Gmail API for fetching emails, Cerebras API for AI summarization
- **Containerization**: Docker for easy deployment

## How It Works

1. User connects Gmail account using OAuth2.
2. Backend fetches emails using Gmail API.
3. Emails are stored in MongoDB with metadata like sender, subject, body, and received date.
4. AI summarization generates concise summaries and tags using fine-tuned LLMs via Cerebras API.
5. Frontend displays emails in a searchable and paginated list.
6. Clicking an email opens a modal with the full HTML content and AI-generated summary.

## Context
Built during a national-level hackathon under severe time constraints. Shortlisted among top projects.

## Demo
[![Hackathon Project (re uploaded)](https://img.youtube.com/vi/r_pA0Ulpsm8/0.jpg)](https://www.youtube.com/watch?v=r_pA0Ulpsm8)

