import { invoke } from '@tauri-apps/api/tauri';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { ExpressionRelationFieldName } from 'models/db/filter/db_ExpressionRelationFieldName';
import { FilterGroup, getDbBoolean } from 'models/db/filter/FilterGroup';

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

export const deleteFilteredExpressionRelations = async (
  filter: FilterGroup<ExpressionRelationFieldName>
): Promise<void> => {
  await invoke('delete_filtered_expr_relations', { filter });
};

export const deleteExpressionRelation = async (
  exprRel: db_ExpressionRelation
): Promise<void> => {
  const filter: FilterGroup<ExpressionRelationFieldName> = {
    filters: [
      [['AlleleName', { Equal: exprRel.alleleName }]],
      [['ExpressingPhenotypeName', { Equal: exprRel.expressingPhenotypeName }]],
      [
        [
          'ExpressingPhenotypeWild',
          getDbBoolean(exprRel.expressingPhenotypeWild),
        ],
      ],
      [
        [
          'AlteringPhenotypeName',
          { Equal: exprRel.alteringPhenotypeName ?? '' },
        ],
      ],
      [
        [
          'AlteringPhenotypeWild',
          getDbBoolean(exprRel.expressingPhenotypeWild),
        ],
      ],
      [['AlteringCondition', { Equal: exprRel.alteringCondition ?? '' }]],
    ],
    orderBy: [],
  };

  await deleteFilteredExpressionRelations(filter);
};
