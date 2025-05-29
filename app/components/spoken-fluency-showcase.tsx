"use client"

import { SpokenFluencyWorkshop } from "./spoken-fluency-workshop"
import { CheckCircle, Clock, Users } from "lucide-react"

export default function SpokenFluencyShowcase() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          i<span className="text-[#D40F14]">ACE</span> Spoken Fluency
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our flagship English communication workshop designed to transform your speaking skills and boost your
          confidence in professional environments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-4">About This Workshop</h3>
              <p className="mb-4">
                The iACE Spoken Fluency workshop is specifically designed for professionals who want to enhance their
                conversational English skills and build confidence in workplace settings. Whether you're preparing for
                interviews, client meetings, or everyday workplace interactions, this workshop will help you communicate
                more effectively.
              </p>

              <h4 className="text-xl font-semibold mb-3">What You'll Learn</h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Techniques to overcome hesitation and speak with confidence</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Professional vocabulary for various business contexts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Strategies for effective communication in meetings and presentations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Practical exercises to improve pronunciation and fluency</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Techniques for active listening and responding appropriately</span>
                </li>
              </ul>

              <h4 className="text-xl font-semibold mb-3">Workshop Structure</h4>
              <p className="mb-2">This workshop consists of 8 interactive sessions spread over 4 weeks:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>2 sessions per week, 90 minutes each</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Small batch size (max 15 participants) for personalized attention</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#D40F14] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Practical exercises, role plays, and real-world scenarios</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <SpokenFluencyWorkshop />
        </div>
      </div>
    </div>
  )
}
