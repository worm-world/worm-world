import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';

export function isWild(chrom: AllelePair[]): boolean {
  return chrom.every((pair) => pair.isWild());
}
