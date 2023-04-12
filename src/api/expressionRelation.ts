import { invoke } from '@tauri-apps/api/tauri';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { FilterGroup } from 'models/db/filter/FilterGroup';

export const getExpressionRelations = async (): Promise<
  db_ExpressionRelation[]
> => {
  return await invoke('get_expr_relations');
};

export const getFilteredExpressionRelations = async (
  filter: FilterGroup<ExpressionRelationFieldName>
): Promise<db_ExpressionRelation[]> => {
  return await invoke('get_filtered_expr_relations', {
    filter,
  });
};

export const getCountFilteredExpressionRelations = async (
  filter: FilterGroup<ExpressionRelationFieldName>
): Promise<number> => {
  return await invoke('get_count_filtered_expr_relations', {
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

export const insertExpressionRelationsFromFile = async (
  path: string
): Promise<void> => {
  await invoke('insert_expr_relations_from_file', { path });
};
