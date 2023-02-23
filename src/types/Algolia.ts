import type {Hit} from 'instantsearch.js';

export type TPoint = {lat: number; lng: number};

export type THitItem = Hit<{
  objectID: string;
  displayName: string;
  tags: string[];
  isDeleted: boolean;
  _geoloc?: {lat: number; lng: number}[];
  collection: string;
  _highlightResult: string;
  path: string;
}>;
