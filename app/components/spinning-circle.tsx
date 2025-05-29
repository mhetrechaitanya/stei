"use client"
import { motion } from "framer-motion"

const SpinningCircle = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div
        className="w-32 h-32 border-4 border-black rounded-full flex items-center justify-center relative"
        animate={{ rotate: 360 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "linear" }}
      >
        <span className="text-lg font-bold">stei</span>
      </motion.div>
      <p className="mt-4 text-xl font-semibold">Empowering Individuals</p>
    </div>
  )
}

export default SpinningCircle
