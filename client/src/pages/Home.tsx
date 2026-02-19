import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ShieldCheck, Zap, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-neutral-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <BarChart3 className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">BuyerPortal</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Animated Background Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider uppercase border border-primary/30 rounded-full bg-primary/10 text-primary">
                                The Future of Buyer Management
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                                Master Your Data, <br />
                                <span className="gradient-text">Empower Your Growth.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed">
                                Streamline your buyer records with our high-performance portal.
                                Upload, search, and analyze data with lightning-fast efficiency.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link to="/register">
                                    <Button size="lg" className="px-10">
                                        Get Started Free
                                        <ArrowRight className="ml-2" size={20} />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" size="lg" className="px-10">
                                        View Demo
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 border-y border-white/5 bg-neutral-900/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Zap className="text-purple-400" size={32} />,
                                title: "Instant Processing",
                                description: "Upload large CSV or Excel files and see them processed in seconds with our optimized streaming architecture."
                            },
                            {
                                icon: <ShieldCheck className="text-pink-400" size={32} />,
                                title: "Secure by Design",
                                description: "Military-grade encryption for your passwords and secure JWT-based session management to keep your data safe."
                            },
                            {
                                icon: <BarChart3 className="text-blue-400" size={32} />,
                                title: "Smart Search",
                                description: "Find any buyer instantly with our powerful search logic that works across name, email, and mobile fields."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="mb-6 p-3 bg-neutral-800/50 rounded-xl inline-block">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-6 md:mb-0">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <BarChart3 className="text-white" size={18} />
                            </div>
                            <span className="font-bold tracking-tight">BuyerPortal</span>
                        </div>

                        <div className="text-sm text-neutral-500">
                            © 2024 Recordent Assignment. Built with passion for excellence.
                        </div>

                        <div className="flex space-x-6 mt-6 md:mt-0 text-neutral-400">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
