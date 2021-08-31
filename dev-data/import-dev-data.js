const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });
const mongoose = require('mongoose');
const User = require('../models/usersModel');
const Fault = require('../models/faultsModel');
const FaultLog = require('../models/faultLogsModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connection successfully'));
//READ JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/users-dev.json`, 'utf-8'));

const importUsers = async () => {
  try {
    await User.create(users);
    console.log('users successfully uploaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteUsers = async () => {
  try {
    await User.deleteMany();
    console.log('users successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteFaultLogs = async () => {
  try {
    await FaultLog.deleteMany();
    console.log('Fault Logs successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const faults = JSON.parse(fs.readFileSync(`${__dirname}/faults-dev.json`, 'utf-8'));

const importFaults = async () => {
  try {
    await Fault.create(faults);
    console.log('faults successfully uploaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteFaults = async () => {
  try {
    await Fault.deleteMany();
    console.log('faults successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--importusers') {
  importUsers();
} else if (process.argv[2] === '--deleteusers') {
  deleteUsers();
} else if (process.argv[2] === '--importfaults') {
  importFaults();
} else if (process.argv[2] === '--deletefaults') {
  deleteFaults();
} else if (process.argv[2] === '--deletefaultlogs') {
  deleteFaultLogs();
}
