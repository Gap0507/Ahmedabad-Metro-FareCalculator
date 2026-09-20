import type { StationInfo } from '../types/station';
import { slugifyStationName } from './routePlanner';

import rawStationMetadata from '../data/stations.json';
import labelsData from '../data/labels.json';

let stationMetadataPromise: Promise<StationInfo[]> | null = null;
const stationInfoById = new Map<string, StationInfo>();
const stationInfoPromiseById = new Map<string, Promise<StationInfo | undefined>>();
const stationInfoPromiseBySlug = new Map<string, Promise<StationInfo | undefined>>();
const missingStationPromise = Promise.resolve(undefined);

const normalizeStations = (stations: StationInfo[]) =>
  stations.filter((station) => station.id && station.text);

export const loadStationMetadata = async () => {
  if (!stationMetadataPromise) {
    stationMetadataPromise = Promise.resolve(rawStationMetadata as StationInfo[])
      .then((stations) => {
        const normalizedStations = normalizeStations(stations);
        const labelsMap = new Map((labelsData as any[]).map((label: any) => [label.station_id, label]));

        stationInfoById.clear();
        for (const station of normalizedStations) {
          const labelInfo = labelsMap.get(station.id);
          if (labelInfo) {
            station.description = labelInfo.description;
            if (labelInfo.gates) {
              station.gates = labelInfo.gates.map((g: any) => ({
                gate: g.gateNo,
                towards: g.landmarks
              }));
            }
          }
          stationInfoById.set(station.id, station);
        }
        return normalizedStations;
      });
  }

  return stationMetadataPromise;
};

export const getStationInfoById = (stationId: string | null | undefined) => {
  if (!stationId) return missingStationPromise;

  let stationPromise = stationInfoPromiseById.get(stationId);
  if (!stationPromise) {
    stationPromise = loadStationMetadata().then(() => stationInfoById.get(stationId));
    stationInfoPromiseById.set(stationId, stationPromise);
  }

  return stationPromise;
};

export const getStationInfoBySlug = (slug: string | null | undefined) => {
  if (!slug) return missingStationPromise;

  let stationPromise = stationInfoPromiseBySlug.get(slug);
  if (!stationPromise) {
    stationPromise = loadStationMetadata().then((stations) =>
      stations.find((station) => slugifyStationName(station.text) === slug)
    );
    stationInfoPromiseBySlug.set(slug, stationPromise);
  }

  return stationPromise;
};
