import { Github, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-glow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xl font-bold text-text-primary tracking-tighter">
                Token<span className="text-accent">Flow</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              The next generation of token management. Secure, transparent, and built for the future of finance.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-text-primary font-semibold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/dashboard" className="text-text-secondary hover:text-accent text-sm transition-colors">Dashboard</Link></li>
              <li><Link to="/staking" className="text-text-secondary hover:text-accent text-sm transition-colors">Staking</Link></li>
              <li><Link to="/vesting" className="text-text-secondary hover:text-accent text-sm transition-colors">Vesting</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-text-primary font-semibold mb-6">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com/Martinagracy28" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-elevated/50 border border-border/40 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-elevated hover:border-accent/40 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:martiofficial28@gmail.com" 
                className="w-10 h-10 rounded-xl bg-elevated/50 border border-border/40 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-elevated hover:border-accent/40 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-text-muted text-xs">
            © 2026 TokenFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            Made with <Heart className="w-3 h-3 text-danger fill-danger" /> by 
            <a 
              href="https://github.com/Martinagracy28" 
              className="text-text-primary font-medium hover:text-accent transition-colors ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martinagracy28
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
