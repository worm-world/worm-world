import { invoke } from '@tauri-apps/api/tauri';
import { db_Phenotype } from 'models/db/db_Phenotype';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { PhenotypeFieldName } from 'models/db/filter/db_PhenotypeFieldName';
import { Filter, getDbBoolean } from 'models/db/filter/filter';

export const getPhenotypes = async (): Promise<db_Phenotype[]> => {
  try {
    const res = await invoke('get_phenotypes');
    return res as db_Phenotype[];
  } catch (err) {
    console.error('Unable to get phenotypes from db', err);
    return [];
  }
};

export const getFilteredPhenotypes = async (
  filter: Filter<PhenotypeFieldName>
): Promise<db_Phenotype[]> => {
  try {
    const res = await invoke('get_filtered_phenotypes', {
      filter,
    });
    return res as db_Phenotype[];
  } catch (err) {
    console.error('Unable to get filtered phenotypes from db', err);
    return [];
  }
};

export const getPhenotype = async (
  name: string,
  wild: boolean
): Promise<db_Phenotype | undefined> => {
  const filter: Filter<PhenotypeFieldName> = {
    filters: [
      [
        ['Name', { Equal: name }],
        ['Wild', getDbBoolean(wild)],
      ],
    ],
    orderBy: [],
  };

  return (await getFilteredPhenotypes(filter))[0];
};

export const getAlteringPhenotypes = async (
  alleleName: string,
  phenotypeName: string,
  phenotypeWild: boolean,
  isSuppressing: boolean
): Promise<db_Phenotype[]> => {
  const filter: Filter<ExpressionRelationFieldName> = {
    filters: [
      [
        ['AlleleName', { Equal: alleleName }],
        ['ExpressingPhenotypeName', { Equal: phenotypeName }],
        ['ExpressingPhenotypeWild', getDbBoolean(phenotypeWild)],
        ['IsSuppressing', getDbBoolean(isSuppressing)],
      ],
    ],
    orderBy: [],
  };

  try {
    const res = await invoke('get_altering_phenotypes', {
      filter,
    });
    return res as db_Phenotype[];
  } catch (err) {
    console.error('Unable to get altering phenotypes from db', err);
    return [];
  }
};
