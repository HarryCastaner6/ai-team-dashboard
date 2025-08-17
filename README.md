# AI Team Dashboard

A comprehensive AI-powered team management dashboard with task tracking, AI chat integration, and advanced analytics.

## Features

- **Authentication System**: Secure login/registration with admin and user roles
- **Kanban Boards**: Create and manage multiple boards with drag-and-drop functionality
- **AI Chat Integration**: Chat with ChatGPT and Gemini AI models
- **Team Management**: View team members with performance ratings and skills
- **Analytics Dashboard**: Interactive charts and graphs for team performance
- **AI Project Breakdown**: Automatically analyze and break down projects into tasks
- **Real-time Collaboration**: Multiple users can work on the same boards

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API, Google Gemini API
- **Charts**: Chart.js, React Chart.js 2
- **Drag & Drop**: @dnd-kit
- **State Management**: Zustand
- **UI Components**: Lucide React icons

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   cd ai-team-dashboard
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_dashboard?schema=public"
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   OPENAI_API_KEY=your-openai-api-key
   GEMINI_API_KEY=your-gemini-api-key
   JWT_SECRET=your-jwt-secret-here
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Credentials

For testing, you can register a new account with any email and password. The first user can be set as admin.

## Project Structure

```
ai-team-dashboard/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── page.tsx         # Landing page
├── components/          # React components
├── lib/                 # Utility functions
├── prisma/             # Database schema
└── public/             # Static files
```

## Features Breakdown

### 1. Authentication
- Secure user registration and login
- Role-based access control (Admin/User)
- Session management with JWT

### 2. Kanban Boards
- Create multiple boards
- Drag and drop tasks between columns
- Add/edit/delete tasks
- User-specific board access

### 3. AI Chat
- Switch between ChatGPT and Gemini models
- Maintain conversation history
- Real-time responses

### 4. Team Dashboard
- View team members with overall ratings (NBA 2K style)
- Skills visualization
- Department and position tracking
- Performance statistics

### 5. Analytics
- Weekly progress charts
- Task distribution pie charts
- Department performance bar charts
- Team productivity metrics

### 6. AI Project Breakdown
- Input project descriptions
- Get AI-generated task breakdowns
- Team allocation suggestions
- Timeline and milestone planning

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `GET/POST /api/boards` - Board management
- `POST /api/chat` - AI chat functionality
- `GET /api/team` - Team member data
- `POST /api/projects/analyze` - AI project analysis

## Future Enhancements

- Real-time collaboration with WebSockets
- File attachments for tasks
- Email notifications
- Mobile app version
- Advanced reporting features
- Integration with third-party tools
- Time tracking
- Budget management

## License

MIT# Trigger deployment
