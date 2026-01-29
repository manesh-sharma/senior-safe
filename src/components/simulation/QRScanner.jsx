import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, X } from 'lucide-react';

const QRScanner = ({ onScan, onClose }) => {
    const [error, setError] = useState(null);

    const handleScan = (result) => {
        if (result && result.length > 0) {
            onScan(result[0].rawValue);
        }
    };

    const handleError = (err) => {
        console.error('QR Scanner error:', err);
        setError("Camera not available. Use test button below.");
    };

    // Test with sample P2P QR data
    const testP2PPayment = () => {
        const testQRData = JSON.stringify({
            type: 'SENIORSAFE_PAY',
            userId: 'test-user-123',
            name: 'Test User',
            email: 'testuser@example.com',
            picture: null,
            amount: 100,
            timestamp: Date.now()
        });
        onScan(testQRData);
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-xl">Scan QR Code</h3>
                <button
                    onClick={onClose}
                    className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative bg-black">
                {!error ? (
                    <>
                        <Scanner
                            onScan={handleScan}
                            onError={handleError}
                            constraints={{ facingMode: 'environment' }}
                            styles={{
                                container: { 
                                    width: '100%', 
                                    height: '100%',
                                    position: 'relative'
                                },
                                video: { 
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%'
                                }
                            }}
                            allowMultiple={false}
                            scanDelay={500}
                        />
                        
                        {/* Scan Region Boundary */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Dark overlay with transparent center */}
                            <div className="absolute inset-0 bg-black/50" />
                            
                            {/* Clear scanning area */}
                            <div className="relative w-72 h-72">
                                {/* Cut out the center */}
                                <div className="absolute inset-0 bg-black/50" style={{
                                    clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)'
                                }} />
                                
                                {/* Border frame */}
                                <div className="absolute inset-0 border-4 border-white/30 rounded-2xl" />
                                
                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl" />
                                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl" />
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-2xl" />
                                
                                {/* Scanning line animation */}
                                <div className="absolute left-4 right-4 h-1 bg-blue-500 rounded-full top-1/2 animate-pulse shadow-lg shadow-blue-500/50" />
                            </div>
                        </div>
                        
                        {/* Instructions */}
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <p className="text-white text-lg font-medium bg-black/50 mx-auto px-4 py-2 rounded-full inline-block">
                                Point camera at QR code
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
                        <Camera size={64} className="mb-4 text-red-500" />
                        <p className="text-lg mb-4">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-slate-900 p-4 space-y-3">
                {/* Test Button for P2P payment */}
                <button
                    onClick={testP2PPayment}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg"
                >
                    📱 Test: Receive ₹100 Request
                </button>
                
                <button
                    onClick={onClose}
                    className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold text-lg"
                >
                    Cancel Scan
                </button>
            </div>
        </div>
    );
};

export default QRScanner;
