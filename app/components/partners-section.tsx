"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
  {
    id: 1,
    name: "AgriBid",
    logo: "/images/partners/partner1.png"
  },
  {
    id: 2,
    name: "GoAgri", 
    logo: "/images/partners/partner2.png"
  },
  {
    id: 3,
    name: "IdeaBoss",
    logo: "/images/partners/partner3.png"
  },
  {
    id: 4,
    name: "FlyLyte",
    logo: "/images/partners/partner4.png"
  }
]

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

export default function PartnersSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
            variants={itemVariants}
          >
            Our Partners
          </motion.h2>
          <motion.div
            className="h-1 w-24 bg-[#D40F14] mx-auto mb-6"
            variants={itemVariants}
          />
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            We are proud to collaborate with industry leaders who share our vision of empowering individuals through transformative education.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-[#D40F14]/20"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#D40F14] transition-colors">
                  {partner.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
