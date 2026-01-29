import React, { useState, useEffect, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose }) => {
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);
    const containerRef = useRef(null);

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (e) {
                // Ignore stop errors
            }
            scannerRef.current = null;
        }
        setIsScanning(false);
    };

    const startScanner = async () => {
        setError(null);
        
        try {
            const html5QrCode = new Html5Qrcode("qr-reader");
            scannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                (decodedText) => {
                    // Success callback
                    stopScanner();
                    onScan(decodedText);
                },
                (errorMessage) => {
                    // Ignore scan errors - they happen when no QR visible
                }
            );
            
            setIsScanning(true);
        } catch (err) {
            console.error('Scanner error:', err);
            if (err.includes && err.includes('NotAllowedError')) {
                setError("Camera permission denied. Please allow camera access.");
            } else if (err.includes && err.includes('NotFoundError')) {
                setError("No camera found on this device.");
            } else {
                setError("Could not start camera. Please try again.");
            }
        }
    };

    // Start scanner automatically when component mounts
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            startScanner();
        }, 500);

        return () => {
            clearTimeout(timer);
            stopScanner();
        };
    }, []);

    const handleClose = () => {
        stopScanner();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-xl">Scan QR Code</h3>
                <button
                    onClick={handleClose}
                    className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {/* QR Scanner Container */}
                <div 
                    id="qr-reader" 
                    ref={containerRef}
                    className="w-full h-full"
                    style={{ minHeight: '300px' }}
                />

                {/* Error State */}
                {error && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-6">
                        <Camera size={64} className="mb-4 text-red-500" />
                        <p className="text-white text-lg mb-6">{error}</p>
                        <button
                            onClick={startScanner}
                            className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {!isScanning && !error && (
                    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
                        <Camera size={64} className="mb-4 text-blue-400 animate-pulse" />
                        <p className="text-white text-lg">Starting camera...</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-slate-900 p-4">
                <button
                    onClick={handleClose}
                    className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold text-lg"
                >
                    Cancel Scan
                </button>
            </div>
        </div>
    );
};

export default QRScanner;
