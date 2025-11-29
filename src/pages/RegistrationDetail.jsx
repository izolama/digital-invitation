import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { API_ENDPOINTS } from '@/config/api';

const RegistrationDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError('');
        
        const url = API_ENDPOINTS.REGISTRATION_DETAIL(id);
        console.log('Fetching registration from:', url);
        
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch: ${res.status}`);
        }
        
        const json = await res.json();
        console.log('Registration data received:', json);
        
        if (json.success && json.data) {
          setData(json.data);
        } else {
          throw new Error(json.error || 'Gagal memuat data');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-white via-primary/5 to-white">
      <div className="w-full max-w-2xl bg-white/90 border border-primary/20 rounded-2xl shadow-lg p-6 sm:p-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-semibold text-secondary text-center mb-6"
        >
          Detail Registrasi
        </motion.h1>

        {loading && <p className="text-center text-secondary">Memuat data...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {data && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 text-secondary mb-6"
            >
              <DetailRow label="Nama Lengkap" value={data.fullName || data.full_name} />
              <DetailRow label="Perusahaan" value={data.companyName || data.company_name} />
              <DetailRow label="WhatsApp" value={data.whatsappNumber || data.whatsapp_number} />
              <DetailRow label="Email" value={data.email} />
              <DetailRow label="Food Restriction" value={data.foodRestriction || data.food_restriction} />
              <DetailRow label="Allergies" value={data.allergies} />
              <DetailRow label="Konfirmasi Kehadiran" value={data.confirmationAttendance || data.confirmation_attendance} />
              <DetailRow label="Jumlah Orang" value={data.numberOfPeople || data.number_of_people} />
              <DetailRow
                label="Tanggal Dibuat"
                value={formatDate(data.createdAt || data.created_at)}
              />
            </motion.div>
            
            {/* QR Code Section */}
            {currentUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 pt-6 border-t border-primary/20"
              >
                <h2 className="text-lg font-semibold text-secondary text-center mb-4">
                  QR Code Registrasi
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-xl border-2 border-primary/20">
                    <QRCode
                      value={currentUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-secondary text-center">
                    Scan QR code ini untuk melihat detail registrasi
                  </p>
                  <p className="text-xs text-gray-500 text-center break-all px-4">
                    {currentUrl}
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const DetailRow = ({ label, value }) => {
  // Handle empty values
  const displayValue = value !== null && value !== undefined && value !== '' ? String(value) : '-';
  
  return (
    <div className="flex justify-between gap-4 text-sm sm:text-base border-b border-primary/10 pb-2">
      <span className="font-semibold">{label}</span>
      <span className="text-right whitespace-pre-wrap">{displayValue}</span>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

export default RegistrationDetail;
