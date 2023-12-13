const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * Load environment variables from .env file
 */
const loadEnvVariables = () => {
  require('dotenv').config();
};

/**
 * Load configuration from config.json file
 */
const loadConfig = () => {
  const configPath = path.join(__dirname, 'config.json');
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('Error: config.json file not found.'));
    process.exit(1);
  }

  try {
    const configData = fs.readFileSync(configPath);
    return JSON.parse(configData);
  } catch (error) {
    console.error(chalk.red('Error reading config.json file:'), error);
    process.exit(1);
  }
};

/**
 * Validate Medium access token
 */
const validateMediumAccessToken = (config) => {
  if (!config.medium || !config.medium.accessToken) {
    console.error(chalk.red('Error: Medium access token is not defined in config.json.'));
    process.exit(1);
  }
};

/**
 * Log message with specified level from config
 */
const log = (message, level = 'info') => {
  const config = loadConfig();
  const logLevel = config.logging.level;

  if (level === logLevel || logLevel === 'debug') {
    console.log(chalk.blue(`[${level.toUpperCase()}]: ${message}`));
  }
};

/**
 * Format the schedule type to a cron pattern
 */
const formatScheduleToCron = (scheduleType) => {
  switch (scheduleType.toLowerCase()) {
    case 'hourly':
      return '0 * * * *'; // Every hour at minute 0
    case 'daily':
      return '0 0 * * *'; // Every day at midnight
    default:
      log('Invalid schedule type. Defaulting to daily.', 'warn');
      return '0 0 * * *'; // Default to daily
  }
};

module.exports = {
  loadEnvVariables,
  loadConfig,
  validateMediumAccessToken,
  log,
  formatScheduleToCron,
};
