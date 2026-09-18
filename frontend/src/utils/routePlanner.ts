import { getLocalizedStationName, type Language } from '../i18n';
import type { RouteInterchange, RoutePlan, RouteSortMode, RouteStationDetail } from '../types/route';
import type { StationInfo } from '../types/station';
import SVGPathUtils from './index';

import rawEdges from '../data/edge.json';
import rawStations from '../data/stations-lite.json';

type MetroEdge = {
  from: string;
  to: string;
  stroke: string;
  path: string;
};

export const stations = (rawStations as StationInfo[]).filter((station) => station.id && station.text);
export const edges = rawEdges as MetroEdge[];

class GraphNode {
  value: string;
  edges: Map<GraphNode, number>;

  constructor(value: string) {
    this.value = value;
    this.edges = new Map();
  }

  addEdge(node: GraphNode, weight: number) {
    this.edges.set(node, weight);
  }

  getEdges() {
    return this.edges;
  }
}

class WeightedGraph {
  nodes: Map<string, GraphNode>;

  constructor() {
    this.nodes = new Map();
  }

  addNode(value: string) {
    this.nodes.set(value, new GraphNode(value));
  }

  getNode(value: string) {
    return this.nodes.get(value);
  }

  addEdge(source: string, destination: string, weight: number) {
    const sourceNode = this.getNode(source);
    const destinationNode = this.getNode(destination);
    if (sourceNode && destinationNode) {
      sourceNode.addEdge(destinationNode, weight);
      destinationNode.addEdge(sourceNode, weight);
    }
  }

  addDirectedEdge(source: string, destination: string, weight: number) {
    const sourceNode = this.getNode(source);
    const destinationNode = this.getNode(destination);
    if (sourceNode && destinationNode) {
      sourceNode.addEdge(destinationNode, weight);
    }
  }

  findShortestPath(start: string, end: string): { path: string[]; distance: number } | null {
    const distances: Map<string, number> = new Map();
    const previous: Map<string, string | null> = new Map();
    const visited: Set<string> = new Set();

    for (const [key] of this.nodes) {
      distances.set(key, Infinity);
      previous.set(key, null);
    }
    distances.set(start, 0);

    while (visited.size !== this.nodes.size) {
      const currentNode = this.getMinDistanceNode(distances, visited);
      if (!currentNode) break;

      visited.add(currentNode.value);

      for (const [neighbor, weight] of currentNode.getEdges()) {
        const totalDistance = distances.get(currentNode.value)! + weight;
        if (totalDistance < distances.get(neighbor.value)!) {
          distances.set(neighbor.value, totalDistance);
          previous.set(neighbor.value, currentNode.value);
        }
      }
    }

    const path: string[] = [];
    let currentNode: string | null = end;
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = previous.get(currentNode)!;
    }

    if (path.length === 1 && path[0] !== start) return null;
    return { path, distance: distances.get(end)! };
  }

  findShortestPaths(start: string, end: string, limit = 3): Array<{ path: string[]; distance: number }> {
    if (start === end) return [{ path: [start], distance: 0 }];
    if (!this.nodes.has(start) || !this.nodes.has(end)) return [];

    const routes: Array<{ path: string[]; distance: number }> = [];
    const seenRoutes = new Set<string>();
    const queue: Array<{ path: string[]; distance: number }> = [{ path: [start], distance: 0 }];
    let maxDistance = Infinity;

    while (queue.length && routes.length < limit) {
      queue.sort((left, right) => left.distance - right.distance || left.path.length - right.path.length);
      const candidate = queue.shift()!;
      const currentStationId = candidate.path[candidate.path.length - 1];

      if (candidate.distance > maxDistance) continue;

      if (currentStationId === end) {
        const routeKey = candidate.path.join('>');
        if (!seenRoutes.has(routeKey)) {
          seenRoutes.add(routeKey);
          routes.push(candidate);

          if (routes.length === 1) {
            maxDistance = candidate.distance + Math.max(8, Math.ceil(candidate.distance * 0.35));
          }
        }
        continue;
      }

      const currentNode = this.getNode(currentStationId);
      if (!currentNode) continue;

      const visitedStations = new Set(candidate.path);
      const nextStations = [...currentNode.getEdges()]
        .map(([node, weight]) => ({ stationId: node.value, weight }))
        .sort((left, right) => left.stationId.localeCompare(right.stationId));

      for (const nextStation of nextStations) {
        if (visitedStations.has(nextStation.stationId)) continue;

        const nextDistance = candidate.distance + nextStation.weight;
        if (nextDistance > maxDistance) continue;

        queue.push({
          path: [...candidate.path, nextStation.stationId],
          distance: nextDistance,
        });
      }

      if (queue.length > 20000) {
        queue.length = 20000;
      }
    }

    return routes;
  }

  private getMinDistanceNode(distances: Map<string, number>, visited: Set<string>): GraphNode | null {
    let minDistance = Infinity;
    let minNode: GraphNode | null = null;
    for (const [key, value] of distances) {
      if (!visited.has(key) && value < minDistance) {
        minDistance = value;
        minNode = this.getNode(key)!;
      }
    }
    return minNode;
  }
}

