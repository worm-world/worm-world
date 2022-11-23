import { invoke } from '@tauri-apps/api/tauri';
import { getExpressionRelationsFromDB } from 'api/expressionRelation';
import db_Phenotype from 'models/db/db_Phenotype';
export const getPhenotypesFromDB = (): db_Phenotype[] => {
  invoke('get_phenotypes')
    .then((res) => {
      return res as db_Phenotype[];
    })
    .catch((res) => console.error('Unable to get Phenotypes from db'));
  return [];
};

export const getPhenotypeFromDB = (
  name: String,
  wild: Boolean
): db_Phenotype | undefined => {
  const phenotypes = getPhenotypesFromDB();
  const filtered = phenotypes.filter(
    (el) => el.name === name && el.wild === wild
  );
  if (filtered.length === 1) return filtered[0];
  else {
    console.error(
      `Unable to find a phenotype with the name: ${name} and wild value: ${String(
        wild
      )})`
    );
    return undefined;
  }
};

export const getAlteringPhenotypesFromDB = (
  alleleName: String,
  phenotypeName: String,
  phenotypeWild: Boolean,
  getSuppressing: Boolean
): db_Phenotype[] => {
  const exprRelations = getExpressionRelationsFromDB()
    .filter(
      (relation) =>
        relation.alleleName === alleleName &&
        relation.expressingPhenotypeName === phenotypeName &&
        relation.expressingPhenotypeWild === phenotypeWild &&
        relation.isSuppressing === getSuppressing &&
        relation.alteringCondition === undefined
    )
    .map((relation) => [
      relation.alteringPhenotypeName,
      relation.alteringPhenotypeWild,
    ]);
  const relationSet = new Set(exprRelations);

  const alteringPhenotypes = getPhenotypesFromDB().filter((record) =>
    relationSet.has([record.name, record.wild])
  );

  return alteringPhenotypes;
};
