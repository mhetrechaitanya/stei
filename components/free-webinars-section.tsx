"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Users, Clock, ArrowRight, PlayCircle } from "lucide-react"
import Link from "next/link"

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
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-6"
            variants={itemVariants}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-sm">FREE WEBINARS</span>
          </motion.div>
          
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            Speak to Impress
            <span className="text-red-600 block">Master Communication & Impact</span>
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4"
            variants={itemVariants}
          >
            Join our free webinar and gain practical strategies to elevate your presentation and communication skills in just 60 minutes. 
            No cost, no commitment - just pure learning and transformation.
          </motion.p>
        </motion.div>

        {isLoading ? (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {freeWorkshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500 opacity-80" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      FREE
                    </span>
                  </div>
                </div>
                
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                    {workshop.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm md:text-base">
                    {workshop.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{workshop.duration_v} {workshop.duration_u}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{workshop.sessions_r} session{workshop.sessions_r > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 capitalize">
                      {workshop.category_id}
                    </span>
                    <Link
                      href={`/workshops/${workshop.slug}`}
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors group-hover:scale-105 transform duration-200 text-sm"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Ready to Master Your Communication Skills?
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Join our free "Speak to Impress" webinar and discover practical strategies to elevate your presentation and communication skills. 
              No registration fees, no hidden costs - just pure learning and growth.
            </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link
                 href="/workshops"
                 className="inline-flex items-center gap-2 border-2 border-red-600 text-red-600 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-semibold text-sm md:text-base"
               >
                 <span>Explore All Workshops</span>
                 <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link
                 href="/workshops?filter=free"
                 className="inline-flex items-center gap-2 bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold group text-sm md:text-base"
               >
                 <span>Register Free Webinars</span>
               </Link>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
