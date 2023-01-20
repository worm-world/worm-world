import { db_Allele } from 'models/db/db_Allele';
import { db_Gene } from 'models/db/db_Gene';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { Allele } from 'models/frontend/Allele/Allele';
import { Gene } from 'models/frontend/Gene/Gene';

export const dbGene: db_Gene = {
  sysName: 'AA',
  descName: null,
  chromosome: null,
  physLoc: null,
  geneticLoc: null,
};

export const dbAllele: db_Allele = {
  name: 'BB',
  contents: null,
  sysGeneName: 'AA',
  variationName: null,
};

export const getFilteredGenes = async (): Promise<db_Gene[]> => {
  return await Promise.resolve([dbGene]);
};

export const getFilteredVariations = async (): Promise<db_VariationInfo[]> => {
  return await Promise.resolve([]);
};

export const getFilteredAlleles = async (): Promise<db_Allele[]> => {
  return await Promise.resolve([dbAllele]);
};

export const filteredVariationDoesNotMatter = async (): Promise<
  db_VariationInfo[]
> => {
  return await Promise.resolve([]);
};

export const alleleCreateDoesNotMatter = async (): Promise<Allele> => {
  return await Promise.resolve(
    new Allele({
      name: '',
      gene: new Gene({ sysName: '' }),
    })
  );
};

export const alleleCreateFromRecord = async (): Promise<Allele> => {
  return await Promise.resolve(
    new Allele({
      name: 'BB',
      gene: new Gene({ sysName: 'AA' }),
    })
  );
};
