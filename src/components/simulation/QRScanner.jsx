import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, X } from 'lucide-react';

const QRScanner = ({ onScan, onClose }) => {
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(true);

    const handleScan = (result) => {
        console.log('🔍 Scan result:', result);
        if (result && result.length > 0) {
            const scannedData = result[0].rawValue;
            console.log('✅ QR Data:', scannedData);
            setScanning(false);
            onScan(scannedData);
        }
    };

    const handleError = (err) => {
        console.error('QR Scanner error:', err);
        // Don't show error for normal scan attempts
        if (err?.name === 'NotAllowedError') {
            setError("Camera permission denied. Please allow camera access in browser settings.");
        }
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
        console.log('🧪 Test QR Data:', testQRData);
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
            <div className="flex-1 relative bg-black overflow-hidden">
                {!error && scanning ? (
                    <>
                        <Scanner
                            onScan={handleScan}
                            onError={handleError}
                            formats={['qr_code']}
                            constraints={{ 
                                facingMode: 'environment',
                                width: { ideal: 1280 },
                                height: { ideal: 720 }
                            }}
                            components={{
                                audio: false,
                                torch: false,
                                finder: false
                            }}
                            styles={{
                                container: { 
                                    width: '100%', 
                                    height: '100%'
                                },
                                video: { 
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%'
                                }
                            }}
                            allowMultiple={false}
                            scanDelay={100}
                        />
                        
                        {/* Scan Region Boundary */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/40" />
                            
                            {/* Clear scanning area */}
                            <div className="relative w-64 h-64 bg-transparent" style={{
                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                            }}>
                                {/* Border frame */}
                                <div className="absolute inset-0 border-2 border-white/50 rounded-xl" />
                                
                                {/* Corner accents */}
                                <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                                <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                                <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                                <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                                
                                {/* Scanning line animation */}
                                <div className="absolute left-2 right-2 h-0.5 bg-blue-500 top-1/2 animate-pulse" />
                            </div>
                        </div>
                        
                        {/* Instructions */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <p className="text-white font-medium bg-black/60 mx-auto px-4 py-2 rounded-full inline-block text-sm">
                                Align QR code within the frame
                            </p>
                        </div>
                    </>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
                        <Camera size={64} className="mb-4 text-red-500" />
                        <p className="text-lg mb-4">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                setScanning(true);
                            }}
                            className="bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white">
                        <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-blue-500 rounded-full mb-4" />
                        <p>Processing...</p>
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
