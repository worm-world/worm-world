import { Dominance } from 'models/enums';
import { AlleleExpression } from 'models/frontend/AlleleExpression/AlleleExpression';
import { type Condition } from 'models/frontend/Condition/Condition';
import { cond25C } from 'models/frontend/Condition/Condition.mock';
import { type Phenotype } from 'models/frontend/Phenotype/Phenotype';
import {
  phenLin15B,
  phenUnc119,
} from 'models/frontend/Phenotype/Phenotype.mock';

/** Function to more easily create allele expressions (so you don't have to list empty vlaues) */
const createExpr = ({
  alleleName = '',
  expressingPhenotype = phenLin15B,
  requiredConditions = [],
  requiredPhenotypes = [],
  suppressingPhenotypes = [],
  suppressingConditions = [],
  dominance,
}: {
  alleleName?: string;
  expressingPhenotype?: Phenotype;
  requiredPhenotypes?: Phenotype[];
  suppressingPhenotypes?: Phenotype[];
  requiredConditions?: Condition[];
  suppressingConditions?: Condition[];
  dominance: Dominance;
}): AlleleExpression => {
  return new AlleleExpression({
    alleleName,
    expressingPhenotype,
    requiredConditions,
    requiredPhenotypes,
    suppressingConditions,
    suppressingPhenotypes,
    dominance,
  });
};

export const ed3PhenUnc119 = createExpr({
  alleleName: 'ed3',
  expressingPhenotype: phenUnc119,
  dominance: Dominance.Recessive,
});

export const n765PhenLin15B = createExpr({
  alleleName: 'n765',
  expressingPhenotype: phenLin15B,
  requiredConditions: [cond25C],
  dominance: Dominance.Recessive,
});
