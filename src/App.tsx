import Dashboard from './Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[0%] w-[30%] h-[30%] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-black shadow-lg shadow-primary/20">
              P
            </div>
            <span className="font-bold text-xl tracking-tight">PopperBryn <span className="text-slate-500 font-medium">Analytics</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-primary transition-colors">Evals</a>
            <a href="#" className="hover:text-primary transition-colors text-primary">Observability</a>
            <a href="#" className="hover:text-primary transition-colors">Compliance</a>
            <a href="#" className="hover:text-primary transition-colors">Self-Learning</a>
          </div>
          <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold border border-white/10 transition-all">
            Documentation
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <Dashboard />
      </main>

      <footer className="mt-20 border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PopperBryn AI Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
