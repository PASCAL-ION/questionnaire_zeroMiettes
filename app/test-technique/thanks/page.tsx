'use client'

import { motion } from 'framer-motion'
// import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#113532] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-[#113532] mb-4">
          Merci pour ta participation !
        </h1>
        <p className="text-[#113532] mb-6">
          Nous avons bien reçu tes réponses. Nous te contacterons rapidement si tu corresponds au projet.
        </p>
      </motion.div>
    </div>
  )
}