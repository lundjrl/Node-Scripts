const admin = require('firebase-admin');
const fs = require('fs');

// Global vars
const databaseURL = 'https://atmosic-mobile-dev.firebaseio.com';
const serviceAccountFileName = './ServiceAccount.json';
const outputFileName = 'remoteConfig.json';

const serviceAccount = require(serviceAccountFileName);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

const getTemplate = async () => {
  try {
    const config = admin.remoteConfig();
    const template = await config.getTemplate();

    const templateStr = JSON.stringify(template);
    fs.writeFileSync(outputFileName, templateStr);

    return template;
  } catch (error) {
    console.error('PROCESS ERROR:', error);
  }
};

(async () => await getTemplate())();
console.log('PROCESS COMPLETE');
