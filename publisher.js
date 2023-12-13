const axios = require('axios');
const { getAccessToken } = require('./account_manager');
const { getArticleContent } = require('./utils');

class Publisher {
  constructor(config) {
    this.config = config;
    this.mediumBaseUrl = 'https://api.medium.com/v1';
  }

  async publishArticle(topic, keywords) {
    try {
      const accessToken = await getAccessToken(this.config);
      const articleContent = getArticleContent(topic, keywords);

      if (!accessToken) {
        throw new Error('Access token is not available.');
      }

      if (!articleContent) {
        throw new Error('Failed to generate article content.');
      }

      const userResponse = await axios.get(`${this.mediumBaseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const publicationId = userResponse.data.data.id;

      const publishResponse = await axios.post(
        `${this.mediumBaseUrl}/users/${publicationId}/posts`,
        {
          title: articleContent.title,
          contentFormat: 'html',
          content: articleContent.body,
          tags: articleContent.tags,
          publishStatus: 'draft',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`Article published with ID: ${publishResponse.data.data.id}`);
      return publishResponse.data.data.id;
    } catch (error) {
      console.error('Failed to publish article:', error.message);
      throw error;
    }
  }
}

module.exports = Publisher;
