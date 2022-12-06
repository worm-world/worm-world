import { invoke } from '@tauri-apps/api/tauri';
import { db_Condition } from 'models/db/db_Condition';
import { ConditionFieldName } from 'models/db/filter/db_ConditionFieldName';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { Filter, getDbBoolean } from 'models/db/filter/filter';

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
      filter,
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
  const filter: Filter<ConditionFieldName> = {
    filters: [[['Name', { Equal: name }]]],
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
    const res = await invoke('get_altering_conditions', {
      filter,
    });
    return res as db_Condition[];
  } catch (err) {
    console.error('Unable to get altering conditions from db', err);
    return [];
  }
};
