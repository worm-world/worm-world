import { invoke } from '@tauri-apps/api/tauri';
import { db_Condition } from 'models/db/db_Condition';
import { ConditionFieldName } from 'models/db/filter/db_ConditionFieldName';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';
import {
  Filter,
  getDbBoolean,
  prepareFilter,
} from '../models/db/filter/filter';

export const getConditions = async (): Promise<db_Condition[]> => {
  try {
    const res = await invoke('get_conditions');
    return res as db_Condition[];
  } catch (err) {
    console.error('Unable to get conditions from db', err);
    return [];
  }
};

export const getFilteredConditions = async (
  filter: Filter<ConditionFieldName>
): Promise<db_Condition[]> => {
  try {
    const res = await invoke('get_filtered_conditions', {
      filter: prepareFilter(filter),
    });
    return res as db_Condition[];
  } catch (err) {
    console.error('Unable to get filtered conditions from db', err);
    return [];
  }
};

export const getCondition = async (
  name: string
): Promise<db_Condition | undefined> => {
  const fieldFilters = new Map<ConditionFieldName, string[]>();
  fieldFilters.set('Name', [name]);
  const fieldSpecialFilters = new Map<ConditionFieldName, SpecialFilter[]>();
  const filter: Filter<ConditionFieldName> = {
    fieldFilters,
    fieldSpecialFilters,
    orderBy: [],
  };
  return (await getFilteredConditions(filter))[0];
};

export const getAlteringConditions = async (
  alleleName: string,
  phenotypeName: string,
  phenotypeWild: boolean,
  isSuppressing: boolean
): Promise<db_Condition[]> => {
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
    const res = await invoke('get_altering_conditions', {
      filter: prepareFilter(exprFilter),
    });
    return res as db_Condition[];
  } catch (err) {
    console.error('Unable to get altering conditions from db', err);
    return [];
  }
};