const graph = new WeightedGraph();
const stationById = new Map(stations.map((station) => [station.id, station]));

const distanceBetweenStationsKm = (_from: string, _to: string) => {
  return 1; // Stop-based distance for Ahmedabad
};

const edgeDistanceKey = (from: string, to: string) => [from, to].sort().join('>');
const edgeDistanceKm = new Map<string, number>();

for (const station of stations) {
  graph.addNode(station.id);
}

for (const edge of edges) {
  const distanceKm = distanceBetweenStationsKm(edge.from, edge.to);
  const routeWeight = distanceKm;

  edgeDistanceKm.set(edgeDistanceKey(edge.from, edge.to), distanceKm);
  graph.addEdge(edge.from, edge.to, routeWeight);
}

const uniqueColors = (colors: string[]) => [...new Set(colors.filter(Boolean))];

export const slugifyStationName = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getStationSlug = (stationId: string) => {
  const station = stations.find((item) => item.id === stationId);
  return station ? slugifyStationName(station.text) : stationId.toLowerCase();
};

export const getStationBySlug = (slug: string) =>
  stations.find((station) => getStationSlug(station.id) === slug);

export const getStationById = (stationId: string | null | undefined) =>
  stationId ? stationById.get(stationId) : undefined;

export const isStationId = (stationId: string | null | undefined) =>
  Boolean(getStationById(stationId));

export const getRoutePathname = (from: string, to: string) =>
  `/routes/${getStationSlug(from)}-to-${getStationSlug(to)}/`;

export const getStationPathname = (stationId: string) =>
  `/stations/${getStationSlug(stationId)}/`;

export const parseRoutePathname = (pathname: string) => {
  const match = pathname.match(/^\/routes\/(.+)-to-(.+)\/?$/);
  if (!match) return null;

  const from = getStationBySlug(match[1]);
  const to = getStationBySlug(match[2]);
  if (!from || !to) return null;

  return { from: from.id, to: to.id };
};

export const estimateFare = (stops: number, isPhase2 = false) => {
  if (isPhase2) return { regular: 35, smartCard: 31 }; // Approximated Phase 2 fare
  if (stops <= 3) return { regular: 5, smartCard: 4.5 };
  if (stops <= 7) return { regular: 10, smartCard: 9.0 };
  if (stops <= 11) return { regular: 15, smartCard: 13.5 };
  if (stops <= 15) return { regular: 20, smartCard: 18.0 };
  return { regular: 25, smartCard: 22.5 };
};

export const getFareTimeLimitMinutes = (_stops: number) => {
  return 90; // Standard 90 min time limit
};

const calculateRouteFare = (routePath: string[]) => {
  const stops = Math.max(0, routePath.length - 1);
  const phase2Stations = new Set(['GNLU', 'PDEU', 'GFTC', 'MTMD', 'SCT1', 'S10A', 'SCHV', 'AKSD', 'JNSC', 'SC16', 'SC24', 'RYSN', 'RDSN', 'DKCL', 'INFC', 'KBGM', 'JNKB', 'KBCL', 'NMCL', 'TPCL', 'VSCG', 'KOTR']);
  const isPhase2 = routePath.some(id => phase2Stations.has(id));
  
  const fares = estimateFare(stops, isPhase2);
  
  return {
    fare: fares.regular,
    holidayFare: fares.smartCard,
    fareType: 'regular' as const,
  };
};

const calculateEstimatedMinutes = (routePath: string[], interchangeCount: number) => {
  const stops = Math.max(0, routePath.length - 1);
  return stops * 2.5 + interchangeCount * 5;
};

const getRouteTimeLimitMinutes = (stops: number, _fareType: 'regular' | 'airport-express') => {
  return getFareTimeLimitMinutes(stops);
};

export const getStationLineColors = (stationId: string) =>
  uniqueColors(edges
    .filter((edge) => edge.from === stationId || edge.to === stationId)
    .map((edge) => edge.stroke));

const stationName = (id: string, language: Language) => {
  const fallbackName = stations.find((station) => station.id === id)?.text || id;
  return getLocalizedStationName(id, fallbackName, language);
};

const getRouteEdge = (from: string, to: string) =>
  edges.find((edge) => edge.from === from && edge.to === to) ||
  edges.find((edge) => edge.from === to && edge.to === from);

const getRouteDistanceKm = (routePath: string[]) =>
  routePath.slice(0, -1).reduce((totalDistance, stationId, index) => {
    const nextStationId = routePath[index + 1];
    return totalDistance + (edgeDistanceKm.get(edgeDistanceKey(stationId, nextStationId)) || 1);
  }, 0);

