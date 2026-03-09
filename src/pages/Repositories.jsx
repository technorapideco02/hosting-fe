import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, FolderGit2, Search, Loader2 } from 'lucide-react';
import api from '../api/axios';

const Repositories = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deployingRepoId, setDeployingRepoId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const { data } = await api.get('/github/repos');
                setRepos(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRepos();
    }, []);

    const handleDeploy = async (repo) => {
        setDeployingRepoId(repo.id);
        try {
            const { data } = await api.post('/deployments', {
                repoName: repo.name,
                repoUrl: repo.html_url
            });
            navigate(`/deployments/${data.deployment._id}`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to deploy');
        } finally {
            setDeployingRepoId(null);
        }
    };

    const filteredRepos = repos.filter(r => r.full_name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex-grow p-6 lg:p-10 max-w-5xl mx-auto w-full animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Import Git Repository</h1>
                <p className="text-slate-400">Select a repository from your GitHub account to deploy.</p>
            </div>

            <div className="glass-panel overflow-hidden flex flex-col max-h-[70vh]">
                <div className="p-4 border-b border-dark-700 bg-dark-800/80 flex items-center gap-3">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-y-auto w-full flex-grow">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-brand-500" size={32} />
                        </div>
                    ) : filteredRepos.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <FolderGit2 size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No repositories found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-dark-700">
                            {filteredRepos.map(repo => (
                                <div key={repo.id} className="p-4 hover:bg-dark-700/30 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Github className="text-slate-400" />
                                        <div>
                                            <h4 className="font-semibold text-slate-200">{repo.full_name}</h4>
                                            <div className="flex gap-2 text-xs text-slate-500 mt-1">
                                                {repo.private ? <span className="text-amber-500/80 font-medium">Private</span> : <span className="text-green-500/80 font-medium">Public</span>}
                                                <span>•</span>
                                                <span>{repo.language || 'Unknown'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDeploy(repo)}
                                        disabled={deployingRepoId === repo.id}
                                        className="bg-brand-600/20 hover:bg-brand-500 cursor-pointer text-brand-400 hover:text-white px-4 py-1.5 rounded-lg border border-brand-500/30 transition-all text-sm font-medium flex items-center gap-2"
                                    >
                                        {deployingRepoId === repo.id ? (
                                            <><Loader2 size={16} className="animate-spin" /> Deploying</>
                                        ) : 'Deploy'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Repositories;
