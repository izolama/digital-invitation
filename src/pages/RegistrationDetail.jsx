import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '@/config/api';

const RegistrationDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.REGISTRATIONS}/${id}`);
        if (!res.ok) {
          throw new Error('Gagal memuat data');
        }
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          throw new Error(json.error || 'Gagal memuat data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 text-secondary"
          >
            <DetailRow label="Nama" value={data.full_name} />
            <DetailRow label="Perusahaan" value={data.company_name} />
            <DetailRow label="WhatsApp" value={data.whatsapp_number} />
            <DetailRow label="Email" value={data.email} />
            <DetailRow label="Food Restriction" value={data.food_restriction} />
            <DetailRow label="Allergies" value={data.allergies} />
            <DetailRow label="Attendance" value={data.confirmation_attendance} />
            <DetailRow label="Jumlah Orang" value={data.number_of_people} />
            <DetailRow
              label="Dibuat"
              value={new Date(data.created_at).toLocaleString()}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 text-sm sm:text-base border-b border-primary/10 pb-2">
    <span className="font-semibold">{label}</span>
    <span className="text-right whitespace-pre-wrap">{value || '-'}</span>
  </div>
);

export default RegistrationDetail;
