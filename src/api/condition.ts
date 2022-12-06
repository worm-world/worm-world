import { invoke } from '@tauri-apps/api/tauri';
import { db_Condition } from 'models/db/db_Condition';
import { ConditionFieldName } from 'models/db/filter/db_ConditionFieldName';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { Filter, getDbBoolean } from 'models/db/filter/filter';
import { DBError } from 'models/error';

export const getConditions = async (): Promise<db_Condition[] | DBError> => {
  try {
    const res = await invoke('get_conditions');
    return res as db_Condition[];
  } catch (err) {
    return new DBError('Unable to get conditions from db');
  }
};

export const getFilteredConditions = async (
  filter: Filter<ConditionFieldName>
): Promise<db_Condition[] | DBError> => {
  try {
    const res = await invoke('get_filtered_conditions', {
      filter,
    });
    return res as db_Condition[];
  } catch (err) {
    return new DBError('Unable to get filtered conditions from db');
  }
};

export const getCondition = async (
  name: string
): Promise<db_Condition | DBError> => {
  const filter: Filter<ConditionFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };
  const filterRes = await getFilteredConditions(filter);
  return !(filterRes instanceof DBError) && filterRes.length > 0
    ? filterRes[0]
    : new DBError('Unable to get specified condition from db');
};

export const getAlteringConditions = async (
  alleleName: string,
  phenotypeName: string,
  phenotypeWild: boolean,
  isSuppressing: boolean
): Promise<db_Condition[] | DBError> => {
  // Build expression relation filter
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

  const conditionFilter: Filter<ConditionFieldName> = {
    filters: [],
    orderBy: [],
  };

  try {
    const res = await invoke('get_altering_conditions', {
      exprRelationFilter,
      conditionFilter,
    });
    return res as db_Condition[];
  } catch (err) {
    return new DBError('Unable to get altering conditions from db');
  }
};
