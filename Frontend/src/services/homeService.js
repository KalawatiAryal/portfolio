/**
 * Home Service
 * Handles hero and newsletter API calls
 */

import config from '../config/env'
import { tokenService } from './authService'

const API_BASE_URL = config.PORTFOLIO_API_URL

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = tokenService.getAccessToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

export const homeAPI = {
  /**
   * Get latest hero section
   * @returns {Promise}
   */
  getHeroSection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero/latest/`)
      if (!response.ok) {
        throw new Error('Failed to fetch hero section')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching hero section:', error)
      throw error
    }
  },

  /**
   * Get all hero sections (admin)
   * @returns {Promise}
   */
  getAllHeroSections: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero/`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch hero sections')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching hero sections:', error)
      throw error
    }
  },

  /**
   * Create hero section (admin)
   * @param {object} heroData - Hero section data
   * @returns {Promise}
   */
  createHeroSection: async (heroData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(heroData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create hero section')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  /**
   * Update hero section (admin)
   * @param {number} id - Hero section ID
   * @param {object} heroData - Updated hero section data
   * @returns {Promise}
   */
  updateHeroSection: async (id, heroData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(heroData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update hero section')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  /**
   * Get all homepage skills
   * @returns {Promise}
   */
  getSkills: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage-skills/`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch skills')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching skills:', error)
      throw error
    }
  },

  /**
   * Create a homepage skill (admin)
   * @param {object} skillData - Skill data
   * @returns {Promise}
   */
  createSkill: async (skillData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage-skills/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(skillData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.detail || 'Failed to create skill')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  /**
   * Update a homepage skill (admin)
   * @param {number} id - Skill ID
   * @param {object} skillData - Updated skill data
   * @returns {Promise}
   */
  updateSkill: async (id, skillData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage-skills/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(skillData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.detail || 'Failed to update skill')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete a homepage skill (admin)
   * @param {number} id - Skill ID
   * @returns {Promise}
   */
  deleteSkill: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage-skills/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete skill')
      }

      return { success: true }
    } catch (error) {
      throw error
    }
  },

  /**
   * Subscribe to newsletter
   * @param {string} email - Email address
   * @param {string} firstName - First name (optional)
   * @returns {Promise}
   */
  subscribeNewsletter: async (email, firstName = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          first_name: firstName.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Subscription failed')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Failed to subscribe')
    }
  },

  /**
   * Check newsletter subscription status
   * @param {string} email - Email address
   * @returns {Promise}
   */
  checkSubscription: async (email) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/newsletter/check/?email=${encodeURIComponent(email)}`
      )
      if (!response.ok) {
        throw new Error('Failed to check subscription')
      }
      return await response.json()
    } catch (error) {
      throw error
    }
  },

  /**
   * Unsubscribe from newsletter
   * @param {string} email - Email address
   * @returns {Promise}
   */
  unsubscribeNewsletter: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/unsubscribe/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unsubscription failed')
      }

      return data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get subscriber count
   * @returns {Promise}
   */
  getSubscriberCount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/count/`)
      if (!response.ok) {
        throw new Error('Failed to fetch subscriber count')
      }
      return await response.json()
    } catch (error) {
      throw error
    }
  },

  /**
   * Get all newsletter subscribers (admin only)
   * @returns {Promise}
   */
  getAllSubscribers: async () => {
    try {
      console.log('Fetching subscribers from:', `${API_BASE_URL}/newsletter/`)
      const headers = getAuthHeaders()
      console.log('Headers being sent:', headers)
      
      const response = await fetch(`${API_BASE_URL}/newsletter/`, {
        method: 'GET',
        headers: headers,
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || `API Error: ${response.status}`)
      }
      
      // Handle paginated response
      if (data.results && Array.isArray(data.results)) {
        console.log('Returning paginated results:', data.results.length)
        return data.results
      }
      
      // Handle direct array response
      if (Array.isArray(data)) {
        console.log('Returning array:', data.length)
        return data
      }
      
      // Handle object response
      console.log('Returning object as is')
      return data
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      throw error
    }
  },

  /**
   * Delete a newsletter subscriber (admin only)
   * @param {number} id - Subscriber ID
   * @returns {Promise}
   */
  deleteSubscriber: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete subscriber')
      }

      return { success: true }
    } catch (error) {
      throw error
    }
  },

  /**
   * Update subscriber subscription status
   * @param {number} id - Subscriber ID
   * @param {boolean} isSubscribed - New subscription status
   * @returns {Promise}
   */
  updateSubscriber: async (id, isSubscribed) => {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_subscribed: isSubscribed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update subscriber')
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  },
}
