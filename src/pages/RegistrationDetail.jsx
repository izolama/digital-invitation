import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    HelpCircle,
    User,
    Building2,
    Phone,
    Mail,
    UtensilsCrossed,
    AlertCircle,
    Users as UsersIcon,
    Clock,
    ArrowLeft
} from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

export default function RegistrationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRegistration();
    }, [id]);

    const fetchRegistration = async () => {
        try {
            setLoading(true);
            // Use public endpoint
            const response = await fetch(API_ENDPOINTS.REGISTRATION_DETAIL(id), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch registration');
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                setRegistration(result.data);
            } else {
                throw new Error('Registration not found');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'YES':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'NO':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'MAYBE':
                return <HelpCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'YES':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'NO':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'MAYBE':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !registration) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The registration you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 mb-6 shadow-lg"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-4 flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    <h1 className="text-3xl font-bold">Registration Details</h1>
                    <p className="text-blue-100 mt-2">ID: #{registration.id}</p>
                </motion.div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Personal Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 shadow-lg"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Full Name</label>
                                <p className="text-gray-900 font-semibold mt-1">{registration.fullName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Company Name</label>
                                <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-500" />
                                    {registration.companyName}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-lg"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-purple-600" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">WhatsApp Number</label>
                                <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <a 
                                        href={`https://wa.me/${registration.whatsappNumber.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {registration.whatsappNumber}
                                    </a>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email Address</label>
                                <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <a 
                                        href={`mailto:${registration.email}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {registration.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Event Preferences */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 shadow-lg"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                            Event Preferences
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Food Restriction</label>
                                <p className="text-gray-900 font-semibold mt-1">{registration.foodRestriction}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Allergies</label>
                                <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2">
                                    {registration.allergies === 'YES' ? (
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                    {registration.allergies}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Attendance Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-lg"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-green-600" />
                            Attendance Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Confirmation Status</label>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(registration.confirmationAttendance)}`}>
                                        {getStatusIcon(registration.confirmationAttendance)}
                                        {registration.confirmationAttendance}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Number of Guests</label>
                                <p className="text-gray-900 font-semibold mt-1 flex items-center gap-2 text-2xl">
                                    <UsersIcon className="w-5 h-5 text-gray-500" />
                                    {registration.numberOfPeople} {registration.numberOfPeople === 1 ? 'person' : 'people'}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Timestamp */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-lg"
                    >
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">Registered on:</span>
                            <span>{new Date(registration.createdAt).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

