import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Server, CheckCircle, Clock, XCircle, ArrowRight, Github } from 'lucide-react';
import api from '../api/axios';
import { formatDistanceToNow } from 'date-fns';

const StatusBadge = ({ status }) => {
    const styles = {
        Running: 'bg-green-500/10 text-green-400 border border-green-500/20',
        Building: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
        Stopped: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
        Failed: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };

    const icons = {
        Running: <CheckCircle size={14} />,
        Building: <Clock size={14} className="animate-pulse" />,
        Stopped: <Server size={14} />,
        Failed: <XCircle size={14} />,
    };

    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || styles.Stopped}`}>
            {icons[status] || icons.Stopped}
            {status}
        </span>
    );
};

const Dashboard = () => {
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDeployments = async () => {
        try {
            const { data } = await api.get('/deployments');
            setDeployments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeployments();
        const interval = setInterval(fetchDeployments, 10000); // refresh every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Deployments</h1>
                    <p className="text-slate-400">Manage your applications and services.</p>
                </div>
                <Link
                    to="/repositories"
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer"
                >
                    <Plus size={18} />
                    New Deployment
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="glass-panel h-48 animate-pulse" />)}
                </div>
            ) : deployments.length === 0 ? (
                <div className="glass-panel p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-dark-700/50 rounded-full flex items-center justify-center mb-4">
                        <Server className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Deployments Yet</h3>
                    <p className="text-slate-400 mb-6 max-w-md">Connect a repository to start deploying your applications to our global edge network instantly.</p>
                    <Link to="/repositories" className="text-brand-400 hover:text-brand-300 font-medium cursor-pointer">
                        Deploy your first app &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deployments.map((dep) => (
                        <Link key={dep._id} to={`/deployments/${dep._id}`} className="group drop-shadow-md hover:drop-shadow-xl transition-all cursor-pointer">
                            <div className="glass-panel p-6 h-full flex flex-col hover:border-brand-500/50 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Github className="text-slate-400" size={24} />
                                        <div>
                                            <h3 className="font-semibold text-lg text-white group-hover:text-brand-400 transition-colors truncate max-w-[150px]">{dep.repoName}</h3>
                                            <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(dep.createdAt))} ago</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={dep.status} />
                                </div>

                                <div className="mt-auto pt-4 border-t border-dark-700/50">
                                    <a href={`http://${dep.domain}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-sm text-slate-400 hover:text-brand-400 flex items-center gap-1.5 truncate">
                                        {dep.domain}
                                        <ArrowRight size={14} opacity={0.5} />
                                    </a>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
