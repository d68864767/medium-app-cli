const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const { exec } = require('child_process');
const { log } = require('./utils');

class Scheduler {
  constructor(configPath) {
    this.configPath = configPath;
    this.scheduleType = null;
    this.schedule = null;
  }

  async loadConfig() {
    try {
      const configData = await readFileAsync(this.configPath);
      const config = JSON.parse(configData);
      this.scheduleType = config.scheduler.defaultScheduleType;
    } catch (error) {
      log('Error reading config file: ' + error.message, 'error');
      throw error;
    }
  }

  async setSchedule(scheduleType) {
    this.scheduleType = scheduleType;
    switch (scheduleType) {
      case 'hourly':
        this.schedule = '0 * * * *'; // Every hour at minute 0
        break;
      case 'daily':
      default:
        this.schedule = '0 0 * * *'; // Every day at midnight
        break;
    }
    log(`Schedule set to ${scheduleType}`, 'info');
  }

  async writeCronJob(command) {
    const cronCommand = `echo "${this.schedule} ${command}" | crontab -`;
    exec(cronCommand, (error, stdout, stderr) => {
      if (error) {
        log(`Error setting up cron job: ${error.message}`, 'error');
        return;
      }
      if (stderr) {
        log(`Error setting up cron job: ${stderr}`, 'error');
        return;
      }
      log('Cron job set successfully', 'info');
    });
  }

  async publishScheduledJob(articleDetails) {
    const command = `node publisher.js --account ${articleDetails.account} --topic ${articleDetails.topic} --keywords ${articleDetails.keywords.join(',')}`;
    await this.writeCronJob(command);
  }

  async viewCurrentCronJobs() {
    exec('crontab -l', (error, stdout, stderr) => {
      if (error) {
        log('Error retrieving cron jobs: ' + error.message, 'error');
        return;
      }
      if (stderr) {
        log('Error retrieving cron jobs: ' + stderr, 'error');
        return;
      }
      log('Current cron jobs:\n' + stdout, 'info');
    });
  }
}

module.exports = Scheduler;
