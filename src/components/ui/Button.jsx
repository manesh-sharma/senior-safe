import React from 'react';

const variants = {
    primary: 'relative overflow-hidden bg-gradient-to-r from-brand-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
    success: 'relative overflow-hidden bg-gradient-to-r from-brand-green to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60 before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
    green: 'relative overflow-hidden bg-gradient-to-r from-brand-green to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60 before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
    danger: 'relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/60 before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
    outline: 'relative bg-white text-brand-blue border-2 border-brand-blue hover:bg-brand-blue hover:text-white shadow-md hover:shadow-lg transition-all duration-300',
    ghost: 'relative bg-transparent text-slate-700 hover:bg-slate-100 hover:shadow-md transition-all duration-300',
    glass: 'relative bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-300',
};

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

const Button = ({
    children,
    variant = 'primary',
    color, // alias for variant
    size = 'md',
    className = '',
    disabled = false,
    fullWidth = false,
    onClick,
    type = 'button',
    ...props
}) => {
    const variantKey = color || variant;
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative font-bold rounded-xl transition-all duration-300
                active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
                ${variants[variantKey] || variants.primary}
                ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}
        >
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default Button;
