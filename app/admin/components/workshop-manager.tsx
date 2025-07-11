"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Save, X, Edit, Check, RefreshCw } from "lucide-react"
import type { Workshop } from "@/lib/types"
import { TABLES } from "@/lib/supabase-config"

interface NewWorkshop {
  name: string
  description: string
  fee: number
  sessions_r: number
  duration_v: string
  duration_u: string
  capacity: number
  category_id: string
  image: string
  slug: string
  instructor: string
  status: string
  minutes_p: number
  start_date: string
  session_start_time: string
}

interface Mentor {
  id: string
  name: string
  title?: string
  email?: string
}

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newWorkshop, setNewWorkshop] = useState<NewWorkshop>({
    name: "",
    description: "",
    fee: 4999,
    sessions_r: 4,
    duration_v: "2 hours",
    duration_u: "per session",
    capacity: 15,
    category_id: "",
    image: "",
    slug: "",
    instructor: "",
    status: "active",
    minutes_p: 120,
    start_date: "",
    session_start_time: "10:00 AM",
  })
  const [isAdding, setIsAdding] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  // Fetch workshops
  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/workshops")
      if (!response.ok) {
        throw new Error(`Failed to fetch workshops: ${response.status}`)
      }

      const data = await response.json()
      setWorkshops(data || [])
    } catch (error: any) {
      console.error("Error fetching workshops:", error.message)
      setError("Failed to load workshops")
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/workshops/categories")
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`)
      }

      const data = await response.json()
      setCategories(data.categories || [])
    } catch (error: any) {
      console.error("Error fetching categories:", error.message)
      // Don't set error state here to avoid blocking the UI
    }
  }

  // Fetch mentors
  const fetchMentors = async () => {
    try {
      const response = await fetch("/api/mentors")
      if (!response.ok) {
        throw new Error(`Failed to fetch mentors: ${response.status}`)
      }

      const data = await response.json()
      setMentors(data || [])
    } catch (error: any) {
      console.error("Error fetching mentors:", error.message)
      // Don't set error state here to avoid blocking the UI
    }
  }

  useEffect(() => {
    fetchWorkshops()
    fetchCategories()
    fetchMentors()
  }, [])

  // Add new workshop
  const handleAddWorkshop = async () => {
    if (!newWorkshop.name || !newWorkshop.description) {
      setError("Workshop name and description are required")
      return
    }

    try {
      // Generate slug if not provided
      if (!newWorkshop.slug) {
        newWorkshop.slug = newWorkshop.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      }

      const response = await fetch("/api/workshops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkshop),
      })

      if (!response.ok) {
        throw new Error(`Failed to add workshop: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        fetchWorkshops() // Refresh the list
        setNewWorkshop({
          name: "",
          description: "",
          fee: 4999,
          sessions_r: 4,
          duration_v: "2 hours",
          duration_u: "per session",
          capacity: 15,
          category_id: "",
          image: "",
          slug: "",
          instructor: "",
          status: "active",
          minutes_p: 120,
          start_date: "",
          session_start_time: "10:00 AM",
        })
        setIsAdding(false)
        showSuccess("Workshop added successfully")
      } else {
        setError(result.error || "Failed to add workshop")
      }
    } catch (error: any) {
      console.error("Error adding workshop:", error.message)
      setError("Failed to add workshop")
    }
  }

  // Start editing a workshop
  const handleStartEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingWorkshop(null)
  }

  // Update workshop
  const handleUpdateWorkshop = async () => {
    if (!editingWorkshop) return

    try {
      const response = await fetch(`/api/workshops/${editingWorkshop.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingWorkshop),
      })

      if (!response.ok) {
        throw new Error(`Failed to update workshop: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setWorkshops(workshops.map((w) => (w.id === editingWorkshop.id ? { ...editingWorkshop, ...result.data } : w)))
        setEditingWorkshop(null)
        showSuccess("Workshop updated successfully")
      } else {
        setError(result.error || "Failed to update workshop")
      }
    } catch (error: any) {
      console.error("Error updating workshop:", error.message)
      setError("Failed to update workshop")
    }
  }

  // Delete workshop
  const handleDeleteWorkshop = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workshop?")) return

    try {
      const response = await fetch(`/api/workshops/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete workshop: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setWorkshops(workshops.filter((workshop) => workshop.id !== id))
        showSuccess("Workshop deleted successfully")
      } else {
        setError(result.error || "Failed to delete workshop")
      }
    } catch (error: any) {
      console.error("Error deleting workshop:", error.message)
      setError("Failed to delete workshop")
    }
  }

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name is required")
      return
    }

    try {
      const response = await fetch("/api/workshops/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: newCategory }),
      })

      if (!response.ok) {
        throw new Error(`Failed to add category: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setCategories([...categories, newCategory])
        setNewCategory("")
        setIsAddingCategory(false)
        showSuccess("Category added successfully")
      } else {
        setError(result.error || "Failed to add category")
      }
    } catch (error: any) {
      console.error("Error adding category:", error.message)
      setError("Failed to add category")
    }
  }

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Manage Workshops</h2>
          <p className="text-sm text-gray-500">Table: {TABLES.WORKSHOPS}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchWorkshops}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            disabled={isAdding}
          >
            <Plus size={16} /> Add New Workshop
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Categories Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Workshop Categories</h3>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1 text-sm"
          >
            <Plus size={14} /> Add Category
          </button>
        </div>

        {isAddingCategory ? (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
              placeholder="Enter new category name"
            />
            <button
              onClick={handleAddCategory}
              className="px-3 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingCategory(false)
                setNewCategory("")
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 mb-4">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
                {category}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No categories defined yet</span>
          )}
        </div>
      </div>

      {/* Add new workshop form */}
      {isAdding && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Add New Workshop</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newWorkshop.name}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="Workshop name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={newWorkshop.slug}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="workshop-slug (auto-generated if empty)"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newWorkshop.description}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
              rows={3}
              placeholder="Workshop description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fee (₹)</label>
              <input
                type="number"
                value={newWorkshop.fee}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, fee: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="4999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sessions</label>
              <input
                type="number"
                value={newWorkshop.sessions_r}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, sessions_r: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                value={newWorkshop.capacity}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={`${newWorkshop.duration_v} ${newWorkshop.duration_u}`}
                onChange={(e) => {
                  const [value, unit] = e.target.value.split(" ");
                  setNewWorkshop({ ...newWorkshop, duration_v: value, duration_u: unit });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="2 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minutes per session</label>
              <input
                type="number"
                value={newWorkshop.minutes_p}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, minutes_p: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                placeholder="120"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={newWorkshop.start_date}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Start Time</label>
              <input
                type="time"
                value={newWorkshop.session_start_time}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, session_start_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newWorkshop.category_id || ""}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <select
              value={newWorkshop.instructor || ""}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, instructor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
            >
              <option value="">Select an instructor</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name} {mentor.title ? `(${mentor.title})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={newWorkshop.image}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsAdding(false)
                setNewWorkshop({
                  name: "",
                  description: "",
                  fee: 4999,
                  sessions_r: 4,
                  duration_v: "2 hours",
                  duration_u: "per session",
                  capacity: 15,
                  category_id: "",
                  image: "",
                  slug: "",
                  instructor: "",
                  status: "active",
                  minutes_p: 120,
                  start_date: "",
                  session_start_time: "10:00 AM",
                })
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddWorkshop}
              className="px-4 py-2 bg-[#D40F14] text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Save size={16} /> Save Workshop
            </button>
          </div>
        </div>
      )}

      {/* Workshops list */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sessions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workshops.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  No workshops found. Add your first workshop!
                </td>
              </tr>
            ) : (
              workshops.map((workshop) => (
                <tr key={workshop.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingWorkshop?.id === workshop.id ? (
                      <input
                        type="text"
                        value={editingWorkshop.name}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, name: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      />
                    ) : (
                      <div className="font-medium text-gray-900">{workshop.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingWorkshop?.id === workshop.id ? (
                      <select
                        value={editingWorkshop.category_id || ""}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, category_id: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {workshop.category_id || "Uncategorized"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingWorkshop?.id === workshop.id ? (
                      <input
                        type="number"
                        value={editingWorkshop.fee}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, fee: Number(e.target.value) })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      />
                    ) : (
                      <div className="text-gray-900">₹{workshop.fee.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingWorkshop?.id === workshop.id ? (
                      <input
                        type="number"
                        value={editingWorkshop.sessions_r}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, sessions_r: Number(e.target.value) })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      />
                    ) : (
                      <div className="text-gray-900">{workshop.sessions_r}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingWorkshop?.id === workshop.id ? (
                      <input
                        type="text"
                        value={`${editingWorkshop.duration_v} ${editingWorkshop.duration_u}`}
                        onChange={(e) => {
                          const [value, unit] = e.target.value.split(" ");
                          setEditingWorkshop({ ...editingWorkshop, duration_v: value, duration_u: unit });
                        }}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      />
                    ) : (
                      <div className="text-gray-900">{`${workshop.duration_v} ${workshop.duration_u}`}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingWorkshop?.id === workshop.id ? (
                      <input
                        type="number"
                        value={editingWorkshop.capacity}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, capacity: Number(e.target.value) })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      />
                    ) : (
                      <div className="text-gray-900">{workshop.capacity}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingWorkshop?.id === workshop.id ? (
                      <select
                        value={editingWorkshop.instructor || ""}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, instructor: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      >
                        <option value="">Select an instructor</option>
                        {mentors.map((mentor) => (
                          <option key={mentor.id} value={mentor.id}>
                            {mentor.name} {mentor.title ? `(${mentor.title})` : ""}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-gray-900">{workshop.instructor ? mentors.find(m => m.id === workshop.instructor)?.name : "N/A"}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingWorkshop?.id === workshop.id ? (
                      <select
                        value={editingWorkshop.status || ""}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, status: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D40F14]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {workshop.status || "N/A"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {editingWorkshop?.id === workshop.id ? (
                        <>
                          <button
                            onClick={handleUpdateWorkshop}
                            className="text-green-600 hover:text-green-900"
                            title="Save changes"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                            title="Cancel editing"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(workshop)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit workshop"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteWorkshop(workshop.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete workshop"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
