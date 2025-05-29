"use client"
import { motion } from "framer-motion"
import SteiText from "./stei-text"

export const CircularTextSpinner = () => {
  return (
    <div className="relative w-full h-full">
      {/* Rotating Circular Text */}
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" }}
      >
        <defs>
          <path id="circlePath" d="M50,50 m-40,0a40,40 0 1,1 80,0a40,40 0 1,1 -80,0" />
        </defs>
        <text fontSize="6" fontWeight="bold" fill="black">
          <textPath href="#circlePath" startOffset="0%">
            EMPOWERING INDIVIDUALS • EMPOWERING INDIVIDUALS •
          </textPath>
        </text>
      </motion.svg>

      {/* STEI in Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <SteiText className="mx-1" />
        </h2>
      </div>
    </div>
  )
}
