import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LogOut,
    Users,
    CheckCircle,
    XCircle,
    HelpCircle,
    Search,
    Download,
    RefreshCw,
    Filter,
    Calendar,
    X,
    User,
    Building2,
    Phone,
    Mail,
    UtensilsCrossed,
    AlertCircle,
    Users as UsersIcon,
    Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import config from '@/config/config';
import { API_ENDPOINTS } from '@/config/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [backendStats, setBackendStats] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user && user.token) {
            fetchRegistrations();
        }
    }, [user, searchTerm, filterStatus]);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            // Build query parameters for search and filter
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
            params.append('page', '1');
            params.append('limit', '1000'); // Get all for now, can add pagination later
            
            const url = `${API_ENDPOINTS.ADMIN_REGISTRATIONS}${params.toString() ? '?' + params.toString() : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch`);
            }

            const result = await response.json();
            
            // Backend returns: { success: true, data: [...], pagination: {...}, stats: {...} }
            if (result.success && result.data) {
                // Map database field names to frontend format
                const mappedData = result.data.map(reg => ({
                    id: reg.id,
                    fullName: reg.full_name,
                    companyName: reg.company_name,
                    whatsappNumber: reg.whatsapp_number,
                    email: reg.email,
                    foodRestriction: reg.food_restriction,
                    allergies: reg.allergies,
                    confirmationAttendance: reg.confirmation_attendance,
                    numberOfPeople: reg.number_of_people,
                    createdAt: reg.created_at
                }));
                
                setRegistrations(mappedData);
                
                // Store backend stats for accurate statistics
                if (result.stats) {
                    setBackendStats(result.stats);
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Show error but don't use mock data in production
            setRegistrations([]);
            alert(`Error loading registrations: ${error.message}`);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleRowClick = (registration) => {
        setSelectedRegistration(registration);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRegistration(null);
    };

    const handleRowClick = (registration) => {
        setSelectedRegistration(registration);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRegistration(null);
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

    // Backend already handles search and filter, but we can do additional client-side filtering if needed
    // For now, use registrations directly since backend handles filtering
    const filteredRegistrations = registrations;

    // Use backend stats if available (more accurate), otherwise calculate from filtered data
    const stats = backendStats ? {
        total: backendStats.total || 0,
        confirmed: backendStats.confirmed || 0,
        declined: backendStats.declined || 0,
        maybe: backendStats.maybe || 0,
        totalGuests: backendStats.totalGuests || 0
    } : {
        total: registrations.length,
        confirmed: registrations.filter(r => r.confirmationAttendance === 'YES').length,
        declined: registrations.filter(r => r.confirmationAttendance === 'NO').length,
        maybe: registrations.filter(r => r.confirmationAttendance === 'MAYBE').length,
        totalGuests: registrations.reduce((sum, r) => sum + parseInt(r.numberOfPeople || 0), 0)
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Company', 'WhatsApp', 'Email', 'Food', 'Allergies', 'Attendance', 'Guests', 'Date'];
        const rows = filteredRegistrations.map(r => [
            r.fullName,
            r.companyName,
            r.whatsappNumber,
            r.email,
            r.foodRestriction,
            r.allergies,
            r.confirmationAttendance,
            r.numberOfPeople,
            new Date(r.createdAt).toLocaleString()
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <span className="text-2xl font-bold">K</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{config.data.groomName}</h1>
                                <p className="text-sm opacity-90">Admin Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs opacity-75">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Registrations</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                            </div>
                            <Users className="w-10 h-10 text-blue-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Confirmed</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.confirmed}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Declined</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.declined}</p>
                            </div>
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Maybe</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.maybe}</p>
                            </div>
                            <HelpCircle className="w-10 h-10 text-yellow-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Guests</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalGuests}</p>
                            </div>
                            <Users className="w-10 h-10 text-purple-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 flex gap-4 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search name, company, or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                />
                            </div>

                            {/* Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-8 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="YES">Confirmed</option>
                                    <option value="NO">Declined</option>
                                    <option value="MAYBE">Maybe</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={fetchRegistrations}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh</span>
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Food</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Allergies</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold">Guests</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredRegistrations.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                                No registrations found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRegistrations.map((reg, index) => (
                                            <motion.tr
                                                key={reg.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-blue-50 transition-colors cursor-pointer"
                                                onClick={() => handleRowClick(reg)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-800">{reg.fullName}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{reg.companyName}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">{reg.whatsappNumber}</div>
                                                    <div className="text-xs text-gray-500">{reg.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                                        {reg.foodRestriction}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        reg.allergies === 'YES' 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {reg.allergies}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        {getStatusIcon(reg.confirmationAttendance)}
                                                        <span className="text-sm font-medium">{reg.confirmationAttendance}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-medium">{reg.numberOfPeople}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-1 text-gray-600 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{new Date(reg.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(reg.createdAt).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {!loading && (
                    <div className="mt-4 text-center text-gray-600 text-sm">
                        Showing {filteredRegistrations.length} of {registrations.length} registrations
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {isModalOpen && selectedRegistration && (
                <RegistrationDetailModal
                    registration={selectedRegistration}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

// Registration Detail Modal Component
function RegistrationDetailModal({ registration, onClose }) {
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

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold">Registration Details</h2>
                        <p className="text-blue-100 text-sm mt-1">ID: #{registration.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
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
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
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
                    </div>

                    {/* Event Preferences */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
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
                    </div>

                    {/* Attendance Information */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
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
                    </div>

                    {/* Timestamp */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
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
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl flex justify-end gap-3 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

