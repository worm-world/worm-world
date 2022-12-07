import { invoke } from '@tauri-apps/api/tauri';
import { db_Condition } from 'models/db/db_Condition';
import { db_Error } from 'models/db/db_Error';
import { ConditionFieldName } from 'models/db/filter/db_ConditionFieldName';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import {
  Filter,
  getDbBoolean,
  getSingleRecordOrError,
} from 'models/db/filter/Filter';

export const getConditions = async (): Promise<db_Condition[] | db_Error> => {
  return await invoke('get_conditions');
};

export const getFilteredConditions = async (
  filter: Filter<ConditionFieldName>
): Promise<db_Condition[] | db_Error> => {
  return await invoke('get_filtered_conditions', {
    filter,
  });
};

export const getCondition = async (
  name: string
): Promise<db_Condition | db_Error> => {
  const filter: Filter<ConditionFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };

  const res = await getFilteredConditions(filter);
  return getSingleRecordOrError(
    res,
    `Unable to find a condition with the name: ${name}`
  );
};

export const getAlteringConditions = async (
  alleleName: string,
  phenotypeName: string,
  phenotypeWild: boolean,
  isSuppressing: boolean
): Promise<db_Condition[] | db_Error> => {
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

  return await invoke('get_altering_conditions', {
    exprRelationFilter,
    conditionFilter,
  });
};
