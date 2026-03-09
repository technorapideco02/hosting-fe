import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, Loader2 } from 'lucide-react';
import api from '../api/axios';

const plans = [
    { name: 'Basic', price: 59, deployments: 2, icon: <Sparkles className="text-brand-400" /> },
    { name: 'Pro', price: 99, deployments: 5, icon: <div className="text-purple-400"><Sparkles /></div> },
    { name: 'Enterprise', price: 499, deployments: 50, icon: <div className="text-amber-400"><Sparkles /></div> }
];

const Billing = () => {
    const [loading, setLoading] = useState(false);

    const loadRazorpay = async () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleUpgrade = async (plan) => {
        setLoading(plan.name);
        try {
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load');
                return;
            }

            const { data } = await api.post('/payments/create-order', {
                amount: plan.price,
                planName: plan.name
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY, // Set this in .env
                amount: data.order.amount,
                currency: "INR",
                name: "MiniRender",
                description: `Upgrade to ${plan.name} Plan`,
                order_id: data.order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payments/verify', {
                            ...response,
                            planName: plan.name
                        });
                        alert(`Successfully upgraded to ${verifyRes.data.plan}!`);
                        window.location.reload();
                    } catch (e) {
                        alert('Payment verification failed');
                    }
                },
                theme: { color: "#3b82f6" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error);
            alert('Failed to initiate payment');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex-grow p-6 lg:p-10 max-w-6xl mx-auto w-full animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-4">Upgrade your hosting</h1>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">Start for free, then scale as your application grows. Our plans have no hidden fees and include unlimited bandwidth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((p) => (
                    <div key={p.name} className="glass-panel p-8 flex flex-col relative overflow-hidden group hover:border-brand-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                            {p.icon}
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-white">₹{p.price}</span>
                            <span className="text-slate-400">/mo</span>
                        </div>

                        <ul className="mb-8 flex-grow space-y-4">
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check size={18} className="text-brand-500" />
                                <span>Up to <strong>{p.deployments}</strong> deployments</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check size={18} className="text-brand-500" />
                                <span>Custom Domains</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check size={18} className="text-brand-500" />
                                <span>Automated CI/CD via GitHub</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <Check size={18} className="text-brand-500" />
                                <span>24/7 Monitoring</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handleUpgrade(p)}
                            disabled={loading === p.name}
                            className="w-full bg-brand-600/20 hover:bg-brand-500 text-brand-400 hover:text-white py-3 rounded-xl border border-brand-500/30 transition-all font-medium flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading === p.name ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <><CreditCard size={18} /> Upgrade to {p.name}</>}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Billing;
