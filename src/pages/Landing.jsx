import React from 'react';
import { Rocket, Github, Zap, Shield } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-20 animate-fade-in relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl w-full text-center z-10">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    Ship your code <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">instantly</span>.
                </h1>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                    The MiniRender platform is a modern, fast, and scalable application hosting solution. Connect your GitHub, select a repository, and deploy in seconds.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <a
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`}
                        className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-medium transition-all-fast text-lg shadow-xl shadow-brand-500/20"
                    >
                        <Github size={24} />
                        Continue with GitHub
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="glass-panel p-6 hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="w-12 h-12 bg-brand-500/20 rounded-lg flex items-center justify-center mb-4 text-brand-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">Zero Config</h3>
                        <p className="text-slate-400 leading-relaxed">Automatic language detection and Dockerfile generation. Just push your code and we handle the rest.</p>
                    </div>
                    <div className="glass-panel p-6 hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                            <Rocket size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">Global Edge Network</h3>
                        <p className="text-slate-400 leading-relaxed">Deployed on high performance VM infrastructure with automatic sub-domain routing configuration.</p>
                    </div>
                    <div className="glass-panel p-6 hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 text-green-400">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">Secure Isolation</h3>
                        <p className="text-slate-400 leading-relaxed">Each application runs in a secure, isolated Docker container with strict runtime resource bounds.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
