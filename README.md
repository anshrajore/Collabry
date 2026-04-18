<div align="center">
  <h1>Collabry</h1>
  <p><strong>Where Brands & Creators Collaborate</strong></p>
  <p><em>A Project by Disha Rokade</em></p>
</div>

<br />

## 📖 Overview

**Collabry** is a modern and luxurious web platform designed for the creator economy, seamlessly connecting iconic brands with influential creators. This project serves as a sophisticated hub for discovery, partnership administration, and creative synergy.

Whether you're an upcoming influencer or an established high-end brand, Collabry facilitates a streamlined workflow to unlock mutual growth and powerful marketing campaigns.

## 🚀 Tech Stack

This project leverages a cutting-edge and highly performant technology stack:

- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router/latest)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Backend / Auth**: [Supabase](https://supabase.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (using Radix primitives)

## 📁 Project Structure

Here is a brief overview of the directory structure to help you navigate the repository:

```text
collabry/
├── src/                  # Application source code
│   ├── assets/           # Static assets like images and custom SVGs
│   ├── components/       # Reusable React components (UI components, layouts)
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # API setups and third-party tools integration
│   ├── lib/              # Utility functions, helpers, and configurations
│   ├── providers/        # Context Providers (Theme, Auth, Query, etc.)
│   ├── routes/           # Pages and routing files for TanStack Router
│   ├── styles.css        # Global CSS and Tailwind directives
│   └── router.tsx        # Router setup instructions
├── supabase/             # Supabase schema and backend logic
├── public/               # Publicly served assets
├── package.json          # Project dependencies & scripts
├── vite.config.ts        # Vite configuration rules
└── components.json       # component architecture layout mappings
```

## 💻 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/en) (v20+ recommended) and `npm` installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd collabry
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the existing `.env.example` file (if available) or update your `.env` locally with the necessary Supabase Keys. 

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application.

## 🤝 Contribution

This project is built and maintained by **Disha Rokade**. Direct collaboration rules follow standard Fork & Pull Request setups, but please reach out before committing major overarching structural changes.

---
*Building the future of brand-creator ecosystems.* 🥂
