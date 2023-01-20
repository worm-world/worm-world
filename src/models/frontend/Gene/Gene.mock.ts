import { Gene } from 'models/frontend/Gene/Gene';
import GeneticLocation from '../GeneticLocation';

export const chrom1Gene1 = new Gene({
  sysName: 'chromIgene1',
  chromosome: 'I',
});

export const chrom2Gene1 = new Gene({
  sysName: 'chromIIgene1',
  chromosome: 'II',
});

export const chrom2Gene2 = new Gene({
  sysName: 'chromIIgene2',
  chromosome: 'II',
});

export const chrom3Gene1 = new Gene({
  sysName: 'chromIIIgene1',
  chromosome: 'III',
});

export const chrom4Gene1 = new Gene({
  sysName: 'chromIVgene1',
  chromosome: 'IV',
});

export const chrom5Gene1 = new Gene({
  sysName: 'chrom5gene1',
  chromosome: 'V',
});

export const chromXGene1 = new Gene({
  sysName: 'chromXgene1',
  chromosome: 'X',
});

export const unc119 = new Gene({
  sysName: 'M142.1',
  descName: 'unc-119',
  chromosome: 'III',
  physLoc: new GeneticLocation(10902641),
  geneticLoc: new GeneticLocation(5.59),
});
export const lin15B = new Gene({
  sysName: 'ZK662.4',
  descName: 'lin-15B',
  chromosome: 'X',
  physLoc: new GeneticLocation(15726123),
  geneticLoc: new GeneticLocation(22.95),
});
export const unc18 = new Gene({
  sysName: 'F27D9.1',
  descName: 'unc-18',
  chromosome: 'X',
  physLoc: new GeneticLocation(7682896),
  geneticLoc: new GeneticLocation(-1.35),
});
export const dpy10 = new Gene({
  sysName: 'T14B4.7',
  descName: 'dpy-10',
  chromosome: 'II',
  physLoc: new GeneticLocation(6710149),
  geneticLoc: new GeneticLocation(0),
});
export const kin4 = new Gene({
  sysName: 'C10C6.1',
  descName: 'kin-4',
  chromosome: 'IV',
  physLoc: new GeneticLocation(11425742),
  geneticLoc: new GeneticLocation(4.98),
});
