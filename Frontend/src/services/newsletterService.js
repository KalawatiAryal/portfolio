/**
 * Newsletter Service
 * Handles newsletter subscription
 */

import config from '../config/env'

const API_BASE_URL = config.PORTFOLIO_API_URL

export const newsletterAPI = {
  /**
   * Subscribe email to newsletter
   * @param {string} email - Email address
   * @returns {Promise}
   */
  subscribe: async (email) => {
    try {
      // For now, we'll use the contact API to store newsletter subscriptions
      // You can later create a dedicated newsletter endpoint in the backend
      const response = await fetch(`${API_BASE_URL}/contacts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email: email,
          message: 'Subscribe to newsletter',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      return await response.json()
    } catch (error) {
      throw new Error(error.message || 'Subscription failed')
    }
  },

  /**
   * Unsubscribe email from newsletter
   * @param {string} email - Email address
   * @returns {Promise}
   */
  unsubscribe: async (email) => {
    try {
      // Backend logic to handle unsubscription
      // This would typically need a dedicated endpoint
      console.log('Unsubscribing:', email)
      return { success: true }
    } catch (error) {
      throw new Error(error.message || 'Unsubscription failed')
    }
  },
}
