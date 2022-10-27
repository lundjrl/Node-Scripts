/* This file will copy a local remote-config template from the firebase instance of your choice
   and save it as a JSON file. The goal is to make creating remote-config values easier amongst apps. */

const admin = require('firebase-admin');
const fs = require('fs');

// Global vars
const serviceAccountFileName = './ServiceAccount.json';
const databaseURL = 'https://atmosic-mobile.firebaseio.com';

const serviceAccount = require(serviceAccountFileName);
const outputFileName = 'remoteConfig.json';

// Init DB, using gr-template as a playground for now.
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

/* Save our new template under the project we got it from. */
const publishTemplate = async (template) => {
  const config = admin.remoteConfig();
  return await config
    .publishTemplate(template)
    .then((updatedTemplate) => {
      console.log('Template has been published');
      console.log('ETag from server: ' + updatedTemplate.etag);
      return true;
    })
    .catch((err) => {
      console.error('Unable to publish template.');
      console.error(err);
      return false;
    });
};

const main = async () => {
  console.log('Starting node script...');
  const oldTemplate = await getTemplate();
  const rawdata = fs.readFileSync('./new-remoteConfig.json');
  const template = JSON.parse(rawdata);

  await publishTemplate({
    ...template,
    etag: oldTemplate.etag,
    conditions: [],
  });
  console.log('Done');
};

main();
