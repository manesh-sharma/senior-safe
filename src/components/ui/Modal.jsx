import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen = true, onClose, title, children, showClose = true }) => {
    if (isOpen === false) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
            <div 
                className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all animate-[slideUp_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h2 className="text-xl font-bold text-slate-800">{title || ''}</h2>
                        {showClose && onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/80 rounded-full transition-all hover:rotate-90 duration-300"
                                aria-label="Close"
                            >
                                <X size={22} className="text-slate-500" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={title ? "p-5" : "p-5"}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
