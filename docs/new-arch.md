You are an expert Full-Stack Next.js Developer, UI/UX Designer, and AI Engineer. Your task is to build the MVP (Minimum Viable Product) of a web application called "NihongoWork AI".
App Concept: A text-based Japanese Business Scenario Simulator for Indian IT professionals. Users select a workplace scenario, roleplay in Japanese text with an AI, and receive a performance report.
Tech Stack Constraints:
Frontend: Next.js (App Router), React, Tailwind CSS. (Keep UI minimalist, similar to ChatGPT).
Backend: Next.js API Routes.
Database & Auth: Supabase (or Firebase) for Google Auth and storing chat logs.
AI Integration: Google Gemini API (or OpenAI API).
Strict Rules: NO audio features. NO flashcards. NO native mobile app code. Web only. Mobile-responsive design is mandatory.
Step 1: Database & Authentication Schema
Generate the code to set up Google OAuth authentication.
Create the following simple database schema models:
Users: id, email, name, jlpt_level (string), job_role (string), subscription_status (boolean).
Sessions: id, user_id, scenario_title, chat_history (JSON array), feedback_report (JSON), created_at.
Step 2: Core Pages & UI Components to Build
Please generate the frontend components and routing for the following 3 screens:
Screen 1: Landing & Auth Page
Hero section: "Master Japanese IT Interviews & Office Chat with AI."
Button: "Sign in with Google to Start 7-Day Trial."
Once authenticated, redirect to Dashboard.
Screen 2: Dashboard (Scenario Selection)
Display user profile (Name, JLPT Level).
Display a grid of 3 clickable Scenario Cards:
"IT Job Interview (Self Introduction)"
"Reporting a Server Bug to your Manager"
"Casual Office Lunch Chat"
Clicking a card routes the user to the Chat Interface and passes the scenario context.
Screen 3: The AI Chat Interface (The Core Engine)
Top Bar: Scenario title and an "End Session & Get Feedback" button.
Middle: Chat history window (Scrollable). User messages on the right (blue), AI messages on the left (gray).
Bottom: Input field for Japanese text and a submit button.
Functionality: When the user sends a message, make an API call to the backend route which communicates with the Gemini API to fetch the AI's response in Japanese.
Step 3: Backend API Routes & LLM Prompting
Generate two Next.js API routes:
/api/chat:
Takes the scenario context and user_message.
System Prompt for LLM: "You are a Japanese IT manager. The user is an Indian software engineer practicing Japanese. The current scenario is [Scenario Name]. Respond in natural Japanese appropriate for a business setting. Limit your response to 2-3 sentences. Do not use English."
Returns the AI's Japanese text response.
/api/feedback:
Triggered when the user clicks "End Session".
Sends the entire chat history to the LLM.
System Prompt for LLM: "Analyze this Japanese chat history between a user and an AI. Provide a JSON response with exactly three keys: 1) 'score' (out of 10 for grammar/politeness), 2) 'corrections' (an array of 2-3 specific mistakes the user made and how to fix them), 3) 'summary' (a brief encouraging sentence in English)."
Return the JSON to the frontend to display the final SWOT/Feedback Modal.
Execution Command:
Begin by initializing the Next.js project structure, configuring Tailwind, and building the Landing Page and Dashboard UI first. Wait for my confirmation before building the API routes.
