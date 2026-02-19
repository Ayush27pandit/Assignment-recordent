import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export const Hero = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white">
            <header className="relative z-50 py-4 md:py-6 border-b border-gray-100 bg-white/50 backdrop-blur-xl sticky top-0">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <BarChart3 className="text-white" size={24} />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-gray-900">BuyerPortal</span>
                            </Link>
                        </div>

                        <div className="flex md:hidden">
                            <button
                                type="button"
                                className="text-gray-900"
                                onClick={() => setExpanded(!expanded)}
                                aria-expanded={expanded}
                            >
                                {!expanded ? (
                                    <span aria-hidden="true">
                                        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </span>
                                ) : (
                                    <span aria-hidden="true">
                                        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="hidden md:flex md:items-center md:justify-center md:space-x-10 md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2 lg:space-x-16">
                            <a href="#features" className="text-base font-medium text-gray-600 transition-all duration-200 hover:text-primary"> Features </a>
                            <a href="#solutions" className="text-base font-medium text-gray-600 transition-all duration-200 hover:text-primary"> Solutions </a>
                            <a href="#about" className="text-base font-medium text-gray-600 transition-all duration-200 hover:text-primary"> About </a>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/login" className="text-base font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-6 py-2.5 text-base font-bold text-white transition-all duration-200 bg-primary border border-transparent rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                role="button"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    {expanded && (
                        <nav className="md:hidden">
                            <div className="px-1 py-8">
                                <div className="grid gap-y-7">
                                    <a href="#features" onClick={() => setExpanded(false)} className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded hover:bg-gray-50"> Features </a>
                                    <a href="#solutions" onClick={() => setExpanded(false)} className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded hover:bg-gray-50"> Solutions </a>
                                    <a href="#about" onClick={() => setExpanded(false)} className="flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded hover:bg-gray-50"> About </a>
                                    <Link to="/login" onClick={() => setExpanded(false)} className="flex items-center p-3 -m-3 text-base font-medium text-gray-900"> Sign In </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setExpanded(false)}
                                        className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-all duration-200 bg-primary border border-transparent rounded-xl hover:bg-primary/90"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            <section className="relative py-12 sm:py-16 lg:pb-40">
                <div className="absolute bottom-0 right-0 overflow-hidden">
                    <img className="w-full h-auto origin-bottom-right transform scale-150 lg:w-auto lg:mx-auto lg:object-cover lg:scale-75" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/background-pattern.png" alt="" />
                </div>

                <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2">
                        <div className="text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20">
                            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">Manage Buyer Data Without Chaos.</h1>
                            <p className="mt-2 text-lg text-gray-600 sm:mt-6 font-inter">Upload, manage, and explore buyer datasets with powerful search, pagination, and secure access control built for operational teams.</p>

                            <Link to="/register" title="" className="inline-flex px-8 py-4 mt-8 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded sm:mt-10 font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" role="button">
                                Get Started
                            </Link>

                            <div className="mt-8 sm:mt-16">
                                <div className="flex items-center justify-center lg:justify-start">
                                    <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                    </svg>
                                    <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                    </svg>
                                    <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                    </svg>
                                    <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                    </svg>
                                    <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                        />
                                    </svg>
                                </div>

                                <blockquote className="mt-6">
                                    <p className="text-lg font-bold text-gray-900 font-pj">Very useful!</p>
                                    <p className="mt-3 text-base leading-7 text-gray-600 font-inter">“We replaced scattered spreadsheets with this portal in under a day. Uploading buyer files is instant, search is fast even with thousands of records, and access control finally solved our data duplication issues.”
                                    </p>
                                </blockquote>

                                <div className="flex items-center justify-center mt-3 lg:justify-start">
                                    <img className="flex-shrink-0 object-cover w-6 h-6 overflow-hidden rounded-full" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/avatar-female.png" alt="" />
                                    <p className="ml-2 text-base font-bold text-gray-900 font-pj">Denny Jones</p>
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-1">
                            <img className="w-full mx-auto" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/illustration.png" alt="" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
