import { invoke } from '@tauri-apps/api/tauri';
import { db_Phenotype } from 'models/db/db_Phenotype';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { PhenotypeFieldName } from 'models/db/filter/db_PhenotypeFieldName';
import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';
import {
  Filter,
  getDbBoolean,
  prepareFilter,
} from '../models/db/filter/filter';

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
      filter: prepareFilter(filter),
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
  const fieldFilters = new Map<PhenotypeFieldName, string[]>();
  fieldFilters.set('Name', [name]);

  const fieldSpecialFilters = new Map<PhenotypeFieldName, SpecialFilter[]>();
  fieldSpecialFilters.set('Wild', [
    {
      fieldValue: '',
      specialFilterType: getDbBoolean(wild),
    },
  ]);

  const filter: Filter<PhenotypeFieldName> = {
    fieldFilters,
    fieldSpecialFilters,
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
  // Build expression relation filter
  const exprFilters = new Map<ExpressionRelationFieldName, string[]>();
  exprFilters.set('AlleleName', [alleleName]);
  exprFilters.set('ExpressingPhenotypeName', [phenotypeName]);
  const specialFilters = new Map<
    ExpressionRelationFieldName,
    SpecialFilter[]
  >();
  specialFilters.set('ExpressingPhenotypeWild', [
    {
      fieldValue: '',
      specialFilterType: getDbBoolean(phenotypeWild),
    },
  ]);
  specialFilters.set('IsSuppressing', [
    {
      fieldValue: '',
      specialFilterType: getDbBoolean(isSuppressing),
    },
  ]);
  const exprFilter: Filter<ExpressionRelationFieldName> = {
    fieldFilters: exprFilters,
    fieldSpecialFilters: specialFilters,
    orderBy: [],
  };

  try {
    const res = await invoke('get_altering_phenotypes', {
      filter: prepareFilter(exprFilter),
    });
    return res as db_Phenotype[];
  } catch (err) {
    console.error('Unable to get altering phenotypes from db', err);
    return [];
  }

  // const exprRelations = getExpressionRelationsFromDB()
  //   .filter(
  //     (relation) =>
  //       relation.alleleName === alleleName &&
  //       relation.expressingPhenotypeName === phenotypeName &&
  //       relation.expressingPhenotypeWild === phenotypeWild &&
  //       relation.isSuppressing === getSuppressing &&
  //       relation.alteringCondition === undefined
  //   )
  //   .map((relation) => [
  //     relation.alteringPhenotypeName,
  //     relation.alteringPhenotypeWild,
  //   ]);
  // const relationSet = new Set(exprRelations);

  // const alteringPhenotypes = getPhenotypesFromDB().filter((record) =>
  //   relationSet.has([record.name, record.wild])
  // );

  // return alteringPhenotypes;
};
