import { Calendar, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import config from '@/config/config';
import { formatEventDate } from '@/lib/formatEventDate';
import LogoKBI from '@/images/logo_kbi.png';
import LogoDanantara from '@/images/danantara.png';
import BottomOrnaments from '@/components/BottomOrnaments';

export default function Hero() {
    return (
        <section
            id="home"
            className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20 overflow-hidden text-center"
        >
            {/* Soft gradient background */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-white via-primary/5 to-white" />
            <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-16 w-64 h-64 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-3xl" /> */}

            {/* Top logos pinned to section corners */}
            <div className="absolute inset-x-0 top-4 sm:top-6 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
                <motion.img
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    src={LogoDanantara}
                    alt="Danantara Indonesia"
                    className="h-25 sm:h-20 md:h-20 max-w-[100px] object-contain"
                    loading="lazy"
                />
                <motion.img
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    src={LogoKBI}
                    alt="Krakatau Baja Industri"
                    className="h-25 sm:h-20 md:h-20 max-w-[110px] object-contain"
                    loading="lazy"
                />
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto mt-10 sm:mt-14 pb-16 flex flex-col items-center gap-10 sm:gap-12">
                {/* Main headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 sm:space-y-8 max-w-3xl mx-auto"
                >
                    <div className="space-y-2 sm:space-y-3">
                        <p className="text-secondary uppercase tracking-[0.08em] text-sm sm:text-base font-semibold">
                            {config.data.groomName}
                        </p>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-secondary uppercase tracking-[0.06em]">
                            {config.data.brideName}
                        </h1>
                    </div>

                    <p className="text-secondary text-base sm:text-lg font-medium leading-tight">
                        Join us for an evening of<br />
                        appreciation and connection
                    </p>
                </motion.div>

                {/* Event details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center gap-3 sm:gap-4 text-secondary max-w-2xl mx-auto"
                >
                    <div className="flex items-center gap-2 text-sm sm:text-base font-semibold uppercase tracking-[0.05em]">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span>{formatEventDate(config.data.date, 'full')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-semibold uppercase tracking-[0.05em]">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span>{config.data.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-semibold uppercase tracking-[0.05em]">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span>{config.data.location}</span>
                    </div>
                </motion.div>

                {/* QR to Google Maps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-6 sm:mt-8 flex flex-col items-center gap-3"
                >
                    <div className="text-secondary font-semibold text-sm uppercase tracking-[0.08em]">
                        Scan to open map
                    </div>
                    <div className="p-3 bg-white/80 rounded-2xl shadow-lg border border-primary/10">
                        {(() => {
                            const mapLink = config.data.maps_url && config.data.maps_url.startsWith('http')
                                ? config.data.maps_url
                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.data.location || '')}`;
                            return (
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mapLink)}`}
                                    alt="QR code to open map"
                                    className="w-40 h-40 sm:w-44 sm:h-44 object-contain"
                                    loading="lazy"
                                />
                            );
                        })()}
                    </div>
                </motion.div>
            </div>
            <BottomOrnaments />
        </section>
    );
}
