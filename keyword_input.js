const readline = require('readline');
const { log } = require('./utils');

/**
 * Create a readline interface
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompt the user to enter keywords
 * @param {Function} callback - The callback function to execute after keywords are entered
 */
const enterKeywords = (callback) => {
  rl.question('Enter keywords (comma-separated): ', (input) => {
    const keywords = input.split(',').map(keyword => keyword.trim()).filter(keyword => keyword);
    if (keywords.length === 0) {
      log('No keywords entered. Please try again.', 'warn');
      return enterKeywords(callback);
    }
    callback(keywords);
  });
};

/**
 * Close the readline interface
 */
const closeInput = () => {
  rl.close();
};

module.exports = {
  enterKeywords,
  closeInput
};
