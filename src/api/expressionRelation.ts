import { invoke } from '@tauri-apps/api/tauri';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { Filter } from 'models/db/filter/filter';
import { DBError } from 'models/error';

export const getExpressionRelations = async (): Promise<
  db_ExpressionRelation[] | DBError
> => {
  try {
    const res = await invoke('get_expr_relations');
    return res as db_ExpressionRelation[];
  } catch (err) {
    return new DBError('Unable to get expression relations from db');
  }
};

export const getFilteredExpressionRelations = async (
  filter: Filter<ExpressionRelationFieldName>
): Promise<db_ExpressionRelation[] | DBError> => {
  try {
    const res = await invoke('get_filtered_expr_relations', {
      filter,
    });
    return res as db_ExpressionRelation[];
  } catch (err) {
    return new DBError('Unable to get filtered expression relations from db');
  }
};
