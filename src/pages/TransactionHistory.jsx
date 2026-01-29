import React from 'react';
import { useWallet } from '../context/WalletContext';
import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';

const TransactionHistory = () => {
    const { transactions } = useWallet();

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">Transaction History</h2>

            {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Clock size={40} className="text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-semibold text-lg">No transactions yet</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Your payment history will appear here
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((tx, index) => (
                        <div
                            key={tx.id}
                            className="bg-white p-4 rounded-2xl border-0 shadow-md hover:shadow-xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Icon */}
                            <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${tx.type === 'CREDIT'
                                        ? 'bg-gradient-to-br from-green-100 to-green-200 text-brand-green'
                                        : 'bg-gradient-to-br from-red-100 to-red-200 text-red-500'
                                    }`}
                            >
                                {tx.type === 'CREDIT' ? (
                                    <ArrowDownLeft size={24} strokeWidth={2.5} />
                                ) : (
                                    <ArrowUpRight size={24} strokeWidth={2.5} />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 truncate">
                                    {tx.toName || tx.description}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {formatDate(tx.date)}
                                </p>
                            </div>

                            {/* Amount */}
                            <div
                                className={`text-right font-bold text-lg ${tx.type === 'CREDIT' ? 'text-brand-green' : 'text-red-500'
                                    }`}
                            >
                                {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
