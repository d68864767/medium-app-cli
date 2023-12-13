const readline = require('readline');
const accountManager = require('./account_manager');
const topicSelector = require('./topic_selector');
const keywordInput = require('./keyword_input');
const scheduler = require('./scheduler');
const publisher = require('./publisher');
const cronViewer = require('./cron_viewer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const mainMenu = () => {
  console.log('Welcome to the Daily Article Stream Creator');
  rl.question('Please select an option:\n1) Publish Article\n2) View Current Cron Jobs\n3) Exit\n> ', (answer) => {
    switch (answer) {
      case '1':
        publishArticle();
        break;
      case '2':
        viewCronJobs();
        break;
      case '3':
        rl.close();
        break;
      default:
        console.log('Invalid option, please try again.');
        mainMenu();
    }
  });
};

const publishArticle = () => {
  accountManager.selectAccount()
    .then(() => topicSelector.selectTopic())
    .then(() => keywordInput.enterKeywords())
    .then(() => scheduler.selectSchedule())
    .then(schedule => publisher.publish(schedule))
    .then(() => {
      console.log('Article scheduled successfully.');
      mainMenu();
    })
    .catch(err => {
      console.error('An error occurred:', err);
      mainMenu();
    });
};

const viewCronJobs = () => {
  cronViewer.viewCurrentCronJobs()
    .then(() => {
      mainMenu();
    })
    .catch(err => {
      console.error('An error occurred while viewing cron jobs:', err);
      mainMenu();
    });
};

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});

mainMenu();
