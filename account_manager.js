const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

class AccountManager {
  constructor(configPath, envPath) {
    this.configPath = configPath;
    this.envPath = envPath;
    this.mediumAccessToken = null;
  }

  async loadConfig() {
    try {
      const configData = await readFileAsync(this.configPath);
      const config = JSON.parse(configData);
      this.mediumAccessToken = config.medium.accessToken;
    } catch (error) {
      console.error('Error reading config file:', error);
      throw error;
    }
  }

  async loadEnv() {
    try {
      const envData = await readFileAsync(this.envPath, 'utf8');
      const envVariables = envData.split('\n');
      for (const variable of envVariables) {
        const [key, value] = variable.split('=');
        if (key === 'MEDIUM_ACCESS_TOKEN') {
          this.mediumAccessToken = value;
        }
      }
    } catch (error) {
      console.error('Error reading .env file:', error);
      throw error;
    }
  }

  async initialize() {
    await this.loadConfig();
    await this.loadEnv();
  }

  getAccessToken() {
    return this.mediumAccessToken;
  }
}

module.exports = AccountManager;
