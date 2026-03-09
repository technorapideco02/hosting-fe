import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const LoginCallback = ({ setToken }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            setToken(token);
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    }, [searchParams, navigate, setToken]);

    return (
        <div className="flex-grow flex items-center justify-center animate-fade-in">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-slate-400 font-medium tracking-wide">Authenticating with GitHub...</p>
            </div>
        </div>
    );
};

export default LoginCallback;
