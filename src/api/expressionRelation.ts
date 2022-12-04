import { invoke } from '@tauri-apps/api/tauri';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { Filter, prepareFilter } from '../models/db/filter/filter';

export const getExpressionRelations = async (): Promise<
  db_ExpressionRelation[]
> => {
  try {
    const res = await invoke('get_expr_relations');
    return res as db_ExpressionRelation[];
  } catch (err) {
    console.error('Unable to get expression relations from db', err);
    return [];
  }
};

export const getFilteredExpressionRelations = async (
  filter: Filter<ExpressionRelationFieldName>
): Promise<db_ExpressionRelation[]> => {
  try {
    const res = await invoke('get_filtered_expr_relations', {
      filter: prepareFilter(filter),
    });
    return res as db_ExpressionRelation[];
  } catch (err) {
    console.error('Unable to get filtered expression relations from db', err);
    return [];
  }
};
