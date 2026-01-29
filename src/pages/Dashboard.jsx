import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import Card from '../components/ui/Card';
import { ScanLine, Send, Wallet, Receipt, ChevronRight, QrCode, UserPlus, ShieldAlert, Calculator, CreditCard, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ActionButton = ({ icon: Icon, label, to, color = "bg-brand-blue" }) => (
    <Link to={to} className="flex flex-col items-center gap-2 group">
        <div className={`${color} text-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
            <Icon size={32} />
        </div>
        <span className="font-semibold text-slate-700 text-sm">{label}</span>
    </Link>
);

const Dashboard = () => {
    const { balance, contacts, addContact, transactions } = useWallet();
    const [showBalance, setShowBalance] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');

    const handleAddContact = () => {
        if (newContactName.trim() && newContactPhone.trim()) {
            addContact(newContactName.trim(), newContactPhone.trim());
            setNewContactName('');
            setNewContactPhone('');
            setShowAddContact(false);
        }
    };

    // Get recent transactions for display
    const recentTransactions = transactions.slice(0, 3);

    return (
        <div className="space-y-6">
            {/* --- Balance Card --- */}
            <div className="gradient-animate rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10">
                    <h2 className="text-lg opacity-90 mb-1">Total Balance</h2>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">
                            {showBalance ? `₹${balance.toLocaleString()}` : "₹ •••••"}
                        </span>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/30 transition-all mb-1 border border-white/30"
                        >
                            {showBalance ? "Hide" : "Show"}
                        </button>
                    </div>
                    <p className="text-xs mt-4 opacity-75">🔒 Secure Environment • Demo Money</p>
                </div>
            </div>

            {/* --- Quick Actions --- */}
            <div className="grid grid-cols-4 gap-2">
                <ActionButton to="/scan" icon={ScanLine} label="Scan QR" />
                <ActionButton to="/send" icon={Send} label="To Contact" />
                <ActionButton to="/voucher" icon={QrCode} label="P2P Cash" color="bg-brand-green" />
                <ActionButton to="/history" icon={Receipt} label="History" color="bg-indigo-500" />
            </div>

            {/* --- More Features --- */}
            <div className="grid grid-cols-3 gap-2">
                <ActionButton to="/scam-lab" icon={ShieldAlert} label="Scam Lab" color="bg-red-500" />
                <ActionButton to="/loan-center" icon={Calculator} label="Loans" color="bg-purple-500" />
                <ActionButton to="/bills" icon={CreditCard} label="Bills" color="bg-teal-500" />
            </div>

            {/* --- Daily Mission --- */}
            <Card variant="gradient" className="border-l-4 border-l-brand-green relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-5">🎯</div>
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Daily Mission</h3>
                        <p className="text-slate-600 text-sm">Send ₹100 to a contact.</p>
                    </div>
                    <Link to="/send" className="bg-gradient-to-r from-brand-green to-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all">
                        Start
                    </Link>
                </div>
            </Card>

            {/* --- Contacts / People --- */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800 text-lg">People</h3>
                    <button
                        onClick={() => setShowAddContact(true)}
                        className="text-brand-blue text-sm font-semibold flex items-center gap-1 hover:underline bg-blue-50 px-3 py-1 rounded-full transition-all hover:bg-blue-100"
                    >
                        <UserPlus size={16} /> Add
                    </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {contacts.map((contact) => (
                        <Link
                            key={contact.id}
                            to="/send"
                            className="flex flex-col items-center min-w-[70px] group"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg mb-1 group-hover:from-brand-blue group-hover:to-blue-600 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-110">
                                {contact.name.charAt(0)}
                            </div>
                            <span className="text-xs text-slate-600 truncate w-16 text-center">
                                {contact.name.split(' ')[0]}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* --- Recent Activity --- */}
            {recentTransactions.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-slate-800 text-lg">Recent Activity</h3>
                        <Link to="/history" className="text-brand-blue text-sm font-semibold hover:underline">
                            See All
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentTransactions.map((tx) => (
                            <Card key={tx.id} variant="elevated" hover={false} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-100 text-brand-green' : 'bg-red-100 text-red-500'}`}>
                                        {tx.type === 'CREDIT' ? '↓' : '↑'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{tx.toName || tx.description}</p>
                                        <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={`font-bold text-lg ${tx.type === 'CREDIT' ? 'text-brand-green' : 'text-red-500'}`}>
                                    {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Add Contact Modal --- */}
            <Modal
                isOpen={showAddContact}
                onClose={() => setShowAddContact(false)}
                title="Add New Contact"
            >
                <div className="space-y-4">
                    <Input
                        label="Name"
                        icon={User}
                        value={newContactName}
                        onChange={(e) => setNewContactName(e.target.value)}
                        placeholder="e.g., Sharma Uncle"
                    />
                    <Input
                        label="Phone Number"
                        icon={Phone}
                        type="tel"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="e.g., 9876543210"
                        maxLength={10}
                    />
                    <Button onClick={handleAddContact} fullWidth size="lg" disabled={!newContactName.trim() || !newContactPhone.trim()}>
                        Add Contact
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
