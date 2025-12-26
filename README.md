# PopperBryn Analytics 🎙️📈

PopperBryn Analytics is a premium observability dashboard designed for AI voice agents. It provides high-fidelity insights into call volumes, system reliability, and user interaction paths with a sleek, modern interface.

> [!NOTE]
> This project is a **highly inspired recreation** of the [SuperBryn](https://superbryn.com) aesthetic, featuring dark mode, glassmorphism, and vibrant gradients.

## ✨ Key Features

- **Interactive Analytics**: Real-time modification and simulation of daily call volumes.
- **Deep Observability**:
  - **Daily Call Volume**: Editable bar charts with immediate visual feedback.
  - **System Reliability**: Accuracy and latency tracking via ComposedCharts.
  - **Call Duration Analysis**: Distribution graphs for session length.
  - **Sad Path Analysis**: Multi-level donut charts identifying failure points.
- **Data Persistence**: Email-gated saving functionality powered by Supabase.
- **Mobile Responsive**: Fully optimized for all screen sizes.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4 (with @theme configuration)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend & Auth**: Supabase

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A Supabase project (optional for local testing)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/vishaluj1203/popperbryn-analytics.git
   cd popperbryn-analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## ☁️ Supabase Configuration

To enable data persistence, create a table named `user_analytics` in your Supabase database:

```sql
create table public.user_analytics (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  chart_data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and add policies as needed for your security requirements
```

## 🎨 Acknowledgements

Inspired by the exceptional design language of [SuperBryn](https://superbryn.com). This project aims to replicate the "wow" factor of high-end AI platforms while providing functional analytics tools.

---
Built with ❤️ by [Vishal](https://github.com/vishaluj1203)
