import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, X, RefreshCw } from 'lucide-react';

// NOTE: On desktop/without HTTPS, camera might fail. 
// We provide a "Simulate Scan" button for testing.
const QRScanner = ({ onScan, onClose }) => {
    const [error, setError] = useState(null);
    const [cameraStarted, setCameraStarted] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied'

    // Check camera permission on mount
    useEffect(() => {
        checkCameraPermission();
    }, []);

    const checkCameraPermission = async () => {
        try {
            // Check if we can query permissions
            if (navigator.permissions && navigator.permissions.query) {
                const result = await navigator.permissions.query({ name: 'camera' });
                setPermissionStatus(result.state);
                
                // Listen for permission changes
                result.onchange = () => {
                    setPermissionStatus(result.state);
                };
            }
        } catch (err) {
            // Some browsers don't support permission query for camera
            console.log('Permission query not supported, will request on start');
        }
    };

    const requestCameraAccess = async () => {
        setError(null);
        try {
            // Request camera access explicitly
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            // Stop the stream immediately - we just wanted to get permission
            stream.getTracks().forEach(track => track.stop());
            
            // Now start the scanner
            setCameraStarted(true);
            setPermissionStatus('granted');
        } catch (err) {
            console.error('Camera access error:', err);
            
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError("Camera permission denied. Please allow camera access in your browser settings.");
                setPermissionStatus('denied');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setError("No camera found on this device.");
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                setError("Camera is being used by another app. Please close other apps using the camera and try again.");
            } else if (err.message?.includes('overlay') || err.message?.includes('bubble')) {
                setError("Please close any screen overlays, chat bubbles, or dimming apps, then try again.");
            } else {
                setError(`Camera error: ${err.message || 'Unknown error'}. Try the simulate buttons below.`);
            }
        }
    };

    const handleScan = (result) => {
        if (result && result.length > 0) {
            onScan(result[0].rawValue);
        }
    };

    const handleError = (err) => {
        console.error('QR Scanner error:', err);
        if (err?.message?.includes("Permission") || err?.name === 'NotAllowedError') {
            setError("Camera permission denied. Please allow camera access.");
        } else if (err?.name === 'NotFoundError') {
            setError("No camera found on this device.");
        } else if (err?.message?.includes('overlay') || err?.message?.includes('bubble')) {
            setError("Please close any screen overlays or chat bubbles, then try again.");
        } else {
            setError("Camera not available. Use simulate buttons below.");
        }
        setCameraStarted(false);
    };

    const retryCamera = () => {
        setError(null);
        setCameraStarted(false);
        requestCameraAccess();
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/50 p-2 rounded-full text-slate-900"
                >
                    <X size={24} />
                </button>

                <h3 className="text-center py-4 font-bold text-lg bg-slate-100">Scan QR Code</h3>

                <div className="relative h-80 bg-black">
                    {!cameraStarted && !error ? (
                        // Show start camera button
                        <div className="flex flex-col items-center justify-center h-full text-white p-4 text-center">
                            <Camera size={64} className="mb-4 text-blue-400" />
                            <p className="mb-4 text-lg">Ready to scan QR code</p>
                            <button
                                onClick={requestCameraAccess}
                                className="bg-blue-800 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors"
                            >
                                📷 Start Camera
                            </button>
                            <p className="text-xs text-slate-400 mt-3">
                                Tip: Close any chat bubbles or overlay apps first
                            </p>
                        </div>
                    ) : cameraStarted && !error ? (
                        <Scanner
                            onScan={handleScan}
                            onError={handleError}
                            constraints={{ facingMode: 'environment' }}
                            styles={{
                                container: { height: '100%', width: '100%' },
                                video: { objectFit: 'cover' }
                            }}
                            allowMultiple={false}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white p-4 text-center">
                            <Camera size={48} className="mb-2 text-red-500" />
                            <p className="mb-4 text-sm">{error}</p>
                            <button
                                onClick={retryCamera}
                                className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-900 transition-colors"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>
                            <p className="text-xs text-slate-400 mt-3">Or use simulate buttons below</p>
                        </div>
                    )}

                    {/* Overlay Guide */}
                    {cameraStarted && !error && (
                        <div className="absolute inset-0 border-4 border-blue-800/50 pointer-events-none m-12 rounded-lg animate-pulse" />
                    )}
                </div>

                <div className="p-4 bg-slate-100 flex flex-col gap-2">
                    <p className="text-xs text-center text-slate-600">
                        Point camera at a SeniorSafe or Cash Voucher QR code.
                    </p>
                    {/* Fallback for Desktop/Testing */}
                    <button
                        onClick={() => onScan('{"type":"SENIORSAFE_CASH","amt":50}')}
                        className="text-xs text-blue-800 underline text-center"
                    >
                        [Simulate Scan: ₹50 Voucher]
                    </button>
                    <button
                        onClick={() => onScan('http://fakepayment.com')}
                        className="text-xs text-red-500 underline text-center"
                    >
                        [Simulate Scan: Fake Link]
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
