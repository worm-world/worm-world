import { invoke } from '@tauri-apps/api/tauri';
import db_ExpressionRelation from 'models/db/db_ExpressionRelation';

export const getExpressionRelationsFromDB = (): db_ExpressionRelation[] => {
  invoke('get_expr_relations')
    .then((res) => {
      return res as db_ExpressionRelation[];
    })
    .catch((res) => console.error('Unable to get ExpressionRelations from db'));
  return [];
};
