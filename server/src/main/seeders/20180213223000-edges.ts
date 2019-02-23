import * as fs from "fs";
import * as path from "path";
import { QueryInterface, SequelizeStatic } from "sequelize";
import { Log } from "../Log";
import { MathUtil } from "../math.util";
import { Route, RoutePoint, Station } from "../models";
import { EdgeAttributes } from "../models/edge";
import { RouteInstance } from "../models/route";
import { RoutePointAttributes, RoutePointInstance } from "../models/route-point";
import { StationInstance, } from "../models/station";
import { PopulateTableSeeder } from "../PopulateTableSeeder";

const busSpeed: number = MathUtil.kilometersPerHourToMetersPerSecond(40);
const humanSpeed: number = MathUtil.kilometersPerHourToMetersPerSecond(5);

const stayCoefficient: number = 0.1;
const maxWalkCoefficient: number = 0.3;
const maxWalkTime: number = 5 * 60;
const busCoefficient: number = 0.2;

function getWalkCoefficient(distanceInMeters: number): number {
   const timeNeededInSeconds: number = distanceInMeters / humanSpeed;
   return Math.max(1.0 - timeNeededInSeconds / maxWalkTime, 0) * maxWalkCoefficient;
}

interface DefinedEdgeAttributes extends EdgeAttributes {
   fromStationId: string;
   toStationId: string;
   chance: number;
   travelTimeMs: number;
}

function mergeEdges(edges: DefinedEdgeAttributes[]): DefinedEdgeAttributes[] {
   const newEdges: { [targetId: string]: DefinedEdgeAttributes } = {};
   for (const edge of edges) {
      if (newEdges[edge.toStationId]) {
         newEdges[edge.toStationId].chance = newEdges[edge.toStationId].chance + edge.chance;
      } else {
         newEdges[edge.toStationId] = edge;
      }
   }
   const result: DefinedEdgeAttributes[] = [];
   for (const targetId in newEdges) {
      result.push(newEdges[targetId]);
   }
   return result;
}

function normalizeEdges(edges: DefinedEdgeAttributes[]): void {
   let coefficientSum: number = 0.0;
   for (const edge of edges) {
      coefficientSum += edge.chance;
   }
   coefficientSum += stayCoefficient;

   for (const edge of edges) {
      edge.chance /= coefficientSum;
   }
}

export = new PopulateTableSeeder<EdgeAttributes>("Edges", async (): Promise<EdgeAttributes[]> => {
   const result: [StationInstance[], RoutePointInstance[]] =
      await Promise.all([Station.findAll(), RoutePoint.findAll()]);

   let attributes: DefinedEdgeAttributes[] = [];
   const stationMap: { [id: string]: StationInstance } = {};
   const originalEdges: { [id: string]: DefinedEdgeAttributes[] } = {};
   const additionalEdges: { [id: string]: DefinedEdgeAttributes[] } = {};

   for (const station of result[0]) {
      stationMap[station.id] = station;
      originalEdges[station.id] = [];
      additionalEdges[station.id] = [];
   }

   const routePoints: RoutePointInstance[] = result[1];
   routePoints.sort((routePoint1: RoutePointInstance, routePoint2: RoutePointInstance): number => {
      if (routePoint1.routeId !== routePoint2.routeId) {
         return Number(routePoint1.routeId) - Number(routePoint2.routeId);
      }
      if (routePoint1.subrouteIndex !== routePoint2.subrouteIndex) {
         return routePoint1.subrouteIndex - routePoint2.subrouteIndex;
      }
      return routePoint1.index - routePoint2.index;
   });

   for (let i: number = 1; i < routePoints.length; i++) {
      if (routePoints[i - 1].routeId === routePoints[i].routeId
         && routePoints[i - 1].subrouteIndex === routePoints[i].subrouteIndex) {

         const fromStation: StationInstance = stationMap[routePoints[i - 1].stationId];
         const toStation: StationInstance = stationMap[routePoints[i].stationId];
         const newEdge: DefinedEdgeAttributes = {
            fromStationId: fromStation.id,
            toStationId: toStation.id,
            travelTimeMs: Math.floor(
               MathUtil.getDistanceInMeters(fromStation, toStation) / busSpeed * 1000),
            chance: busCoefficient,
         };
         originalEdges[newEdge.fromStationId].push(newEdge);
      }
   }
   for (const stationId in stationMap) {
      originalEdges[stationId] = mergeEdges(originalEdges[stationId]);
      attributes = attributes.concat(originalEdges[stationId]);
   }
   Log.DB("Edges: " + attributes.length);

   Log.DB("Human walking edges...");
   const stations: StationInstance[] = result[0];
   let allPairs: number = 0;
   let closeEnoughPairs: number = 0;
   stations.sort((station1: StationInstance, station2: StationInstance): number => {
      return station1.latitude - station2.latitude;
   });
   for (let i: number = 0; i < stations.length; i++) {
      for (let j: number = i + 1; j < stations.length && j < (i + stations.length / 10); j++) {
         const station1: StationInstance = stations[i];
         const station2: StationInstance = stations[j];
         allPairs++;
         const distance: number = MathUtil.getDistanceInMeters(station1, station2);
         const coefficient: number = getWalkCoefficient(distance);
         if (coefficient < 0.1) {
            continue;
         }
         closeEnoughPairs++;
         const travelTimeMs: number = distance / humanSpeed * 1000;
         const edge1: DefinedEdgeAttributes = {
            fromStationId: station1.id,
            toStationId: station2.id,
            chance: coefficient,
            travelTimeMs,
         };
         const edge2: DefinedEdgeAttributes = {
            fromStationId: station2.id,
            toStationId: station1.id,
            chance: coefficient,
            travelTimeMs,
         };
         originalEdges[station1.id].push(edge1);
         originalEdges[station2.id].push(edge2);
         attributes.push(edge1, edge2);
      }
   }
   Log.DB("Human walking edge pairs: " + closeEnoughPairs + "/" + allPairs);

   let lastPass: DefinedEdgeAttributes[] = [];
   let currentPass: DefinedEdgeAttributes[] = [];

   for (const stationId in stationMap) {
      normalizeEdges(originalEdges[stationId]);
      for (const edge of originalEdges[stationId]) {
         currentPass.push(edge);
      }
   }

   Log.DB("Edges: " + attributes.length);

   while (!!currentPass.length && attributes.length < 150000) {
      lastPass = currentPass;
      currentPass = [];
      for (const firstEdge of lastPass) {
         for (const secondEdge of originalEdges[firstEdge.toStationId]) {
            const newChance: number = firstEdge.chance * secondEdge.chance;
            if (newChance < 0.05) {
               continue;
            }
            const newEdge: DefinedEdgeAttributes = {
               fromStationId: firstEdge.fromStationId,
               toStationId: secondEdge.toStationId,
               chance: firstEdge.chance * secondEdge.chance,
               travelTimeMs: firstEdge.travelTimeMs + secondEdge.travelTimeMs,
            };
            additionalEdges[newEdge.fromStationId].push(newEdge);
            attributes.push(newEdge);
            currentPass.push(newEdge);
         }
      }
      Log.DB("Edges: " + attributes.length);
   }

   return attributes;
});
