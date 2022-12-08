import { invoke } from '@tauri-apps/api/tauri';
import { db_Error } from 'models/db/db_Error';
import { db_Phenotype } from 'models/db/db_Phenotype';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { PhenotypeFieldName } from 'models/db/filter/db_PhenotypeFieldName';
import {
  Filter,
  getDbBoolean,
  getSingleRecordOrError,
} from 'models/db/filter/Filter';

export const getPhenotypes = async (): Promise<db_Phenotype[] | db_Error> => {
  return await invoke('get_phenotypes');
};

export const getFilteredPhenotypes = async (
  filter: Filter<PhenotypeFieldName>
): Promise<db_Phenotype[] | db_Error> => {
  return await invoke('get_filtered_phenotypes', {
    filter,
  });
};

export const getPhenotype = async (
  name: string,
  wild: boolean
): Promise<db_Phenotype | db_Error> => {
  const filter: Filter<PhenotypeFieldName> = {
    filters: [
      [
        ['Name', { Equal: name }],
        ['Wild', getDbBoolean(wild)],
      ],
    ],
    orderBy: [],
  };
  const res = await getFilteredPhenotypes(filter);
  return getSingleRecordOrError(
    res,
    `Unable to find any phenotypes with the name: ${name} and wild: ${wild}`
  );
};

export const getAlteringPhenotypes = async (
  alleleName: string,
  phenotypeName: string,
  phenotypeWild: boolean,
  isSuppressing: boolean
): Promise<db_Phenotype[] | db_Error> => {
  const exprRelationFilter: Filter<ExpressionRelationFieldName> = {
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
  const phenotypeFilter: Filter<PhenotypeFieldName> = {
    filters: [],
    orderBy: [],
  };

  return await invoke('get_altering_phenotypes', {
    exprRelationFilter,
    phenotypeFilter,
  });
};
