# FunnyChess ♟️😂

> **“Chess is not hard. You just haven’t learned it the fun way yet.”**

FunnyChess is a modern, interactive, and humorous chess learning & playing web platform. Built to make chess accessible, engaging, and delightfully fun for players of all skill levels — from complete novices to seasoned tacticians.

---

## 🌟 Key Features

### 🎓 Interactive Lessons & Quizzes
- **Structured Learning Paths**: Learn piece movements, opening principles, basic tactics, and endgame mastery.
- **Interactive Board Exercises**: Solve board challenges directly with instant feedback and visual cues.
- **Knowledge Checks**: Fun, low-stress quizzes at the end of every module to reinforce concepts.

### 🤖 Play with AI & Hilarious Commentary
- **Dynamic Difficulty Levels**: Tailored AI engine settings (Novice, Casual, Serious).
- **Funny Trash Talk & Commentary**: Real-time quips and commentary on brilliant moves, blunders, and funny positions.
- **Multi-Language Speech Synthesis**: Browser-powered voice commentary supporting **English**, **Hindi (हिंदी)**, and **Bengali (বাংলা)**.

### 👥 Real-Time Multiplayer ("Play with Friend")
- **Instant Invite Links**: Generate and share unique game invite URLs with a single click.
- **Real-Time Synchronization**: Instant state synchronization via Supabase Realtime channels with local tab fallbacks.
- **Reconnection Handling**: Smooth reconnection logic preserving current board state and turn history.

### ⚡ HACK Mode (Position & Threat Analysis)
- **Deep Evaluation**: Instant engine evaluation of the current board state.
- **Visual Tactics & Arrows**: On-board visual arrows illustrating the best move, alternative lines, and immediate opponent threats.
- **Educational Explanations**: Plain-language breakdowns explaining *why* a move is strong or dangerous.

### 🏆 Player Profile & Gamification
- **XP & Levels**: Earn experience points by completing lessons, winning games, and playing regularly.
- **Unlockable Achievements**: Badges celebrating streaks, tactical masterstrokes, and comical milestones.
- **Game History & Analytics**: Review past matches, win/loss stats, and progress over time.

### 🌐 Internationalization (i18n)
- Seamless switching between **English**, **Hindi (हिंदी)**, and **Bengali (বাংলা)** across all pages and AI audio commentary.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Chess Engine & Logic**: [chess.js](https://github.com/jhlywa/chess.js), custom heuristic & evaluation engine
- **Styling**: Vanilla CSS Modules & Modern CSS design tokens (responsive, dark mode)
- **Icons & Effects**: [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Backend & Database**: [Supabase](https://supabase.com/) (Auth, PostgreSQL Database, Realtime subscriptions)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18.17+ or 20+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/funnychess.git
cd funnychess
npm install
```

### 3. Environment Variables (Optional)
FunnyChess is built **Free-Tier First**. If no environment variables are provided, the application automatically runs in a zero-friction **Guest / Local Demo Mode** without requiring database setup.

To enable Supabase cloud authentication, multiplayer persistence, and profile sync:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Populate your Supabase project keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Run the SQL migration located in `supabase/schema.sql` inside your Supabase SQL Editor.

### 4. Development Server
Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start playing!

### 5. Production Build
Create an optimized production bundle:

```bash
npm run build
npm run start
```

---

## 🔒 Security & Privacy

- Client-side public keys (`NEXT_PUBLIC_SUPABASE_*`) are strictly scoped via Supabase Row-Level Security (RLS).
- Zero secret keys, service-role keys, or sensitive credentials are committed to source control.
- All `.env*.local` files are ignored by default.

---

## 👤 Author & Credits

- **Founder & Developer**: Somnath Sen
- **Project**: FunnyChess ♟️😂
