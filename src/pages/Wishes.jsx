import { motion } from 'framer-motion'
import Confetti from 'react-confetti';
import {
    User,
    Building2,
    Phone,
    Mail,
    UtensilsCrossed,
    AlertCircle,
    CheckCircle2,
    Users,
    Send
} from 'lucide-react'
import { useState } from 'react';
import config from '@/config/config';
import { API_ENDPOINTS } from '@/config/api';
import BottomOrnaments from '@/components/BottomOrnaments';

export default function Wishes() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            console.log('Registration successful:', data);
            
            // Show success feedback
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            
            // Reset form after successful submission
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

            // Optional: Show success message to user
            alert('Thank you for registering! We look forward to seeing you at the event.');
            
        } catch (error) {
            console.error('Submission error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                endpoint: API_ENDPOINTS.REGISTRATIONS
            });
            
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
    return (
        <section id="wishes" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50">
            {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
            
            {/* Background Watermark Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 text-9xl font-bold text-blue-600 transform rotate-12">
                    {config.data.groomName}
                </div>
                <div className="absolute bottom-20 left-10 text-9xl font-bold text-blue-600 transform -rotate-12">
                    {config.data.brideName}
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Header Logo */}
                <motion.div
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
                </motion.div>
                {/* Registration Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl mx-auto"
                >
                    {/* Form Title */}
                    <div className="text-center mb-8 space-y-2">
                        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                            REGISTRATION
                        </h1>
                        <p className="text-lg text-gray-600 font-medium">You have confirmed attendance</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-blue-900 font-bold text-lg mb-2">
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
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
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
                            <label className="block text-blue-900 font-bold text-lg mb-2">
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
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
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
                            <label className="block text-blue-900 font-bold text-lg mb-2">
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
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
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
                            <label className="block text-blue-900 font-bold text-lg mb-2">
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
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
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
                            <label className="block text-blue-900 font-bold text-lg mb-2">
                                Food Restriction
                            </label>
                            <div className="relative">
                                <UtensilsCrossed className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <select
                                    name="foodRestriction"
                                    value={formData.foodRestriction}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
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
                            <label className="block text-blue-900 font-bold text-lg mb-2">
                                Allergies
                            </label>
                            <div className="relative">
                                <AlertCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <select
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
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
                            <label className="block text-blue-900 font-bold text-lg mb-2">
                                Confirmation Attendance
                            </label>
                            <div className="relative">
                                <CheckCircle2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <select
                                    name="confirmationAttendance"
                                    value={formData.confirmationAttendance}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
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
                            <label className="block text-blue-900 font-bold text-lg mb-2">
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
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
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
                            className={`w-full py-5 text-xl font-bold text-white rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2
                                ${isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'}`}
                        >
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
                </motion.div>
            </div>
            <BottomOrnaments />
        </section>
    )
}
