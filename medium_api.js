const axios = require('axios');
const { loadConfig, validateMediumAccessToken, log } = require('./utils');

class MediumAPI {
  constructor() {
    const config = loadConfig();
    validateMediumAccessToken(config);
    this.accessToken = config.medium.accessToken;
    this.baseUrl = 'https://api.medium.com/v1';
    this.headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Charset': 'utf-8',
    };
  }

  /**
   * Get the current user's Medium profile
   */
  async getCurrentUser() {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        headers: this.headers,
      });
      return response.data.data;
    } catch (error) {
      log(`Error fetching current user: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Create a new post on Medium
   * @param {string} userId - The user ID obtained from getCurrentUser
   * @param {string} title - The title of the post
   * @param {string} content - The content of the post
   * @param {string} contentFormat - The format of the content (html or markdown)
   * @param {string[]} tags - An array of tags for the post
   * @param {string} publishStatus - The publish status (public, draft, or unlisted)
   */
  async createPost(userId, title, content, contentFormat = 'markdown', tags = [], publishStatus = 'public') {
    try {
      const response = await axios.post(`${this.baseUrl}/users/${userId}/posts`, {
        title,
        content,
        contentFormat,
        tags,
        publishStatus,
      }, {
        headers: this.headers,
      });
      log(`Post created successfully: ${response.data.data.url}`, 'info');
      return response.data.data;
    } catch (error) {
      log(`Error creating post: ${error.message}`, 'error');
      throw error;
    }
  }
}

module.exports = MediumAPI;
