const inquirer = require('inquirer');
const { log } = require('./utils');

/**
 * Prompts the user to select a topic from a predefined list.
 * The list of topics can be extended or modified as needed.
 */
const selectTopic = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'topic',
        message: 'Select Topic:',
        choices: [
          'Technology',
          'Business',
          'Health',
          'Entertainment',
          'Travel',
          'Science',
          'Education',
          'Lifestyle',
          'Other'
        ],
        default: 'Technology'
      }
    ]);

    log(`Topic selected: ${answers.topic}`, 'info');
    return answers.topic;
  } catch (error) {
    log('An error occurred while selecting a topic: ' + error.message, 'error');
    process.exit(1);
  }
};

module.exports = {
  selectTopic
};
