import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-anthropic-surface py-20 px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white border border-anthropic-border rounded-anthropic mb-8 shadow-anthropic">
            <span className="font-display text-5xl font-light text-anthropic-black">404</span>
          </div>
          <h1 className="font-display text-4xl mb-4">Page not found.</h1>
          <p className="text-lg text-anthropic-muted leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a new location.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary w-full sm:w-auto px-8">
            <Home size={18} /> Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary w-full sm:w-auto px-8 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
