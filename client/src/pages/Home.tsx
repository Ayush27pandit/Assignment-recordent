import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { Hero } from '../components/ui/Hero';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-primary/30 overflow-x-hidden">
            <Hero />

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-24 border-y border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                            Everything you need to manage buyers
                        </h2>
                        <p className="mt-4 text-base sm:text-lg text-gray-600">
                            Powerful tools and secure infrastructure to help your business scale faster.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                        {[
                            {
                                icon: <Zap className="text-primary" size={28} />,
                                title: "Instant Processing",
                                description: "Upload large CSV or Excel files and see them processed in seconds with our optimized streaming architecture."
                            },
                            {
                                icon: <ShieldCheck className="text-primary" size={28} />,
                                title: "Secure by Design",
                                description: "Military-grade encryption for your passwords and secure JWT-based session management to keep your data safe."
                            },
                            {
                                icon: <BarChart3 className="text-primary" size={28} />,
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
                                className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                            >
                                <div className="mb-6 p-3 bg-primary/10 rounded-xl inline-block group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:justify-between md:items-center">
                        <div className="flex flex-col space-y-4 items-center md:items-start text-center md:text-left">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <BarChart3 className="text-white" size={18} />
                                </div>
                                <span className="font-bold tracking-tight text-gray-900">BuyerPortal</span>
                            </div>
                            <p className="text-xs text-gray-500 max-w-xs">
                                Simplifying buyer management for modern operational teams.
                            </p>
                        </div>

                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-600">
                                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                                <a href="#" className="hover:text-primary transition-colors">Contact</a>
                                <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                            </div>
                            <div className="text-xs text-gray-400">
                                © 2024 Recordent Assignment. Built with passion for excellence.
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
