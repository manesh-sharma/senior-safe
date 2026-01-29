import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { BrowserQRCodeReader } from '@zxing/browser';

const QRScanner = ({ onScan, onClose }) => {
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const readerRef = useRef(null);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (readerRef.current) {
            readerRef.current = null;
        }
        setIsScanning(false);
    };

    const startCamera = async () => {
        setError(null);
        
        try {
            // First, get camera stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true');
                await videoRef.current.play();
                setIsScanning(true);
                
                // Start QR code detection
                startQRDetection();
            }
        } catch (err) {
            console.error('Camera error:', err);
            handleCameraError(err);
        }
    };

    const startQRDetection = async () => {
        if (!videoRef.current) return;

        try {
            const codeReader = new BrowserQRCodeReader();
            readerRef.current = codeReader;

            // Continuously decode from video
            const controls = await codeReader.decodeFromVideoElement(
                videoRef.current,
                (result, error) => {
                    if (result) {
                        stopCamera();
                        onScan(result.getText());
                    }
                    // Ignore errors during scanning - they're expected when no QR is visible
                }
            );
        } catch (err) {
            console.error('QR detection error:', err);
            // Don't show error for detection issues - camera is still working
        }
    };

    const handleCameraError = (err) => {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError("Camera permission denied. Please allow camera access in browser settings, then refresh.");
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setError("No camera found on this device.");
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            setError("Camera is busy. Close other apps using camera and try again.");
        } else if (err.name === 'OverconstrainedError') {
            setError("Camera doesn't support required settings. Trying fallback...");
            // Try with simpler constraints
            startCameraFallback();
        } else {
            setError(`Camera error: ${err.message}. Use simulate buttons below.`);
        }
    };

    const startCameraFallback = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute('playsinline', 'true');
                await videoRef.current.play();
                setIsScanning(true);
                setError(null);
                startQRDetection();
            }
        } catch (err) {
            console.error('Fallback camera error:', err);
            setError("Could not access camera. Use simulate buttons below.");
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Scan QR Code</h3>
                <button
                    onClick={handleClose}
                    className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Camera View */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
                {!isScanning && !error && (
                    <div className="text-center p-6">
                        <Camera size={64} className="mx-auto mb-4 text-blue-400" />
                        <p className="text-white text-lg mb-4">Ready to scan</p>
                        <button
                            onClick={startCamera}
                            className="bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-blue-900 transition-colors shadow-lg"
                        >
                            📷 Start Camera
                        </button>
                        <p className="text-slate-400 text-sm mt-4">
                            Close chat bubbles & overlay apps first
                        </p>
                    </div>
                )}

                {isScanning && (
                    <>
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                            autoPlay
                        />
                        {/* Scanning overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-64 h-64 border-4 border-blue-500 rounded-2xl relative">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
                                {/* Scanning line animation */}
                                <div className="absolute left-2 right-2 h-0.5 bg-blue-500 animate-pulse top-1/2" />
                            </div>
                        </div>
                        <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                            Point at QR code
                        </p>
                    </>
                )}

                {error && (
                    <div className="text-center p-6">
                        <Camera size={48} className="mx-auto mb-4 text-red-500" />
                        <p className="text-white mb-4">{error}</p>
                        <button
                            onClick={startCamera}
                            className="flex items-center gap-2 mx-auto bg-blue-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900"
                        >
                            <RefreshCw size={20} />
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            {/* Footer with simulate buttons */}
            <div className="bg-slate-900 p-4 space-y-2">
                <p className="text-slate-400 text-xs text-center">
                    Camera not working? Use test buttons:
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            stopCamera();
                            onScan('{"type":"SENIORSAFE_CASH","amt":50}');
                        }}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm"
                    >
                        ✅ Test: ₹50 Voucher
                    </button>
                    <button
                        onClick={() => {
                            stopCamera();
                            onScan('http://fakepayment.com');
                        }}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm"
                    >
                        ⚠️ Test: Fake Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
