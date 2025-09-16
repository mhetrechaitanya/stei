"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Users, Clock, ArrowRight, PlayCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Workshop {
  id: string
  name: string
  description: string
  image: string
  fee: number
  sessions_r: number
  duration_v: string
  duration_u: string
  category_id: string
  slug: string
}

export default function FreeWebinarsSection() {
  const [freeWorkshops, setFreeWorkshops] = useState<Workshop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFreeWorkshops = async () => {
      try {
        const response = await fetch('/api/workshops')
        if (response.ok) {
          const data = await response.json()
          // Filter workshops with fee = 0
          const free = data.data?.filter((workshop: Workshop) => workshop.fee === 0) || []
          setFreeWorkshops(free)
        }
      } catch (error) {
        console.error('Error fetching free workshops:', error)
        // Fallback to sample free workshops
        setFreeWorkshops([
          {
            id: "free-1",
            name: "Speak to Impress: Master the Art of Presenting & Communicating with Impact",
            description: "We are delighted to invite you to our free webinar, Speak to Impress: Master the Art of Presenting & Communicating with Impact. In just 60 minutes, you'll gain practical strategies to elevate your presentation and communication skills.",
            image: "/public-speaking-stage.png",
            fee: 0,
            sessions_r: 1,
            duration_v: "1",
            duration_u: "hour",
            category_id: "Communication",
            slug: "speak-to-impress-webinar"
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFreeWorkshops()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-red-100 rounded-full opacity-20"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-32 h-32 bg-red-200 rounded-full opacity-20"
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
        />
        <motion.div
          className="absolute top-1/2 left-10 w-16 h-16 bg-red-300 rounded-full opacity-20"
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
        />
      </div>

      <div className="relative z-10">
        {/* Centered Image Container */}
        <motion.div
          className="flex justify-center items-center py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-200 hover:shadow-2xl transition-shadow duration-300 relative">
            {/* Fixed size container for image */}
            <div className="w-[600px] h-[800px] mx-auto rounded-xl overflow-hidden bg-gray-50">
              <Image
                src="/images/banner-2.jpg"
                alt="Speak to Impress - Master Communication & Impact"
                width={600}
                height={800}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-100 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-red-200 rounded-full opacity-60"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
