import { invoke } from '@tauri-apps/api/tauri';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { Filter } from 'models/db/filter/Filter';

export const getExpressionRelations = async (): Promise<
  db_ExpressionRelation[]
> => {
  return await invoke('get_expr_relations');
};

export const getFilteredExpressionRelations = async (
  filter: Filter<ExpressionRelationFieldName>
): Promise<db_ExpressionRelation[]> => {
  return await invoke('get_filtered_expr_relations', {
    filter,
  });
};

export const insertDbExpressionRelation = async (
  record: db_ExpressionRelation
): Promise<void> => {
  await invoke('insert_expr_relation', {
    exprRelation: record,
  });
};
