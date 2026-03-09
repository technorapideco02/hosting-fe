import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Terminal, Globe, Loader2, Trash2, Plus, X } from 'lucide-react';
import api from '../api/axios';

const DeploymentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deployment, setDeployment] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [domainLoading, setDomainLoading] = useState(false);
    const logsEndRef = useRef(null);

    useEffect(() => {
        const fetchDeployment = async () => {
            try {
                const { data } = await api.get(`/deployments/${id}`);
                setDeployment(data);
            } catch (error) {
                console.error(error);
                if (error.response?.status === 404) navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDeployment();
    }, [id, navigate]);

    useEffect(() => {
        if (!deployment) return;

        const token = localStorage.getItem('token');
        // For local dev assuming backend is on 5000:
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
        const ws = new WebSocket(`${wsUrl}?token=${token}&deploymentId=${id}`);

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'logs') {
                    setLogs(message.data || []);
                } else if (message.type === 'log') {
                    setLogs(prev => [...prev, message.data]);
                }
            } catch (e) {
                console.error('WebSocket parsing error:', e);
            }
        };

        return () => {
            ws.close();
        };
    }, [id, deployment]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this deployment? This action cannot be undone.')) return;

        setDeleting(true);
        try {
            await api.delete(`/deployments/${id}`);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to delete deployment');
            setDeleting(false);
        }
    };

    const handleAddDomain = async (e) => {
        e.preventDefault();
        if (!newDomain.trim()) return;
        setDomainLoading(true);
        try {
            const { data } = await api.post(`/deployments/${id}/custom-domain`, { customDomain: newDomain.trim() });
            setDeployment(data.deployment);
            setNewDomain('');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to add custom domain');
        } finally {
            setDomainLoading(false);
        }
    };

    const handleRemoveDomain = async (domainToRemove) => {
        if (!window.confirm(`Remove ${domainToRemove}?`)) return;
        setDomainLoading(true);
        try {
            const { data } = await api.delete(`/deployments/${id}/custom-domain`, { data: { customDomain: domainToRemove } });
            setDeployment(data.deployment);
        } catch (error) {
            console.error(error);
            alert('Failed to remove custom domain');
        } finally {
            setDomainLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-500" size={32} />
            </div>
        );
    }

    if (!deployment) return null;

    return (
        <div className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in flex flex-col h-[calc(100vh-4rem)]">
            <div className="mb-6 flex items-center justify-between shrink-0 mt-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-dark-700 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                            {deployment.repoName}
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${deployment.status === 'Running' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                deployment.status === 'Building' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                    deployment.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                }`}>
                                {deployment.status}
                            </span>
                        </h1>
                        <a href={`http://${deployment.domain}`} target="_blank" rel="noreferrer" className="text-brand-400 hover:text-brand-300 text-sm flex items-center gap-1.5 mt-1 transition-colors">
                            <Globe size={14} />
                            {deployment.domain}
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-red-500/20 cursor-pointer">
                        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Delete
                    </button>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Linked Domains</h3>
                    <div className="flex flex-col gap-3 mb-6">
                        {/* Primary Domain */}
                        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg border border-dark-600">
                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-brand-400" />
                                <a href={`https://${deployment.domain}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-200 hover:text-brand-300 transition-colors">
                                    {deployment.domain}
                                </a>
                            </div>
                            <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-1 rounded">Primary</span>
                        </div>

                        {/* Custom Domains */}
                        {deployment.customDomains && deployment.customDomains.map(d => (
                            <div key={d} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg border border-dark-600">
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-slate-400" />
                                    <a href={`http://${d}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
                                        {d}
                                    </a>
                                </div>
                                <button
                                    onClick={() => handleRemoveDomain(d)}
                                    disabled={domainLoading}
                                    className="text-slate-400 hover:text-red-400 transition-colors bg-dark-600 p-1.5 rounded-md cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddDomain} className="flex gap-2">
                        <input
                            type="text"
                            value={newDomain}
                            onChange={e => setNewDomain(e.target.value)}
                            placeholder="e.g. www.myapp.com"
                            className="flex-grow bg-dark-700/50 border border-dark-600 text-white text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 transition-colors"
                            required
                        />
                        <button
                            type="submit"
                            disabled={domainLoading || !newDomain.trim()}
                            className="bg-dark-600 hover:bg-dark-500 border border-dark-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {domainLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            Add
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 bg-dark-800/50 p-2.5 rounded border border-dark-700">
                        Please point an A record for your custom domain to this server's IP address.
                    </p>
                </div>
            </div>

            <div className="flex-grow glass-panel overflow-hidden flex flex-col mb-4">
                <div className="p-4 border-b border-dark-700 bg-dark-800 flex items-center gap-2 text-slate-400 shrink-0">
                    <Terminal size={18} />
                    <h3 className="font-semibold text-sm">Deployment & Runtime Logs</h3>
                </div>
                <div className="flex-grow bg-[#0c0c0c] p-4 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300">
                    {logs.length === 0 ? (
                        <div className="text-slate-500 italic">Waiting for logs...</div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="break-all whitespace-pre-wrap">
                                <span className="text-brand-500/50 mr-3 opacity-50 select-none">{String(index + 1).padStart(4, '0')}</span>
                                {log}
                            </div>
                        ))
                    )}
                    <div ref={logsEndRef} />
                </div>
            </div>
        </div>
    );
};

export default DeploymentDetail;
