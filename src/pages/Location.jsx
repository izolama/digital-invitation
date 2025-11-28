import config from "@/config/config";
import { Clock, Navigation as NavigationIcon, MapPin, CalendarCheck, Phone, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion';
import { formatEventDate } from "@/lib/formatEventDate";
import BottomOrnaments from '@/components/BottomOrnaments';

const timeline = [
    { title: 'Registration', time: '18:00 WIB' },
    { title: 'Opening & Talk Show', time: '19:00 WIB' },
    { title: 'Dinner', time: '20:00 WIB' },
    { title: 'Signing & Awarding', time: '20:30 WIB' },
    { title: 'Closing', time: '22:00 WIB' },
];

export default function Location() {
    return (<>
        {/* Location section */}
        <section id="location" className="min-h-screen relative overflow-hidden">
            <div className="container mx-auto px-4 py-20 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center space-y-4 mb-16"
                >

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif text-gray-800"
                    >
                        RUNDOWN
                    </motion.h2>

                    {/* Decorative Divider */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-4 pt-4"
                    >
                        <div className="h-[1px] w-12 bg-rose-200" />
                        <MapPin className="w-5 h-5 text-rose-400" />
                        <div className="h-[1px] w-12 bg-rose-200" />
                    </motion.div>
                </motion.div>

                {/* Location Content */}
                <div className="space-y-3">
                    {timeline.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            className="bg-white/90 rounded-2xl border border-primary/30 shadow-md px-6 py-4 sm:px-8 sm:py-5 flex flex-col items-center text-center"
                        >
                            <span className="text-secondary font-semibold text-lg sm:text-xl uppercase tracking-[0.05em]">
                                {item.title}
                            </span>
                            <span className="text-secondary text-base sm:text-lg font-medium mt-1">
                                {item.time}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
            <BottomOrnaments />
        </section>
    </>)
}
