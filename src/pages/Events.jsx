import config from '@/config/config';
import { motion } from 'framer-motion';
import BottomOrnaments from '@/components/BottomOrnaments';
import { formatEventDate } from '@/lib/formatEventDate';

export default function Events() {
    return (
        <>
            {/* Event Section */}
            <section id="event" className="min-h-screen relative overflow-hidden">
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
                            className="leading-relaxed text-base sm:text-lg"
                        >
                            Dengan hormat, <br />
                            Direksi PT Krakatau Baja Industri bersama ini mengundang Bapak/Ibu untuk hadir dalam acara Customer Gathering 2025, yang akan diselenggarakan pada:
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="bg-white/80 rounded-3xl shadow-lg border border-primary/10 px-6 py-6 sm:px-8 sm:py-8 space-y-4 text-left"
                        >
                            <div className="flex gap-3 sm:gap-6 text-base sm:text-lg leading-relaxed">
                                <span className="w-28 sm:w-36 font-semibold">Hari/Tanggal</span>
                                <span className="flex-1">: {formatEventDate(config.data.date, 'full')}</span>
                            </div>
                            <div className="flex gap-3 sm:gap-6 text-base sm:text-lg leading-relaxed">
                                <span className="w-28 sm:w-36 font-semibold">Pukul</span>
                                <span className="flex-1">: {config.data.time}</span>
                            </div>
                            <div className="flex gap-3 sm:gap-6 text-base sm:text-lg leading-relaxed">
                                <span className="w-28 sm:w-36 font-semibold">Tempat</span>
                                <span className="flex-1">: {config.data.location}</span>
                            </div>
                            <div className="flex gap-3 sm:gap-6 text-base sm:text-lg leading-relaxed items-start">
                                <span className="w-28 sm:w-36 font-semibold">Rangkaian Acara</span>
                                <div className="flex-1">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Appreciation Night</li>
                                        <li>Gala Dinner</li>
                                        <li>Signing Agreement &amp; Awarding Ceremony</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="leading-relaxed text-base sm:text-lg"
                        >
                            Atas perhatian serta kehadiran Bapak/Ibu kami mengucapkan terima kasih.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-center space-y-6 text-base sm:text-lg"
                        >
                            <div className="font-semibold uppercase tracking-[0.08em]">
                                PT KRAKATAU BAJA INDUSTRI
                            </div>
                            <div className="space-y-1">
                                <div className="font-semibold uppercase tracking-[0.08em]">ARIEF PURNOMO</div>
                                <div className="text-base sm:text-lg">Plt. Direktur Utama</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
                <BottomOrnaments />
            </section>
        </>
    )
}
