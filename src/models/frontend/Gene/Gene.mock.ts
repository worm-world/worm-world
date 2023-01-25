import { Gene } from 'models/frontend/Gene/Gene';
import GeneticLocation from '../GeneticLocation';

export const chrom1Gene1 = new Gene({
  sysName: 'chromIgene1',
  chromosome: 'I',
});

export const chrom1Gene2 = new Gene({
  sysName: 'chromIgene2',
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

export const unc33 = new Gene({
  sysName: 'Y37E11C.1',
  descName: 'unc-33',
  chromosome: 'IV',
  physLoc: new GeneticLocation(3516886),
  geneticLoc: new GeneticLocation(-3.3),
});

export const unc36 = new Gene({
  sysName: 'C50C3.9',
  descName: 'unc-36',
  chromosome: 'III',
  physLoc: new GeneticLocation(8193843),
  geneticLoc: new GeneticLocation(-0.37),
});

export const unc44 = new Gene({
  sysName: 'B0350.2',
  descName: 'unc-44',
  chromosome: 'IV',
  physLoc: new GeneticLocation(5975557),
  geneticLoc: new GeneticLocation(-2.89),
});

export const unc5 = new Gene({
  sysName: 'B0273.4',
  descName: 'unc-5',
  chromosome: 'IV',
  physLoc: new GeneticLocation(5495664),
  geneticLoc: new GeneticLocation(1.78),
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
export const dpy20 = new Gene({
  sysName: 'T22B3.1',
  descName: 'dpy-10',
  chromosome: 'II',
  physLoc: new GeneticLocation(11696430),
  geneticLoc: new GeneticLocation(5.52),
});
export const kin4 = new Gene({
  sysName: 'C10C6.1',
  descName: 'kin-4',
  chromosome: 'IV',
  physLoc: new GeneticLocation(11425742),
  geneticLoc: new GeneticLocation(4.98),
});

export const him8 = new Gene({
  sysName: 'T07G12.12',
  descName: 'him-8',
  chromosome: 'IV',
  physLoc: new GeneticLocation(10501965),
  geneticLoc: new GeneticLocation(4.64),
});
