/**
 * Portfolio Service
 * Handles portfolio API calls
 */

import { fetchWithAuth } from './authService'
import config from '../config/env'

const API_BASE_URL = config.PORTFOLIO_API_URL

export const projectAPI = {
  /**
   * Get all projects
   * @returns {Promise}
   */
  getAll: async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/projects/`)
      if (!response.ok) throw new Error('Failed to fetch projects')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch projects')
    }
  },

  /**
   * Get project by ID
   * @param {number} id - Project ID
   * @returns {Promise}
   */
  getById: async (id) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/projects/${id}/`)
      if (!response.ok) throw new Error('Failed to fetch project')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch project')
    }
  },

  /**
   * Get featured projects
   * @returns {Promise}
   */
  getFeatured: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/featured/`)
      if (!response.ok) throw new Error('Failed to fetch featured projects')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch featured projects')
    }
  },

  /**
   * Create new project
   * @param {object} projectData - Project data
   * @returns {Promise}
   */
  create: async (projectData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/projects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      if (!response.ok) throw new Error('Failed to create project')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to create project')
    }
  },

  /**
   * Update project
   * @param {number} id - Project ID
   * @param {object} projectData - Updated project data
   * @returns {Promise}
   */
  update: async (id, projectData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/projects/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      if (!response.ok) throw new Error('Failed to update project')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to update project')
    }
  },

  /**
   * Delete project
   * @param {number} id - Project ID
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/projects/${id}/`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete project')
      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to delete project')
    }
  },
}

export const skillAPI = {
  /**
   * Get all skills
   * @returns {Promise}
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/skills/`)
      if (!response.ok) throw new Error('Failed to fetch skills')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch skills')
    }
  },

  /**
   * Create skill
   * @param {object} skillData - Skill data
   * @returns {Promise}
   */
  create: async (skillData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/skills/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      })
      if (!response.ok) throw new Error('Failed to create skill')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to create skill')
    }
  },

  /**
   * Update skill
   * @param {number} id - Skill ID
   * @param {object} skillData - Updated skill data
   * @returns {Promise}
   */
  update: async (id, skillData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/skills/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      })
      if (!response.ok) throw new Error('Failed to update skill')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to update skill')
    }
  },

  /**
   * Delete skill
   * @param {number} id - Skill ID
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/skills/${id}/`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete skill')
      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to delete skill')
    }
  },
}

export const experienceAPI = {
  /**
   * Get all experiences
   * @returns {Promise}
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/experiences/`)
      if (!response.ok) throw new Error('Failed to fetch experiences')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch experiences')
    }
  },

  /**
   * Get current position
   * @returns {Promise}
   */
  getCurrent: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/experiences/current/`)
      if (!response.ok) throw new Error('Failed to fetch current position')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch current position')
    }
  },

  /**
   * Create experience
   * @param {object} experienceData - Experience data
   * @returns {Promise}
   */
  create: async (experienceData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/experiences/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experienceData),
      })
      if (!response.ok) throw new Error('Failed to create experience')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to create experience')
    }
  },

  /**
   * Update experience
   * @param {number} id - Experience ID
   * @param {object} experienceData - Updated experience data
   * @returns {Promise}
   */
  update: async (id, experienceData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/experiences/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experienceData),
      })
      if (!response.ok) throw new Error('Failed to update experience')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to update experience')
    }
  },

  /**
   * Delete experience
   * @param {number} id - Experience ID
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/experiences/${id}/`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete experience')
      return response
    } catch (error) {
      throw new Error(error.message || 'Failed to delete experience')
    }
  },
}

export const contactAPI = {
  /**
   * Submit contact message
   * @param {object} contactData - Contact data
   * @returns {Promise}
   */
  submit: async (contactData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })
      if (!response.ok) throw new Error('Failed to submit contact form')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to submit contact form')
    }
  },

  /**
   * Get contact count
   * @returns {Promise}
   */
  getCount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/recent/`)
      if (!response.ok) throw new Error('Failed to fetch contact count')
      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch contact count')
    }
  },
}
