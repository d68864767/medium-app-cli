const fs = require('fs');
const path = require('path');
const config = require('./config.json');

class CronViewer {
  constructor() {
    this.cronJobsFilePath = path.join(__dirname, config.cronJobsFileName);
  }

  // Load the cron jobs from the file
  loadCronJobs() {
    try {
      const data = fs.readFileSync(this.cronJobsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading cron jobs file:', error);
      return [];
    }
  }

  // Display the cron jobs in a user-friendly format
  displayCronJobs() {
    const cronJobs = this.loadCronJobs();

    if (cronJobs.length === 0) {
      console.log('No scheduled cron jobs found.');
      return;
    }

    console.log('Current Scheduled Cron Jobs:');
    cronJobs.forEach((job, index) => {
      console.log(`${index + 1}. Account: ${job.account}`);
      console.log(`   Topic: ${job.topic}`);
      console.log(`   Keywords: ${job.keywords.join(', ')}`);
      console.log(`   Schedule: ${job.schedule}`);
      console.log(`   Next Run: ${job.nextRun}`);
      console.log('---------------------------');
    });
  }
}

module.exports = CronViewer;
