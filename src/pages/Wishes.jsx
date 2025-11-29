import { motion } from 'framer-motion'
import Confetti from 'react-confetti';
import QRCode from 'react-qr-code';
import {
    User,
    Building2,
    Phone,
    Mail,
    UtensilsCrossed,
    AlertCircle,
    CheckCircle2,
    Users,
    Send,
    X,
    CheckCircle,
    Download
} from 'lucide-react'
import config from '@/config/config';
import { API_ENDPOINTS } from '@/config/api';
import BottomOrnaments from '@/components/BottomOrnaments';
import QRCode from 'qrcode';
import { useState } from 'react';

export default function Wishes() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);
    const [registrationUrl, setRegistrationUrl] = useState('');
    const qrCodeRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        whatsappNumber: '',
        email: '',
        foodRestriction: '',
        allergies: '',
        confirmationAttendance: '',
        numberOfPeople: '1'
    });
    const [qrData, setQrData] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('Submitting to:', API_ENDPOINTS.REGISTRATIONS);
            console.log('Form data:', formData);

            // Send data to backend API
            const response = await fetch(API_ENDPOINTS.REGISTRATIONS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = 'Failed to submit registration';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                    console.error('Error response:', errorData);
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                throw new Error(`${response.status}: ${errorMessage}`);
            }

            const data = await response.json();
            console.log('✅ Registration successful:', data);
            console.log('📦 Response data structure:', JSON.stringify(data, null, 2));
            console.log('📦 data.data:', data.data);
            console.log('📦 data.data?.id:', data.data?.id);
            console.log('📦 data.id:', data.id);

            // Get registration ID from response
            const regId = data.data?.id || data.id;
            console.log('🔍 Registration ID extracted:', regId);
            console.log('🔍 Registration ID type:', typeof regId);
            console.log('🔍 Registration ID value:', JSON.stringify(regId));
            
            // Convert to string if needed
            const regIdString = regId ? String(regId) : null;
            console.log('🔍 Registration ID as string:', regIdString);
            console.log('🔍 regIdString truthy?', !!regIdString);
            
            if (regIdString) {
                // Generate URL for registration detail
                const baseUrl = window.location.origin;
                const detailUrl = `${baseUrl}/registration/${regIdString}`;
                console.log('🔗 Registration URL:', detailUrl);
                
                // Set all states first
                console.log('📝 Setting registrationId state to:', regIdString);
                setRegistrationId(regIdString);
                
                console.log('📝 Setting registrationUrl state to:', detailUrl);
                setRegistrationUrl(detailUrl);
                
                // Show modal immediately - wrap in try-catch to prevent errors from blocking
                try {
                    console.log('🎯 Attempting to show QR modal...');
                    
                    // Method 1: Immediate
                    setShowQRModal(true);
                    console.log('✅ setShowQRModal(true) called immediately');
                    
                    // Method 2: requestAnimationFrame (next frame)
                    requestAnimationFrame(() => {
                        console.log('✅ setShowQRModal(true) called via requestAnimationFrame');
                        setShowQRModal(true);
                    });
                    
                    // Method 3: setTimeout (fallback)
                    setTimeout(() => {
                        console.log('✅ setShowQRModal(true) called via setTimeout');
                        setShowQRModal(true);
                    }, 50);
                } catch (error) {
                    console.error('❌ Error showing QR modal:', error);
                    // Still try to show modal even if there's an error
                    setShowQRModal(true);
                }
            } else {
                console.error('❌ No registration ID in response:', data);
                alert('Registration successful, but could not generate QR code. Please contact support.');
            }

            const detailLink = `${window.location.origin}/registration/${data.data.id}`;
            const dataUrl = await QRCode.toDataURL(detailLink, {
                margin: 1,
                width: 240
            });
            setQrData({ id: data.data.id, dataUrl, detailLink });

            // Show success feedback
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);

            // Reset form after successful submission (but keep modal open)
            setFormData({
                fullName: '',
                companyName: '',
                whatsappNumber: '',
                email: '',
                foodRestriction: '',
                allergies: '',
                confirmationAttendance: '',
                numberOfPeople: '1'
            });
            
            setIsSubmitting(false);

        } catch (error) {
            console.error('Submission error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                endpoint: API_ENDPOINTS.REGISTRATIONS
            });
            
            setIsSubmitting(false);

            // More specific error message
            let errorMsg = 'Sorry, there was an error submitting your registration.';
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMsg = 'Network error: Cannot connect to server. Please check your connection and try again.';
            } else if (error.message.includes('CORS')) {
                errorMsg = 'CORS error: Server configuration issue. Please contact administrator.';
            } else if (error.message) {
                errorMsg = `Error: ${error.message}`;
            }

            alert(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Debug: Log state changes for QR modal
    useEffect(() => {
        console.log('QR Modal State Changed:');
        console.log('  showQRModal:', showQRModal);
        console.log('  registrationId:', registrationId);
        console.log('  registrationUrl:', registrationUrl);
        
        if (showQRModal) {
            console.log('✅ QR Modal should be visible NOW!');
            // Force a re-render to ensure modal appears
            const modalElement = document.querySelector('[data-qr-modal]');
            if (modalElement) {
                console.log('✅ Modal element found in DOM');
            } else {
                console.warn('⚠️ Modal element NOT found in DOM');
            }
        }
    }, [showQRModal, registrationId, registrationUrl]);

    const downloadQRCode = () => {
        try {
            // Get the SVG element
            const svgElement = qrCodeRef.current?.querySelector('svg');
            if (!svgElement) {
                alert('QR code not found. Please try again.');
                return;
            }

            // Create a canvas to render the SVG
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // Create an image to load the SVG
            const img = new Image();
            img.onload = () => {
                // Set canvas size with padding
                const padding = 40;
                canvas.width = img.width + padding * 2;
                canvas.height = img.height + padding * 2;

                // Fill white background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the QR code image
                ctx.drawImage(img, padding, padding);

                // Convert canvas to blob and download
                canvas.toBlob((blob) => {
                    if (blob) {
                        const downloadUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        // Use first 8 chars of UUID for filename (shorter and cleaner)
                        const idForFilename = registrationId ? registrationId.substring(0, 8) : 'code';
                        link.download = `registration-qr-${idForFilename}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(downloadUrl);
                    }
                }, 'image/png');

                URL.revokeObjectURL(url);
            };
            img.onerror = () => {
                alert('Failed to generate QR code image. Please try again.');
                URL.revokeObjectURL(url);
            };
            img.src = url;
        } catch (error) {
            console.error('Error downloading QR code:', error);
            alert('Failed to download QR code. Please try again.');
        }
    };

    return (
        <section id="wishes" className="min-h-screen relative overflow-hidden ">
            {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

            {/* Background Watermark Pattern */}
            {/* <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 text-9xl font-bold text-blue-600 transform rotate-12">
                    {config.data.groomName}
                </div>
                <div className="absolute bottom-20 left-10 text-9xl font-bold text-blue-600 transform -rotate-12">
                    {config.data.brideName}
                </div>
            </div> */}

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Header Logo */}
                {/* <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-lg">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold">K</span>
                        </div>
                        <div className="text-left">
                            <div className="text-2xl font-bold tracking-tight">{config.data.groomName}</div>
                            <div className="text-sm font-medium opacity-90">{config.data.brideName}</div>
                        </div>
                    </div>
                </motion.div> */}
                {/* Registration Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl mx-auto"
                >
                    {/* Form Title */}
                    <div className="text-center mb-8 space-y-2">
                        <h1 className="text-4xl md:text-5xl font-serif text-secondary uppercase tracking-[0.06em]">
                            Registration
                        </h1>
                        <p className="text-lg text-secondary font-medium">
                            You have confirmed attendance
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-secondary font-serif font-semibold text-base sm:text-lg tracking-[0.05em] mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="AAA"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Company Name */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="block text-secondary font-serif font-semibold text-base sm:text-lg tracking-[0.05em] mb-2">
                                Company Name
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="PT XXXXXXX"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Whatsapp Number */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className="block text-secondary font-serif font-semibold text-base sm:text-lg tracking-[0.05em] mb-2">
                                Whatsapp Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="whatsappNumber"
                                    value={formData.whatsappNumber}
                                    onChange={handleInputChange}
                                    placeholder="08XXXXXXXX"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Email Address */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label className="block text-secondary font-serif font-semibold text-base sm:text-lg tracking-[0.05em] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="AAAA@GMAIL.COM"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Food Restriction */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <label className="block text-secondary font-serif font-semibold text-base sm:text-lg tracking-[0.05em] mb-2">
                                Food Restriction
                            </label>
                            <div className="relative">
                                <UtensilsCrossed className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <select
                                    name="foodRestriction"
                                    value={formData.foodRestriction}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Select food preference...</option>
                                    <option value="VEGAN">VEGAN</option>
                                    <option value="NON VEGAN">NON VEGAN</option>
                                    <option value="VEGETARIAN">VEGETARIAN</option>
                                    <option value="NO RESTRICTION">NO RESTRICTION</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>

                        {/* Allergies */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                            <label className="block text-secondary font-serif font-semibold text-base sm:text-lg tracking-[0.05em] mb-2">
                                Allergies
                            </label>
                            <div className="relative">
                                <AlertCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <select
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Do you have allergies?</option>
                                    <option value="YES">YES</option>
                                    <option value="NO">NO</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>

                        {/* Confirmation Attendance */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0 }}
                        >
                            <label className="block text-secondary font-serif font-semibold text-base sm:text-lg tracking-[0.05em] mb-2">
                                Confirmation Attendance
                            </label>
                            <div className="relative">
                                <CheckCircle2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <select
                                    name="confirmationAttendance"
                                    value={formData.confirmationAttendance}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Will you attend?</option>
                                    <option value="YES">YES</option>
                                    <option value="NO">NO</option>
                                    <option value="MAYBE">MAYBE</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>

                        {/* How many people */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                        >
                            <label className="block text-secondary font-serif font-semibold text-base sm:text-lg tracking-[0.05em] mb-2">
                                How many people will come
                            </label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="numberOfPeople"
                                    value={formData.numberOfPeople}
                                    onChange={handleInputChange}
                                    min="1"
                                    placeholder="1"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            className={`relative w-full py-5 text-lg font-semibold text-white rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden
                                ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90'}`}
                        >
                            {!isSubmitting && (
                                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary to-primary/90 opacity-0 hover:opacity-100 transition-opacity duration-200" />
                            )}
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-6 h-6" />
                                    <span>SUBMIT</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    {qrData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 bg-white/90 border border-primary/20 rounded-2xl shadow-lg p-6 text-center space-y-3"
                        >
                            <h3 className="text-xl font-semibold text-secondary">Scan &amp; Save Registration QR</h3>
                            <p className="text-secondary text-sm">
                                QR ini berisi tautan detail registrasi Anda. Simpan atau unduh untuk ditunjukkan saat acara.
                            </p>
                            <div className="flex justify-center">
                                <img
                                    src={qrData.dataUrl}
                                    alt="Registration QR"
                                    className="w-48 h-48 object-contain"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <a
                                    href={qrData.dataUrl}
                                    download={`registration-${qrData.id}.png`}
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                                >
                                    Download QR
                                </a>
                                <a
                                    href={qrData.detailLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition"
                                >
                                    Buka Link
                                </a>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
            <BottomOrnaments />

            {/* QR Code Modal */}
            {showQRModal && (
                <div 
                    data-qr-modal="true"
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setShowQRModal(false)}
                    style={{ zIndex: 9999, position: 'fixed' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Registration Successful!</h3>
                                <p className="text-gray-600 text-sm mt-1">Scan QR code to view your registration</p>
                            </div>
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center space-y-4 mb-6">
                            <div 
                                ref={qrCodeRef}
                                className="bg-white p-4 rounded-xl border-2 border-gray-200 flex items-center justify-center"
                            >
                                {registrationUrl ? (
                                    <QRCode
                                        value={registrationUrl}
                                        size={256}
                                        level="H"
                                        includeMargin={true}
                                    />
                                ) : (
                                    <div className="text-gray-500 py-20">Generating QR code...</div>
                                )}
                            </div>
                            <div className="text-center w-full">
                                <p className="text-sm text-gray-600 mb-2">
                                    Registration ID: {registrationId ? (
                                        <span className="font-mono text-xs">{registrationId.substring(0, 8)}...</span>
                                    ) : (
                                        <span className="text-red-500">Not available</span>
                                    )}
                                </p>
                                {registrationUrl ? (
                                    <a
                                        href={registrationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm break-all inline-block max-w-full"
                                    >
                                        {registrationUrl}
                                    </a>
                                ) : (
                                    <p className="text-gray-500 text-sm">URL not available</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <button
                                    onClick={downloadQRCode}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download QR
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(registrationUrl);
                                        alert('Link copied to clipboard!');
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Copy Link
                                </button>
                            </div>
                            <button
                                onClick={() => setShowQRModal(false)}
                                className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    )
}
