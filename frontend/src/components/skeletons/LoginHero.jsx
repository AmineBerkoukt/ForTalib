import React from 'react';
import { CheckCircle, Zap, Users, FileText, Video } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const LoginHero = () => {
    const { isDarkMode } = useTheme();

    const features = [
        { icon: Zap, text: 'Real-time messaging' },
        { icon: FileText, text: 'Image sharing' },
        { icon: Users, text: 'Student colaboration' },
    ];

    return (
        <div className={`flex flex-col justify-center items-center p-8 ${
            isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-primary to-primary-dark text-white'
        } lg:flex-1 overflow-hidden relative`}>
            <div className="max-w-md text-center relative z-10">
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 animate-fade-in-up">Join Our Community</h2>
                <p className="text-xl lg:text-2xl mb-8 animate-fade-in-up animation-delay-200">Find your Colocator !</p>
                <ul className="space-y-4 text-left">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center animate-fade-in-up" style={{ animationDelay: `${(index + 2) * 200}ms` }}>
                            <feature.icon className={`h-6 w-6 lg:h-8 lg:w-8 mr-3 ${
                                isDarkMode ? 'text-primary' : 'text-white'
                            }`} />
                            <span className="text-lg lg:text-xl">{feature.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
        </div>
    );
};

export default LoginHero;
