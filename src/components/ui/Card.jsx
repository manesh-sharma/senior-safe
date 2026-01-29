import React from 'react';

const Card = ({ children, className = "", onClick, variant = "default", hover = true }) => {
    const variants = {
        default: "bg-white border-2 border-slate-200 hover:border-brand-blue shadow-md hover:shadow-xl",
        glass: "bg-white/60 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-2xl hover:bg-white/70",
        gradient: "bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 shadow-lg hover:shadow-2xl hover:from-blue-50 hover:to-white",
        elevated: "bg-white border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1",
    };

    return (
        <div
            onClick={onClick}
            className={`
                rounded-2xl p-4 transition-all duration-300
                ${variants[variant]}
                ${hover ? 'cursor-pointer' : ''}
                ${onClick ? 'active:scale-[0.98]' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default Card;
