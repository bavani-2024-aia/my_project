import { Shield, Bell, User, Radio } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight">CRIMESPOT AI</span>
            <span className="text-xs text-muted-foreground -mt-1">Predictive Policing System</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">SYSTEM ONLINE</span>
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'short', 
              day: '2-digit', 
              month: 'short',
              year: 'numeric'
            })}
            <span className="mx-2 text-border">|</span>
            {new Date().toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden sm:block text-sm font-medium">Officer</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
