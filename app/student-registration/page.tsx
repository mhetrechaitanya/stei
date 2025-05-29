"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import RegistrationDebug from "./debug"
import RegistrationHeader from "./header"

export default function StudentRegistration() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/student-registration/confirmation"

  // Initialize form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    status: "pending",
    email_consent: false,
    joined_date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState({ type: "", message: "" })

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required"
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = "First name must be at least 2 characters"
    } else if (!/^[A-Za-z]+$/.test(formData.first_name.trim())) {
      newErrors.first_name = "First name must contain only alphabetic characters"
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters"
    } else if (!/^[A-Za-z]+$/.test(formData.last_name.trim())) {
      newErrors.last_name = "Last name must contain only alphabetic characters"
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address"
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address (at least 10 characters)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate individual field
  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case "first_name":
        if (!value.trim()) {
          newErrors.first_name = "First name is required"
        } else if (value.trim().length < 2) {
          newErrors.first_name = "First name must be at least 2 characters"
        } else if (!/^[A-Za-z]+$/.test(value.trim())) {
          newErrors.first_name = "First name must contain only alphabetic characters"
        } else {
          delete newErrors.first_name
        }
        break

      case "last_name":
        if (!value.trim()) {
          newErrors.last_name = "Last name is required"
        } else if (value.trim().length < 2) {
          newErrors.last_name = "Last name must be at least 2 characters"
        } else if (!/^[A-Za-z]+$/.test(value.trim())) {
          newErrors.last_name = "Last name must contain only alphabetic characters"
        } else {
          delete newErrors.last_name
        }
        break

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required"
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value.trim())) {
          newErrors.email = "Please enter a valid email address"
        } else {
          delete newErrors.email
        }
        break

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Phone number is required"
        } else if (!/^[0-9]{10}$/.test(value.trim())) {
          newErrors.phone = "Please enter a valid 10-digit phone number"
        } else {
          delete newErrors.phone
        }
        break

      case "address":
        if (!value.trim()) {
          newErrors.address = "Address is required"
        } else if (value.trim().length < 10) {
          newErrors.address = "Please enter a complete address (at least 10 characters)"
        } else {
          delete newErrors.address
        }
        break

      default:
        break
    }

    setErrors(newErrors)
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Validate the field as it changes
    validateField(name, type === "checkbox" ? checked : value)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0]
      const errorElement = document.getElementById(firstErrorField)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        errorElement.focus()
      }
      return
    }

    setIsSubmitting(true)
    setSubmitMessage({ type: "", message: "" })

    try {
      // Initialize Supabase client only when needed
      const supabase = createClientComponentClient()

      // Insert the student data into the students table
      const { data, error } = await supabase
        .from("students")
        .insert([
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            status: formData.status,
            email_consent: formData.email_consent,
            joined_date: formData.joined_date,
          },
        ])
        .select()

      if (error) throw error

      // Success message
      setSubmitMessage({
        type: "success",
        message: "Registration successful! Thank you for registering.",
      })
       // Send welcome email
       try {
        const res = await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            first_name: formData.first_name,
          }),
        })

        const emailResult = await res.json()
        if (!res.ok || !emailResult.success) {
          console.warn("Email not sent:", emailResult.error)
        }
      } catch (emailError) {
        console.error("Email error:", emailError)
      }
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        status: "pending",
        email_consent: false,
        joined_date: new Date().toISOString().split("T")[0],
      })

      // Redirect to the specified page or confirmation page after a delay
      setTimeout(() => {
        router.push(redirectTo)
      }, 1500)
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitMessage({
        type: "error",
        message: "There was an error submitting your registration. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <RegistrationHeader />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#D40F14] py-6 px-8">
              <h1 className="text-2xl font-bold text-white">Register Me</h1>
              <p className="text-white/80 mt-2">Please fill in the form below to register</p>
            </div>

            <form onSubmit={handleSubmit} className="py-8 px-8">
              {submitMessage.message && (
                <div
                  className={`mb-6 p-4 rounded ${
                    submitMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitMessage.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name Field */}
                <div className="space-y-2">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={(e) => validateField("first_name", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] ${
                      errors.first_name ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter your first name (letters only)"
                    aria-invalid={errors.first_name ? "true" : "false"}
                    aria-describedby={errors.first_name ? "first_name-error" : undefined}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1" id="first_name-error" role="alert">
                      {errors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="space-y-2">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    onBlur={(e) => validateField("last_name", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] ${
                      errors.last_name ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter your last name (letters only)"
                    aria-invalid={errors.last_name ? "true" : "false"}
                    aria-describedby={errors.last_name ? "last_name-error" : undefined}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1" id="last_name-error" role="alert">
                      {errors.last_name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={(e) => validateField("email", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] ${
                      errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter your email address"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1" id="email-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={(e) => validateField("phone", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] ${
                      errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter your 10-digit phone number"
                    maxLength={10}
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1" id="phone-error" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Address Field */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={(e) => validateField("address", e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14] ${
                      errors.address ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Enter your complete address"
                    aria-invalid={errors.address ? "true" : "false"}
                    aria-describedby={errors.address ? "address-error" : undefined}
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1" id="address-error" role="alert">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Email Consent Checkbox */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="email_consent"
                      name="email_consent"
                      checked={formData.email_consent}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#D40F14] focus:ring-[#D40F14] border-gray-300 rounded"
                    />
                    <label htmlFor="email_consent" className="ml-2 block text-sm text-gray-700">
                      I consent to receive emails about news, updates, and promotional offers
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-6 p-4 mb-4 bg-red-50 border border-red-200 rounded-md" role="alert">
                  <p className="font-medium text-red-700">Please correct the following errors:</p>
                  <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className="px-6 py-3 bg-[#D40F14] text-white font-medium rounded-md hover:bg-[#B00D10] focus:outline-none focus:ring-2 focus:ring-[#D40F14] focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Register Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Only show debug panel in development */}
        {process.env.NODE_ENV === "development" && <RegistrationDebug />}
      </div>
    </>
  )
}
