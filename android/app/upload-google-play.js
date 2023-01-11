const fs = require('fs');
const {auth, androidpublisher} = require('@googleapis/androidpublisher');

const androidPublisher = androidpublisher('v3');

const authAndroid = new auth.GoogleAuth({
  keyFile: 'service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});

const bundleDir = './build/outputs/bundle';

const bundlePaths = {
  main: {
    path: `${bundleDir}/airballoon_Release/app-airballoon_-release.aab`,
    applicationId: 'app.airballoon.Airballoon',
  },
  release: {
    path: `${bundleDir}/release_Release/app-release_-release.aab`,
    applicationId: 'app.airballoon.Airballoon.release',
  },
  development: {
    path: `${bundleDir}/development_Release/app-development_-release.aab`,
    applicationId: 'app.airballoon.Airballoon.development',
  },
};

async function uploadToPlayStore(branchName) {
  let branch = 'development';

  if (branchName === 'main') {
    branch = 'main';
  } else if (branchName.startsWith('release')) {
    branch = 'release';
  }
  const bundlePath = bundlePaths[branch];

  const applicationId = bundlePath.applicationId;
  const bundleReleaseFile = bundlePath.path;

  let authClient;

  try {
    authClient = await authAndroid.getClient();
  } catch (error) {
    throw Error('getClient error', error);
  }

  let appEditId;

  try {
    appEditId = await getOrCreateEdit({applicationId, auth: authClient});
  } catch (error) {
    throw Error('getOrCreateEdit error', error);
  }

  console.log('uploadReleaseFiles started');
  const versionCode = await uploadReleaseFiles(
    authClient,
    appEditId,
    applicationId,
    bundleReleaseFile,
  );
  console.log('uploadReleaseFiles ended with version code', versionCode);

  // Add the uploaded artifacts to the Edit track
  console.log('addReleasesToTrack started');
  await addReleasesToTrack(authClient, appEditId, applicationId, versionCode);
  console.log('addReleasesToTrack ended');

  console.log('commit edit');
  // Commit the pending Edit
  const res = await androidPublisher.edits.commit({
    auth: authClient,
    editId: appEditId,
    packageName: applicationId,
  });

  // Simple check to see whether commit was successful
  if (res.data.id) {
    return res.data.id;
  } else {
    return Promise.reject(res.status);
  }
}

async function addReleasesToTrack(
  authClient,
  appEditId,
  applicationId,
  versionCode,
) {
  const track = 'internal';
  const status = 'completed';

  try {
    const res = await androidPublisher.edits.tracks.update({
      auth: authClient,
      editId: appEditId,
      packageName: applicationId,
      track,
      requestBody: {
        track,
        releases: [
          {
            status,
            versionCodes: [versionCode],
          },
        ],
      },
    });

    return res.data;
  } catch (error) {
    throw Error('addReleasesToTrack error', error);
  }
}

async function uploadReleaseFiles(
  authClient,
  appEditId,
  applicationId,
  releaseFile,
) {
  let versionCode;

  // Upload all release files
  if (releaseFile.endsWith('.aab')) {
    // Upload AAB, or throw when something goes wrong
    const uploadedBundle = await uploadBundle(
      authClient,
      appEditId,
      applicationId,
      releaseFile,
    );

    if (!uploadedBundle.versionCode) {
      console.log('Failed to get version code from uploaded bundle');
      throw Error('Failed to get version code from uploaded bundle');
    }
    versionCode = uploadedBundle.versionCode;
  } else {
    // Throw if file extension is not right
    console.log(`${releaseFile} is invalid.`);
    throw Error(`${releaseFile} is invalid.`);
  }

  return versionCode;
}

async function uploadBundle(
  authClient,
  appEditId,
  applicationId,
  bundleReleaseFile,
) {
  try {
    const res = await androidPublisher.edits.bundles.upload({
      auth: authClient,
      packageName: applicationId,
      editId: appEditId,
      media: {
        mimeType: 'application/octet-stream',
        body: fs.createReadStream(bundleReleaseFile),
      },
    });

    return res.data;
  } catch (error) {
    console.log('uploadBundle error', error);
  }
}

async function getOrCreateEdit(options) {
  // Else attempt to create a new edit. This will throw if there is an issue

  const insertResult = await androidPublisher.edits.insert({
    auth: options.auth,
    packageName: options.applicationId,
  });

  // If we didn't get status 200, i.e. success, propagate the error with valid text
  if (insertResult.status !== 200) {
    throw Error(insertResult.statusText);
  }

  // If the result was successful but we have no ID, somethign went horribly wrong
  if (!insertResult.data.id) {
    throw Error('New edit has no ID, cannot continue.');
  }

  // Return the new edit ID
  return insertResult.data.id;
}

// Start function
const start = async function () {
  console.log('upload to play store started');

  const branchName = process.argv.slice(2)[0];

  if (!branchName) {
    throw Error('failed to read branch name from process arguments');
  }

  try {
    await uploadToPlayStore(branchName);
  } catch (error) {
    throw Error('Upload Bundle error:', error);
  }
  console.log('upload to play store ended');
};

start();
