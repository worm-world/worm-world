import { invoke } from '@tauri-apps/api/tauri';
import { getExpressionRelationsFromDB } from 'api/expressionRelation';
import db_Condition from 'models/db/db_Condition';

export const getConditionsFromDB = (): db_Condition[] => {
  invoke('get_expr_relations')
    .then((res) => {
      return res as db_Condition[];
    })
    .catch((res) => console.error('Unable to get Conditions from db'));
  return [];
};

export const getAlteringConditions = (
  alleleName: String,
  phenotypeName: String,
  phenotypeWild: Boolean,
  getSuppressing: Boolean
): db_Condition[] => {
  const exprRelations = getExpressionRelationsFromDB()
    .filter(
      (relation) =>
        relation.alleleName === alleleName &&
        relation.expressingPhenotypeName === phenotypeName &&
        relation.expressingPhenotypeWild === phenotypeWild &&
        relation.isSuppressing === getSuppressing &&
        relation.alteringPhenotypeName === undefined
    )
    .map((relation) => relation.alteringCondition);
  const relationSet = new Set(exprRelations);

  const alteringConditions = getConditionsFromDB().filter((record) =>
    relationSet.has(record.name)
  );

  return alteringConditions;
};
