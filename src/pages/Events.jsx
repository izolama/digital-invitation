import config from '@/config/config';
import { motion } from 'framer-motion';
import BottomOrnaments from '@/components/BottomOrnaments';
import { formatEventDate } from '@/lib/formatEventDate';

export default function Events() {
    return (
        <>
            {/* Event Section */}
            <section id="event" className="min-h-screen relative overflow-hidden font-['Montserrat']">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 container mx-auto px-4 py-20"
                >
                    <div className="max-w-3xl mx-auto text-secondary space-y-8">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="leading-relaxed text-sm sm:text-base"
                        >
                            Dengan hormat, <br />
                            Direksi PT Krakatau Baja Industri bersama ini mengundang Bapak/Ibu untuk hadir dalam acara Customer Gathering 2025, yang akan diselenggarakan pada:
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="bg-white/80 rounded-3xl shadow-lg border border-primary/10 px-5 py-5 sm:px-7 sm:py-7 text-left text-[11px] sm:text-xs"
                        >
                            <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[120px_1fr] gap-x-2 sm:gap-x-4 gap-y-2 leading-relaxed text-secondary">
                                <div className="font-semibold whitespace-nowrap">Hari/Tanggal</div>
                                <div className="flex items-center min-w-0">
                                    <span className="mr-2">:</span>
                                    <span className="whitespace-nowrap truncate">{formatEventDate(config.data.date, 'full')}</span>
                                </div>

                                <div className="font-semibold whitespace-nowrap">Pukul</div>
                                <div className="flex items-center min-w-0">
                                    <span className="mr-2">:</span>
                                    <span className="whitespace-nowrap">{config.data.time}</span>
                                </div>

                                <div className="font-semibold whitespace-nowrap">Tempat</div>
                                <div className="flex items-center min-w-0">
                                    <span className="mr-2">:</span>
                                    <span className="whitespace-nowrap truncate">{config.data.location}</span>
                                </div>

                                <div className="font-semibold whitespace-nowrap">Rangkaian Acara</div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-start gap-2">
                                        <span className="mt-[2px]">•</span>
                                        <span className="whitespace-normal">Appreciation Night</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="mt-[2px]">•</span>
                                        <span className="whitespace-normal">Gala Dinner</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="mt-[2px]">•</span>
                                        <span className="whitespace-normal">Signing Agreement &amp; Awarding Ceremony</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="leading-relaxed text-sm sm:text-base"
                        >
                            Atas perhatian serta kehadiran Bapak/Ibu kami mengucapkan terima kasih.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-center space-y-4 text-sm sm:text-base"
                        >
                            <div className="font-semibold uppercase tracking-[0.08em]">
                                PT KRAKATAU BAJA INDUSTRI
                            </div>
                            <div className="space-y-1">
                                <div className="font-semibold uppercase tracking-[0.08em]">ARIEF PURNOMO</div>
                                <div className="text-xs sm:text-sm">Plt. Direktur Utama</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
                <BottomOrnaments />
            </section>
        </>
    )
}