const roundDistanceKm = (distanceKm: number) => Math.round(distanceKm * 10) / 10;

const getRouteStationDetails = (routePath: string[], language: Language): RouteStationDetail[] =>
  routePath.map((stationId, index) => {
    const previousEdge = index > 0 ? getRouteEdge(routePath[index - 1], stationId) : undefined;
    const nextEdge = index < routePath.length - 1 ? getRouteEdge(stationId, routePath[index + 1]) : undefined;

    return {
      id: stationId,
      name: stationName(stationId, language),
      lineColors: uniqueColors([previousEdge?.stroke || '', nextEdge?.stroke || '']),
    };
  });

const getRouteInterchanges = (routePath: string[], language: Language): RouteInterchange[] =>
  routePath.slice(1, -1).flatMap((stationId, index) => {
    const routeIndex = index + 1;
    const previousEdge = getRouteEdge(routePath[routeIndex - 1], stationId);
    const nextEdge = getRouteEdge(stationId, routePath[routeIndex + 1]);

    if (!previousEdge || !nextEdge || previousEdge.stroke === nextEdge.stroke) return [];

    return [{
      id: stationId,
      name: stationName(stationId, language),
      fromColor: previousEdge.stroke,
      toColor: nextEdge.stroke,
    }];
  });

const buildRoutePlan = (
  from: string,
  to: string,
  language: Language,
  routePath: string[],
  optionIndex: number
): RoutePlan => {
  const newPath = routePath
    .map((stationId, index) => {
      if (stationId === to) return '';

      const nextStationId = routePath[index + 1];
      const forwardEdge = edges.find(
        (edge) => edge.from === stationId && edge.to === nextStationId
      )?.path;

      if (forwardEdge) return forwardEdge;

      const reverseEdge = edges.find(
        (edge) => edge.from === nextStationId && edge.to === stationId
      )?.path || '';

      return SVGPathUtils.inversePath(reverseEdge);
    })
    .filter((pathSegment) => pathSegment !== undefined && pathSegment !== '');

  // To make a continuous path for GSAP, we extract the coordinates 
  // from each segment and join them. Since segments are "M x1 y1 L x2 y2",
  // we can just strip the intermediate 'M' commands.
  let combinedPath = '';
  newPath.forEach((segment, index) => {
    if (index === 0) {
      combinedPath += segment;
    } else {
      // Remove the starting "M x y" from subsequent segments
      // e.g. "M100 100 L200 200" -> " L200 200"
      combinedPath += segment.replace(/^M[^L]+L/, ' L');
    }
  });

  const svgPath = combinedPath;
  const interchanges = getRouteInterchanges(routePath, language);
  const stopCount = Math.max(0, routePath.length - 1);
  const distanceKm = roundDistanceKm(getRouteDistanceKm(routePath));
  const routeFare = calculateRouteFare(routePath);

  return {
    svgPath,
    route: {
      optionId: routePath.join('>') || `${from}>${to}>${optionIndex}`,
      from,
      to,
      fromName: stationName(from, language),
      toName: stationName(to, language),
      stops: routePath.map((stationId) => stationName(stationId, language)),
      stationDetails: getRouteStationDetails(routePath, language),
      interchanges,
      distance: stopCount,
      distanceKm,
      fare: routeFare.fare,
      holidayFare: routeFare.holidayFare,
      fareType: routeFare.fareType,
      timeLimitMinutes: getRouteTimeLimitMinutes(distanceKm, routeFare.fareType),
      estimatedMinutes: calculateEstimatedMinutes(routePath, interchanges.length),
    },
  };
};

export const buildRoutes = (from: string, to: string, language: Language, limit = 3): RoutePlan[] => {
  const routePaths = limit <= 1
    ? [graph.findShortestPath(from, to)].filter((routePath): routePath is { path: string[]; distance: number } => Boolean(routePath))
    : graph.findShortestPaths(from, to, limit);

  return routePaths.map((routePath, index) =>
    buildRoutePlan(from, to, language, routePath.path, index)
  );
};

export const buildRoute = (from: string, to: string, language: Language): RoutePlan | null => {
  const [route] = buildRoutes(from, to, language, 1);

  return route || null;
};

export const sortRoutePlans = (routePlans: RoutePlan[], sortMode: RouteSortMode = 'interchanges') =>
  [...routePlans].sort((left, right) => {
    if (sortMode === 'stops') {
      return left.route.distance - right.route.distance
        || left.route.interchanges.length - right.route.interchanges.length
        || left.route.distanceKm - right.route.distanceKm;
    }

    return left.route.interchanges.length - right.route.interchanges.length
      || left.route.distanceKm - right.route.distanceKm
      || left.route.distance - right.route.distance
      || left.route.estimatedMinutes - right.route.estimatedMinutes;
  });
