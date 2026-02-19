import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Cloud, CloudOff, Loader2, CheckCircle } from 'lucide-react';

interface BackendStatus {
    isChecking: boolean;
    isAwake: boolean;
    error: string | null;
}

export const useBackendStatus = () => {
    const [status, setStatus] = useState<BackendStatus>({
        isChecking: true,
        isAwake: false,
        error: null
    });
    const [showNotification, setShowNotification] = useState(false);

    const checkBackend = async () => {
        setStatus(prev => ({ ...prev, isChecking: true, error: null }));
        
        try {
            const startTime = Date.now();
            await api.get('/health', { timeout: 60000 });
            const responseTime = Date.now() - startTime;
            
            setStatus({
                isChecking: false,
                isAwake: true,
                error: null
            });
            
            if (responseTime > 5000) {
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 5000);
            }
            
            return true;
        } catch {
            setStatus({
                isChecking: false,
                isAwake: false,
                error: 'Backend is starting up. This may take up to 60 seconds on free tier.'
            });
            return false;
        }
    };

    useEffect(() => {
        checkBackend();
    }, []);

    return { ...status, checkBackend, showNotification };
};

export const BackendStatusIndicator: React.FC = () => {
    const { isChecking, isAwake, checkBackend, showNotification } = useBackendStatus();

    return (
        <>
            {showNotification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
                        <CheckCircle size={20} />
                        <span className="font-medium">Backend is ready!</span>
                    </div>
                </div>
            )}

            <div className="flex items-center space-x-3">
                {isChecking && (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm">Checking backend...</span>
                    </div>
                )}

                {!isChecking && isAwake && (
                    <div className="flex items-center space-x-2 text-green-600">
                        <Cloud size={18} />
                        <span className="text-sm font-medium">Backend Online</span>
                    </div>
                )}

                {!isChecking && !isAwake && (
                    <div className="flex items-center space-x-2">
                        <CloudOff size={18} className="text-yellow-500" />
                        <span className="text-sm text-yellow-600">
                            Backend is waking up...
                        </span>
                        <button 
                            onClick={checkBackend}
                            className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export const BackendWakeUpBanner: React.FC = () => {
    const [dismissed, setDismissed] = useState(false);
    const { isAwake, isChecking } = useBackendStatus();

    if (dismissed || isAwake || isChecking) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Loader2 size={20} className="animate-spin" />
                    <div>
                        <p className="font-semibold">Backend is waking up from sleep</p>
                        <p className="text-sm opacity-90">
                            Free tier services spin down after inactivity. This may take 30-60 seconds.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setDismissed(true)}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};
