import { invoke } from '@tauri-apps/api/tauri';
import { db_Condition } from 'models/db/db_Condition';
import { ConditionFieldName } from 'models/db/filter/db_ConditionFieldName';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import {
  FilterGroup,
  getDbBoolean,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { Condition } from 'models/frontend/Condition/Condition';

export const getConditions = async (): Promise<db_Condition[]> => {
  return await invoke('get_conditions');
};

export const getFilteredConditions = async (
  filter: FilterGroup<ConditionFieldName>
): Promise<db_Condition[]> => {
  return await invoke('get_filtered_conditions', {
    filter,
  });
};

export const getCondition = async (name: string): Promise<db_Condition> => {
  const filter: FilterGroup<ConditionFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };

  const res = await getFilteredConditions(filter);
  return getSingleRecordOrThrow(
    res,
    `Unable to find a condition with the name: ${name}`
  );
};

export const getAlteringConditions = async (
  alleleName: string,
  phenotypeName: string,
  phenotypeWild: boolean,
  isSuppressing: boolean
): Promise<db_Condition[]> => {
  // Build expression relation filter
  const exprRelationFilter: FilterGroup<ExpressionRelationFieldName> = {
    filters: [
      [['AlleleName', { Equal: alleleName }]],
      [['ExpressingPhenotypeName', { Equal: phenotypeName }]],
      [['ExpressingPhenotypeWild', getDbBoolean(phenotypeWild)]],
      [['IsSuppressing', getDbBoolean(isSuppressing)]],
    ],
    orderBy: [],
  };

  const conditionFilter: FilterGroup<ConditionFieldName> = {
    filters: [],
    orderBy: [],
  };

  return await invoke('get_altering_conditions', {
    exprRelationFilter,
    conditionFilter,
  });
};

export const insertCondition = async (condition: Condition): Promise<void> => {
  await insertDbCondition(condition.generateRecord());
};

export const insertDbCondition = async (
  record: db_Condition
): Promise<void> => {
  await invoke('insert_condition', { condition: record });
};

export const insertConditionsFromFile = async (path: string): Promise<void> => {
  await invoke('insert_conditions_from_file', { path });
};
