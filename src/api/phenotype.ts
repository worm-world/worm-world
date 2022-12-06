import { invoke } from '@tauri-apps/api/tauri';
import { db_Phenotype } from 'models/db/db_Phenotype';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { PhenotypeFieldName } from 'models/db/filter/db_PhenotypeFieldName';
import { Filter, getDbBoolean } from 'models/db/filter/filter';
import { DBError } from 'models/error';

export const getPhenotypes = async (): Promise<db_Phenotype[] | DBError> => {
  try {
    const res = await invoke('get_phenotypes');
    return res as db_Phenotype[];
  } catch (err) {
    return new DBError('Unable to get phenotypes from db');
  }
};

export const getFilteredPhenotypes = async (
  filter: Filter<PhenotypeFieldName>
): Promise<db_Phenotype[] | DBError> => {
  try {
    const res = await invoke('get_filtered_phenotypes', {
      filter,
    });
    return res as db_Phenotype[];
  } catch (err) {
    return new DBError('Unable to get filtered phenotypes from db');
  }
};

export const getPhenotype = async (
  name: string,
  wild: boolean
): Promise<db_Phenotype | DBError> => {
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
  const canUseRes = !(res instanceof DBError) && res.length > 0;
  return canUseRes ? res[0] : new DBError('Unable to get specified phenotype');
};

export const getAlteringPhenotypes = async (
  alleleName: string,
  phenotypeName: string,
  phenotypeWild: boolean,
  isSuppressing: boolean
): Promise<db_Phenotype[] | DBError> => {
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

  try {
    const res = await invoke('get_altering_phenotypes', {
      exprRelationFilter,
      phenotypeFilter,
    });
    return res as db_Phenotype[];
  } catch (err) {
    return new DBError('Unable to get altering phenotypes from db');
  }
};
