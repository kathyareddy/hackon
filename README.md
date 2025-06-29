README: AI-Powered Interview Mentor

Overview:  
An AI-enhanced, full-stack web application built to help students prepare for interviews through personalized aptitude quizzes, coding support, and performance dashboards. This platform uses Generative AI to simulate mentorship and guides learners in understanding complex aptitude and coding concepts.

How to use:
- Login/signup (use any email account and password to sign up)
- Take aptitude quiz in aptitude section
- Check dashboard for scores and progress reports (Quiz scores are stored in Firebase Firestore)
- Go to AI Mentor section for queries regarding Coding or Aptitude
  


Features:  
Firebase Authentication (Sign Up, Login, Logout)  
Aptitude Quiz with scoring and result tracking  
AI Mentor (Powered by Groq API using LLaMA3) to explain coding and aptitude doubts  
Dashboard with visual performance trends using Recharts  
Responsive and mobile-friendly UI  
Data stored and retrieved securely from Firestore  

  
Tech Stack  
Frontend:  
Next.js – React-based framework for server-side rendering and routing  
Tailwind CSS – Utility-first CSS framework for responsive UI design  
Authentication:  
Firebase Authentication – For user sign-up, login, and session management  
Backend and Database:  
Firebase Firestore – Cloud-hosted NoSQL database for storing quiz scores and user data  
AI Integration:  
Groq API (LLaMA3) – Used to generate AI mentor responses for aptitude and coding questions  
Charting:  
Recharts – For visualizing quiz score trends in the dashboard  
Deployment:  
Vercel – Hosting and continuous deployment of the application  


Project Structure  
app/  
aptitude/ – Aptitude quiz page  
mentor/ – AI Mentor page  
dashboard/ – Dashboard with score history  
login/ – Login page  
signup/ – Sign-up page  
page.js – Homepage with feature navigation  
components/  
Navbar.js – Navigation bar  
lib/  
firebase.js – Firebase setup  
groq.js – Groq API integration  
public/  
styles/  
README.md – Project documentation  


Setup Instructions:    
Clone the repository  
git clone https://github.com/your-username/your-repo-name.git  
cd your-repo-name   
Install dependencies  
npm install  
Add environment variables Create a .env.local file in the root directory:  
GROQ_API_KEY=your_groq_key_here  
Run the development server  
npm run dev  


  
Deployment  
The app is deployed using Vercel:  
Push the code to GitHub  
Connect your GitHub repo to Vercel  
Add your environment variable (GROQ_API_KEY) in Vercel's settings  
Deploy  

  
Future Enhancements:    
Resume scanner and evaluator using AI  
Leaderboards and peer comparison  
Integration of mock interview simulations  
Weekly/monthly performance reports  
Admin dashboard for teachers/mentors  
Audio-based Q&A for accessibility  


Contributors  
Kathya Reddy
