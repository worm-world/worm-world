import { invoke } from '@tauri-apps/api/tauri';
import { type db_Phenotype } from 'models/db/db_Phenotype';
import { type ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { type PhenotypeFieldName } from 'models/db/filter/db_PhenotypeFieldName';
import {
  type FilterGroup,
  getDbBoolean,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { type Phenotype } from 'models/frontend/Phenotype/Phenotype';

export const getPhenotypes = async (): Promise<db_Phenotype[]> => {
  return await invoke('get_phenotypes');
};

export const getFilteredPhenotypes = async (
  filter: FilterGroup<PhenotypeFieldName>
): Promise<db_Phenotype[]> => {
  return await invoke('get_filtered_phenotypes', {
    filter,
  });
};

export const getCountFilteredPhenotypes = async (
  filter: FilterGroup<PhenotypeFieldName>
): Promise<number> => {
  return await invoke('get_count_filtered_phenotypes', {
    filter,
  });
};

export const getPhenotype = async (
  name: string,
  wild: boolean
): Promise<db_Phenotype> => {
  const filter: FilterGroup<PhenotypeFieldName> = {
    filters: [[['Name', { Equal: name }]], [['Wild', getDbBoolean(wild)]]],
    orderBy: [],
  };
  const res = await getFilteredPhenotypes(filter);
  return getSingleRecordOrThrow(
    res,
    `Unable to find any phenotypes with the name: ${name} and wild: ${wild}`
  );
};

export const getAlteringPhenotypes = async (
  alleleName: string,
  phenotypeName: string,
  phenotypeWild: boolean,
  isSuppressing: boolean
): Promise<db_Phenotype[]> => {
  const exprRelationFilter: FilterGroup<ExpressionRelationFieldName> = {
    filters: [
      [['AlleleName', { Equal: alleleName }]],
      [['ExpressingPhenotypeName', { Equal: phenotypeName }]],
      [['ExpressingPhenotypeWild', getDbBoolean(phenotypeWild)]],
      [['IsSuppressing', getDbBoolean(isSuppressing)]],
    ],
    orderBy: [],
  };
  const phenotypeFilter: FilterGroup<PhenotypeFieldName> = {
    filters: [],
    orderBy: [],
  };

  return await invoke('get_altering_phenotypes', {
    exprRelationFilter,
    phenotypeFilter,
  });
};

export const insertPhenotype = async (phenotype: Phenotype): Promise<void> => {
  await insertDbPhenotype(phenotype.generateRecord());
};

export const insertDbPhenotype = async (
  record: db_Phenotype
): Promise<void> => {
  await invoke('insert_phenotype', { phenotype: record });
};

export const insertPhenotypesFromFile = async (path: string): Promise<void> => {
  await invoke('insert_phenotypes_from_file', { path });
};

export const deleteFilteredPhenotypes = async (
  filter: FilterGroup<PhenotypeFieldName>
): Promise<void> => {
  await invoke('delete_filtered_phenotypes', { filter });
};

export const deletePhenotype = async (
  phenotype: db_Phenotype
): Promise<void> => {
  const filter: FilterGroup<PhenotypeFieldName> = {
    filters: [
      [['Name', { Equal: phenotype.name }]],
      [['Wild', getDbBoolean(phenotype.wild)]],
    ],
    orderBy: [],
  };

  await deleteFilteredPhenotypes(filter);
};
