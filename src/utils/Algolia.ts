import algoliasearch, {SearchClient} from 'algoliasearch/lite';
import {TBundleId} from '../types/Data';

export let searchClient: SearchClient;

export const algoliaKey = {
  development: {
    appId: 'Y8ZQ2YFW1T',
    apiKey: 'c01bf6b6e5a3891d7393b484e36e7d0a',
  },
  production: {
    appId: '1W7YH2JVEK',
    apiKey: '611a3ee9401a1db13ee6b027fcfe034f',
  },
};

export const initAlgolia = (bundleId: TBundleId) => {
  let appId = algoliaKey.development.appId;
  let apiKey = algoliaKey.development.apiKey;

  if (bundleId === 'com.airballoon.Shoutout') {
    appId = algoliaKey.production.appId;
    apiKey = algoliaKey.production.apiKey;
  }

  searchClient = algoliasearch(appId, apiKey);
};
