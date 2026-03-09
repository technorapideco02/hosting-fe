import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, LogOut, Settings } from 'lucide-react';

const Navbar = ({ token, setToken }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/');
    };

    return (
        <nav className="fixed top-0 w-full glass z-50 h-16 flex items-center px-6 justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-brand-500 transition-colors">
                <Cloud className="text-brand-500" />
                <span>MiniRender</span>
            </Link>

            <div className="flex items-center gap-4">
                {token ? (
                    <>
                        <Link to="/dashboard" className="text-sm font-medium hover:text-white transition-colors text-slate-300">
                            Dashboard
                        </Link>
                        <Link to="/repositories" className="text-sm font-medium hover:text-white transition-colors text-slate-300">
                            Deploy
                        </Link>
                        <button onClick={handleLogout} className="p-2 hover:bg-dark-700 rounded-full transition-colors text-slate-300 hover:text-red-400">
                            <LogOut size={18} />
                        </button>
                    </>
                ) : (
                    <a
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`}
                        className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-lg shadow-brand-500/20"
                    >
                        Login with GitHub
                    </a>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
