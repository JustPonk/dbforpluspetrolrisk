'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Building2, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003B7A] via-[#0066CC] to-blue-600 flex items-center justify-center overflow-hidden">
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <Shield className="w-32 h-32 mx-auto text-white mb-4" />
          <h1 className="text-6xl font-bold text-white mb-4">
            Pluspetrol
          </h1>
          <p className="text-2xl text-blue-100 mb-8">
            Sistema de Evaluación de Seguridad Residencial
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex gap-8 justify-center mb-12"
        >
          <div className="text-white">
            <Building2 className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg">11 Residencias</p>
          </div>
          <div className="text-white">
            <Shield className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg">Evaluadas</p>
          </div>
          <div className="text-white">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg">Análisis Completo</p>
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard')}
          className="px-12 py-4 bg-white text-[#003B7A] text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Comenzar Presentación
        </motion.button>
      </div>

      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-white opacity-10 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-10 rounded-full"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
