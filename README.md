# XiaoQiao – Online Mandarin Learning AI Tutor

## Project Overview
XiaoQiao is an innovative AI-powered platform designed to provide personalized Mandarin learning experiences through interactive features such as flashcards, role-play exercises, dashboard analytics, and tailored feedback using real-time tone analysis.

---

## Project Structure

```
HelloGuru17
│
├── main
│   ├── components.json
│   ├── lib
│   ├── database.js
│   └── utils.js
├── src
│   ├── app
│   │   ├── api
│   │   ├── components
│   │   ├── dashboard
│   │   ├── flashcards
│   │   ├── freeform
│   │   ├── login
│   │   ├── roleplay
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   └── tone_analysis
│
├── python-backend
│   ├── server.py
│   ├── hsk-vocabulary.csv
│   └── test.ipynb

## Installation
### Frontend Setup
Navigate to the `main` directory and install dependencies:
```bash
cd main
npm install
```

### Backend Setup
Navigate to the `python-backend` directory and ensure Python requirements are installed:
```bash
cd python-backend
pip install -r requirements.txt
```

### Environment Variables
Create `.env.local` in the `main` directory and populate it:
```
MONGODB_URI=mongodb+srv://<Username>:<Password>@helloguru.c0yty.mongodb.net/HelloGuru?retryWrites=true&w=majority&appName=HelloGuru
```

In the `python-backend`, ensure Python dependencies are installed and the environment is correctly set up:
```bash
pip install -r requirements.txt
```

## Running the Application
### Frontend
Launch the Next.js development server:
```bash
npm run dev
```
Access via: [http://localhost:3000](http://localhost:3000)

### Backend Server
Run the Python server from the `python-backend` directory:
```bash
python server.py
```

## Features
- **Interactive Flashcards:** Improve vocabulary retention with dynamically generated flashcards based on HSK levels.
- **Roleplay Scenarios:** Engage in realistic conversations with AI to practice conversational Mandarin.
- **Dashboard:** Track learning progress, performance metrics, and detailed insights.
- **Tone Analysis:** AI-driven feedback on pronunciation and tonal accuracy.

## Development Structure
### Frontend
- **Framework:** Next.js
- **Styling:** CSS Modules, global styles (`globals.css`), and modular components

### Backend
- **Python Flask API (`server.py`)**: Manages data retrieval, vocabulary management, and user interaction analytics.
- **HSK Vocabulary Dataset (`hsk-vocabulary.csv`)**: Source for vocabulary flashcards and training modules.

## Contribution Guidelines
- Fork the repository and create a new branch for your feature (`feature/your-feature-name`).
- Write clear, maintainable code with descriptive comments.
- Create pull requests clearly describing your changes.

## Testing
- Run backend tests using `test.ipynb` for quick validation and debugging.
- Implement unit tests for all new features on both frontend and backend.

## Deployment
Prepare environment variables in the hosting platform and use Vercel or a similar service for frontend deployment. Backend services can be hosted via cloud services like Heroku or AWS Elastic Beanstalk.

---

For issues or feature requests, please open an issue in this repository.

Happy coding!

