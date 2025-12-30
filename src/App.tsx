import React, { useState, useEffect, useCallback } from 'react';
import {
    Dumbbell, Menu, X, ChevronRight, ChevronLeft, MapPin, Mail, Phone,
    Clock, Award, Target, TrendingUp, Star, Heart, Zap, Shield, Flame,
    Check, Loader2, Activity, Instagram, Facebook, Twitter, Youtube, Users, Trophy
} from 'lucide-react';

/* --- Interfaces --- */

interface CarouselProps {
    items: any[];
    renderItem: (item: any) => React.ReactNode;
    itemsPerView?: number;
    className?: string;
    autoPlay?: boolean;
}

/* --- Reusable Components --- */

const Carousel = ({ items, renderItem, itemsPerView = 1, className = "", autoPlay = false }: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Responsive itemsPerView
    const [actualItemsPerView, setActualItemsPerView] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setActualItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setActualItemsPerView(Math.min(2, itemsPerView));
            } else {
                setActualItemsPerView(itemsPerView);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [itemsPerView]);

    const totalSlides = Math.ceil(items.length / actualItemsPerView);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }, [totalSlides]);

    // Touch Swipe
    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 75) nextSlide();
        if (touchStart - touchEnd < -75) prevSlide();
    };

    useEffect(() => {
        if (!autoPlay) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [autoPlay, nextSlide]);

    return (
        <div
            className={`relative group ${className}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="overflow-hidden py-12">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                        <div key={slideIndex} className="w-full flex-shrink-0 grid gap-6" style={{ gridTemplateColumns: `repeat(${actualItemsPerView}, minmax(0, 1fr))` }}>
                            {items.slice(slideIndex * actualItemsPerView, (slideIndex + 1) * actualItemsPerView).map((item, idx) => (
                                <div key={idx} className="animate-fade-in w-full px-2">
                                    {renderItem(item)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {totalSlides > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 transition-all z-10 shadow-lg border border-slate-700">
                        <ChevronLeft />
                    </button>
                    <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 transition-all z-10 shadow-lg border border-slate-700">
                        <ChevronRight />
                    </button>
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 h-2 bg-gradient-to-r from-cyan-500 to-blue-600' : 'w-2 h-2 bg-slate-700 hover:bg-slate-600'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

/* --- Main Application --- */

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        setIsOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 py-4 shadow-lg' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div
                    className="flex items-center space-x-2 cursor-pointer group"
                    onClick={() => scrollTo('hero')}
                >
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg group-hover:scale-105 transition-transform">
                        <Dumbbell className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">BREEK <span className="text-cyan-400">Fitness</span></span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-8">
                    {['Home', 'About', 'Plans', 'Facilities', 'Classes', 'Contact'].map(item => (
                        <button key={item} onClick={() => scrollTo(item === 'Home' ? 'hero' : item.toLowerCase())} className="text-slate-300 hover:text-cyan-400 text-sm font-medium uppercase tracking-wider transition-colors">
                            {item}
                        </button>
                    ))}
                    <button onClick={() => scrollTo('contact')} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-105">
                        JOIN NOW
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 py-6' : 'max-h-0'}`}>
                <div className="flex flex-col px-6 space-y-4">
                    {['Home', 'About', 'Plans', 'Facilities', 'Classes', 'Contact'].map(item => (
                        <button key={item} onClick={() => scrollTo(item === 'Home' ? 'hero' : item.toLowerCase())} className="text-left text-slate-300 hover:text-cyan-400 font-medium pb-2 border-b border-slate-800">
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-950">
            {/* Backgrounds */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 z-0" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 z-0" />

            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-slide-up">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                        <Award size={16} /> <span>Premium Fitness Experience</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                        Transform Your <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400">Body & Mind</span>
                    </h1>
                    <p className="text-slate-400 text-lg lg:text-xl max-w-xl">
                        Join BREEK Fitness and discover a community dedicated to helping you achieve your fitness goals through expert coaching and world-class facilities.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all group">
                            Get Started Today <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-xl border-2 border-slate-700 text-white font-bold hover:border-cyan-500 hover:text-cyan-400 transition-all bg-transparent">
                            View Membership Plans
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-800">
                        {[
                            { val: "500+", label: "Active Members" },
                            { val: "20+", label: "Expert Trainers" },
                            { val: "50+", label: "Weekly Classes" },
                            { val: "10+", label: "Years Exp" },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.val}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:block relative">
                    {/* Abstract Hero Visualization */}
                    <div className="relative w-full aspect-square max-w-lg mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse-slow" />
                        <div className="relative glass-card w-full h-full rounded-3xl overflow-hidden flex items-center justify-center p-8 border-slate-700/50">
                            <TrendingUp size={120} className="text-cyan-500 animate-float drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
                            <div className="absolute bottom-10 right-10 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-500/20 text-green-400 rounded-lg"><Activity size={20} /></div>
                                    <div>
                                        <div className="text-xs text-slate-400">Calories Burned</div>
                                        <div className="font-bold text-white">840 kcal</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const About = () => {
    return (
        <section id="about" className="py-24 bg-slate-900 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">About <span className="text-cyan-400">Us</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        We are more than just a gym. We are a community driven by the passion to help you become the best version of yourself.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: "Expert Trainers", desc: "Certified professionals to guide your every step.", icon: <Trophy />, color: "from-yellow-500 to-orange-500" },
                        { title: "Modern Equipment", desc: "The latest high-tech machinery for optimal results.", icon: <Dumbbell />, color: "from-cyan-500 to-blue-500" },
                        { title: "Community Focus", desc: "A supportive environment that motivates you.", icon: <Users />, color: "from-pink-500 to-purple-500" }
                    ].map((feature, i) => (
                        <div key={i} className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-all hover:-translate-y-1 duration-300 h-full">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Big Testimonial */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-800/30 border border-slate-700 p-8 md:p-12">
                    <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-[100px] rounded-full" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-3xl overflow-hidden border-2 border-cyan-500">
                                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200" alt="Member" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex justify-center md:justify-start space-x-1 mb-4">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />)}
                            </div>
                            <p className="text-xl md:text-2xl text-white font-medium italic mb-4">"BREEK Fitness changed my life. The trainers are incredible and the atmosphere is so welcoming. I've never felt stronger!"</p>
                            <div>
                                <div className="font-bold text-cyan-400">Sarah Johnson</div>
                                <div className="text-sm text-slate-500">Member since 2023</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Plans = ({ setJoinPlan }: { setJoinPlan: (plan: string) => void }) => {
    const plans = [
        {
            name: "Starter", price: "$29", icon: <Target size={32} />,
            features: ["Gym Access 24/7", "5 Group Classes/Month", "Locker Room Access", "Mobile App Access", "Free Fitness Assessment"],
            recom: false
        },
        {
            name: "Pro", price: "$59", icon: <TrendingUp size={32} />,
            features: ["Unlimited Access", "Unlimited Group Classes", "1 PT Session", "Nutrition Consultation", "Priority Booking", "Guest Passes (2/mo)"],
            recom: true
        },
        {
            name: "Elite", price: "$99", icon: <Star size={32} />,
            features: ["All Pro Features", "4 PT Sessions", "Custom Meal Plans", "Recovery & Spa Access", "Supplement Discount", "VIP Events Access"],
            recom: false
        }
    ];

    const handleSelect = (planName: string) => {
        setJoinPlan(planName);
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="plans" className="py-24 bg-slate-950 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Membership <span className="text-cyan-400">Plans</span></h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Choose the perfect plan to fuel your journey. Flexible options for every fitness level.</p>
                </div>

                <Carousel
                    items={plans}
                    itemsPerView={3}
                    renderItem={(plan) => (
                        <div className={`relative h-full p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] flex flex-col ${plan.recom ? 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'}`}>
                            {plan.recom && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${plan.recom ? 'from-cyan-500 to-blue-600' : 'from-slate-800 to-slate-700'}`}>
                                <div className="text-white">{plan.icon}</div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-bold text-cyan-400">{plan.price}</span>
                                <span className="text-slate-500 ml-2">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feat: string, i: number) => (
                                    <li key={i} className="flex items-start text-slate-300 text-sm">
                                        <Check className="text-cyan-400 mr-3 flex-shrink-0" size={18} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSelect(plan.name)}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.recom ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                            >
                                Select {plan.name}
                            </button>
                        </div>
                    )}
                />
            </div>
        </section>
    );
};

const Facilities = () => {
    const facilities = [
        { title: "Cardio Zone", icon: <Heart />, color: "from-blue-600 to-cyan-500" },
        { title: "Strength Training", icon: <Dumbbell />, color: "from-red-600 to-orange-500" },
        { title: "Yoga & Pilates", icon: <Activity />, color: "from-purple-600 to-pink-500" },
        { title: "Functional Training", icon: <Zap />, color: "from-orange-600 to-yellow-500" },
        { title: "Recovery Zone", icon: <Shield />, color: "from-green-600 to-emerald-500" },
        { title: "Personal Training", icon: <Award />, color: "from-cyan-600 to-blue-500" }
    ];

    return (
        <section id="facilities" className="py-24 bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">World Class <span className="text-blue-500">Facilities</span></h2>
                        <p className="text-slate-400">Everything you need to exceed your potential.</p>
                    </div>
                </div>

                <Carousel
                    items={facilities}
                    itemsPerView={3}
                    renderItem={(fac) => (
                        <div className="relative group h-96 rounded-3xl overflow-hidden cursor-pointer">
                            <div className={`absolute inset-0 bg-gradient-to-br ${fac.color} opacity-20 group-hover:opacity-40 transition-all duration-500`} />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="absolute top-8 left-8 w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                                    {fac.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{fac.title}</h3>
                                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                    State-of-the-art equipment designed for maximum performance and safety.
                                </p>
                            </div>
                        </div>
                    )}
                />
            </div>
        </section>
    );
};

const Classes = () => {
    const classes = [
        { name: "HIIT Training", dur: "45 min", int: "High", icon: <Flame />, color: "red" },
        { name: "Strength & Power", dur: "60 min", int: "High", icon: <Dumbbell />, color: "orange" },
        { name: "Yoga Flow", dur: "60 min", int: "Low", icon: <Activity />, color: "green" },
        { name: "Boxing Fitness", dur: "45 min", int: "High", icon: <Target />, color: "red" },
        { name: "Spin & Cycle", dur: "45 min", int: "Med", icon: <Zap />, color: "yellow" },
        { name: "Personal Training", dur: "Var", int: "Custom", icon: <Award />, color: "purple" },
    ];

    // Helper for intensity badge
    const getBadge = (int: string) => {
        const styles: any = {
            High: "bg-red-500/20 text-red-400 border-red-500/30",
            Med: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            Low: "bg-green-500/20 text-green-400 border-green-500/30",
            Custom: "bg-purple-500/20 text-purple-400 border-purple-500/30"
        };
        return styles[int] || styles.High;
    };



    return (
        <section id="classes" className="py-24 bg-slate-950">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-16 text-center">Weekly <span className="text-cyan-400">Classes</span></h2>
                <Carousel
                    items={classes}
                    itemsPerView={4}
                    renderItem={(cls) => (
                        <div className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 p-6 rounded-3xl transition-all hover:bg-slate-900 group h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                    {cls.icon}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadge(cls.int)}`}>{cls.int}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{cls.name}</h3>
                            <div className="flex items-center text-slate-400 text-sm">
                                <Clock size={14} className="mr-2" /> {cls.dur}
                            </div>
                        </div>
                    )}
                />
            </div>
        </section>
    );
};

/* --- Forms --- */

const ContactSection = ({ activePlan }: { activePlan: string }) => {
    // Contact Form State
    const [cForm, setCForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [cErrors, setCErrors] = useState<any>({});
    const [cLoading, setCLoading] = useState(false);
    const [cSuccess, setCSuccess] = useState(false);

    // Join Form State
    const [jForm, setJForm] = useState({ name: '', email: '', plan: activePlan || 'Starter' });
    const [jErrors, setJErrors] = useState<any>({});
    const [jLoading, setJLoading] = useState(false);
    const [jSuccess, setJSuccess] = useState(false);

    // Update join plan if prop changes
    useEffect(() => {
        if (activePlan) setJForm(prev => ({ ...prev, plan: activePlan }));
    }, [activePlan]);

    const validate = (data: any, type: 'contact' | 'join') => {
        const errors: any = {};
        if (!data.name.trim()) errors.name = "Name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email";

        if (type === 'contact') {
            if (!/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone)) errors.phone = "Please enter a valid phone number";
            if (!data.message.trim()) errors.message = "Message is required";
        }
        return errors;
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate(cForm, 'contact');
        if (Object.keys(errs).length > 0) {
            setCErrors(errs);
            return;
        }
        setCLoading(true);
        console.log("Contact Form Submitting:", cForm);

        setTimeout(() => {
            setCLoading(false);
            setCSuccess(true);
            console.log("Contact Success");
            setTimeout(() => {
                setCSuccess(false);
                setCForm({ name: '', email: '', phone: '', message: '' });
                setCErrors({});
            }, 5000);
        }, 1500);
    };

    const handleJoinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate(jForm, 'join');
        if (Object.keys(errs).length > 0) {
            setJErrors(errs);
            return;
        }
        setJLoading(true);
        console.log("Join Form Submitting:", jForm);

        setTimeout(() => {
            setJLoading(false);
            setJSuccess(true);
            console.log("Join Success");
            setTimeout(() => {
                setJSuccess(false);
                setJForm({ name: '', email: '', plan: 'Starter' });
                setJErrors({});
            }, 5000);
        }, 1500);
    };

    const InputField = ({ label, name, type = "text", value, onChange, error, placeholder }: any) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-slate-950 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'} rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );

    return (
        <section id="contact" className="py-24 bg-slate-900 relative">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Contact Form */}
                    <div className="space-y-8">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                                <Mail size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Contact Us</h2>
                        </div>

                        {cSuccess ? (
                            <div className="h-96 flex flex-col items-center justify-center bg-slate-950/50 rounded-3xl border border-green-500/30 animate-fade-in">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6">
                                    <Check size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-slate-400 text-center max-w-xs">Thanks for reaching out. We will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-5 bg-slate-950/30 p-8 rounded-3xl border border-slate-800">
                                <InputField
                                    label="Full Name" name="name"
                                    value={cForm.name}
                                    onChange={(e: any) => { setCForm({ ...cForm, name: e.target.value }); if (cErrors.name) setCErrors({ ...cErrors, name: '' }); }}
                                    error={cErrors.name}
                                    placeholder="John Doe"
                                />
                                <InputField
                                    label="Email Address" type="email" name="email"
                                    value={cForm.email}
                                    onChange={(e: any) => { setCForm({ ...cForm, email: e.target.value }); if (cErrors.email) setCErrors({ ...cErrors, email: '' }); }}
                                    error={cErrors.email}
                                    placeholder="john@example.com"
                                />
                                <InputField
                                    label="Phone Number" type="tel" name="phone"
                                    value={cForm.phone}
                                    onChange={(e: any) => { setCForm({ ...cForm, phone: e.target.value }); if (cErrors.phone) setCErrors({ ...cErrors, phone: '' }); }}
                                    error={cErrors.phone}
                                    placeholder="+1 (555) 000-0000"
                                />
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-300">Message</label>
                                    <textarea
                                        rows={4}
                                        value={cForm.message}
                                        onChange={(e: any) => { setCForm({ ...cForm, message: e.target.value }); if (cErrors.message) setCErrors({ ...cErrors, message: '' }); }}
                                        className={`w-full bg-slate-950 border ${cErrors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500'} rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all`}
                                        placeholder="How can we help you?"
                                    />
                                    {cErrors.message && <p className="text-xs text-red-500">{cErrors.message}</p>}
                                </div>
                                <button type="submit" disabled={cLoading} className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                    {cLoading ? <><Loader2 className="animate-spin mr-2" /> Sending...</> : <><span className="mr-2">Send Message</span> <ChevronRight size={18} /></>}
                                </button>
                            </form>
                        )}

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: <Phone size={20} />, text: "+1 (555) 123-4567" },
                                { icon: <Mail size={20} />, text: "info@breek.fitness" },
                                { icon: <MapPin size={20} />, text: "123 Fitness Ave" },
                            ].map((info, i) => (
                                <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-cyan-400 mb-3">{info.icon}</div>
                                    <span className="text-xs text-slate-400">{info.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Join Form */}
                    <div className="glass-card p-1 rounded-3xl bg-gradient-to-b from-slate-800 to-slate-950">
                        <div className="bg-slate-950/80 backdrop-blur-xl rounded-[22px] p-8 h-full">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white">
                                    <Award size={24} />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Join BREEK</h2>
                            </div>

                            {jSuccess ? (
                                <div className="h-96 flex flex-col items-center justify-center animate-fade-in">
                                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-6">
                                        <Check size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Welcome Aboard!</h3>
                                    <p className="text-slate-400 text-center max-w-xs">Check your email for your membership details.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleJoinSubmit} className="space-y-6">
                                    <InputField
                                        label="Full Name" name="name"
                                        value={jForm.name}
                                        onChange={(e: any) => { setJForm({ ...jForm, name: e.target.value }); if (jErrors.name) setJErrors({ ...jErrors, name: '' }); }}
                                        error={jErrors.name}
                                        placeholder="Jane Doe"
                                    />
                                    <InputField
                                        label="Email Address" type="email" name="email"
                                        value={jForm.email}
                                        onChange={(e: any) => { setJForm({ ...jForm, email: e.target.value }); if (jErrors.email) setJErrors({ ...jErrors, email: '' }); }}
                                        error={jErrors.email}
                                        placeholder="jane@example.com"
                                    />
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-300">Select Plan</label>
                                        <select
                                            value={jForm.plan}
                                            onChange={(e) => setJForm({ ...jForm, plan: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Starter">Starter Plan - $29/mo</option>
                                            <option value="Pro">Pro Plan - $59/mo</option>
                                            <option value="Elite">Elite Plan - $99/mo</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center space-x-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <Shield className="text-green-500 flex-shrink-0" size={20} />
                                        <p className="text-xs text-slate-400">Your information is secure. No credit card required for trial.</p>
                                    </div>

                                    <button type="submit" disabled={jLoading} className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                        {jLoading ? <><Loader2 className="animate-spin mr-2" /> Processing...</> : <><span className="mr-2">Join Now</span> <ChevronRight size={18} /></>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <Dumbbell className="text-cyan-400" size={24} />
                        <span className="text-xl font-bold text-white">BREEK <span className="text-cyan-400">Fitness</span></span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Redefining fitness through innovation, community, and expert coaching. Join the movement today.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Quick Links</h4>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        {['About', 'Plans', 'Facilities', 'Classes'].map(link => (
                            <li key={link}><a href={`#${link.toLowerCase()}`} className="hover:text-cyan-400 transition-colors uppercase tracking-wider">{link}</a></li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Open Hours</h4>
                    <ul className="space-y-4 text-slate-400 text-sm">
                        <li className="flex justify-between"><span>Mon - Fri</span> <span className="text-white">24 Hours</span></li>
                        <li className="flex justify-between"><span>Saturday</span> <span className="text-white">24 Hours</span></li>
                        <li className="flex justify-between"><span>Sunday</span> <span className="text-white">24 Hours</span></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Follow Us</h4>
                    <div className="flex space-x-4">
                        {[
                            { icon: <Instagram size={20} />, color: "hover:bg-pink-600", label: "Instagram" },
                            { icon: <Facebook size={20} />, color: "hover:bg-blue-600", label: "Facebook" },
                            { icon: <Twitter size={20} />, color: "hover:bg-sky-400", label: "Twitter" },
                            { icon: <Youtube size={20} />, color: "hover:bg-red-600", label: "YouTube" }
                        ].map((social, i) => (
                            <a key={i} href="#" aria-label={social.label} className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white transition-all ${social.color} hover:scale-110`}>
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                <p>&copy; 2024 BREEK Fitness. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

export default function App() {
    const [joinPlan, setJoinPlan] = useState('');

    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
            <Navbar />
            <Hero />
            <About />
            <Plans setJoinPlan={setJoinPlan} />
            <Facilities />
            <Classes />
            <ContactSection activePlan={joinPlan} />
            <Footer />
        </div>
    );
}
