# Cornell Fintech Club AI Earnings Call Tool

## Introduction
Welcome to the Cornell Fintech Club AI Earnings Call Tool! This tool is built using React typescript for our frontend and Flask to maintain our backend.

## Getting Started
To get started with this project, follow these steps:

1. **Clone the Repository:** Start by cloning this repository to your local machine using Git.
```
git clone <repository-url>
```
2. Navigate to the Project Directory: Change your current directory to the project folder.
```
cd AI-Earnings-Call
```
3. Activating the React frontend.
```
npm start
```
4. Activating the Flask backend (in a separate terminal).
```
cd backend
python3 server.py
```

## Project Structure
The project is structured as follows:

- `src/`: This directory contains the frontend code for the application.
- `backend/`: This directory contains the backend code for the application.

## Features

### 1. Real-time Stock Price Data
- Matches user-inputted stock ticker with current price movements and general industry information.

### 2. Audio Transcription
- Following a successful stock input and mp3 upload, the transcribe button will analyze and output the audio's transcript.

### 3. User Login
- Welcome Screen greets user with a username and password input to be authenticated, access features, and store prior transcriptions.

### 4. AI Summarization
- Summarizes the primary takeaways from the transcript in the context of the provided stock.

## Contributors
- TPM/PMs: Jun, Maggie, Sydney, Jake
- BAs: Mohammed
- SWEs: Amelia, Salena, Danna, Andrew, Ethan, Aliou


Thank you for using the Cornell Fintech Club AI Earnings Call Summarizer Tool!
