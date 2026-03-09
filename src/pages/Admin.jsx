import React, { useEffect, useState } from 'react';
import { Users, Server, Globe2, Loader2, Cpu } from 'lucide-react';
import api from '../api/axios';

const Admin = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-500" size={32} />
            </div>
        );
    }

    if (!stats) return <div className="text-center p-10 text-red-400">Not authorized to view admin panel.</div>;

    return (
        <div className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Infrastructure</h1>
                <p className="text-slate-400">Overview of the entire hosting network.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-brand-500">
                    <div className="p-3 bg-brand-500/20 rounded-lg text-brand-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 font-medium">Total Users</p>
                        <h3 className="text-2xl font-bold text-white">{stats.users}</h3>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-purple-500">
                    <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                        <Globe2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 font-medium">Total Deployments</p>
                        <h3 className="text-2xl font-bold text-white">{stats.deployments}</h3>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-green-500">
                    <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                        <Server size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 font-medium">Active Containers</p>
                        <h3 className="text-2xl font-bold text-white">{stats.activeDeployments}</h3>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-amber-500">
                    <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 font-medium">VM Nodes</p>
                        <h3 className="text-2xl font-bold text-white">{stats.servers}</h3>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 text-center text-slate-400">
                <p>Advanced metrics and log visualization coming soon.</p>
            </div>
        </div>
    );
};

export default Admin;
