import { Dominance } from 'models/enums';
import { AlleleExpression } from 'models/frontend/AlleleExpression/AlleleExpression';
import { cond25C } from 'models/frontend/Condition/Condition.mock';
import {
  phenLin15B,
  phenUnc119,
} from 'models/frontend/Phenotype/Phenotype.mock';
import { expect, test, describe } from 'vitest';
describe('AlleleExpression', () => {
  test('should be able to serialize and deserialize', () => {
    const alleleExpr = new AlleleExpression({
      alleleName: 'alleleExpr',
      expressingPhenotype: phenUnc119,
      requiredPhenotypes: [phenLin15B],
      suppressingPhenotypes: [],
      requiredConditions: [cond25C],
      suppressingConditions: [],
      dominance: Dominance.SemiDominant,
    });
    const str = alleleExpr.toJSON();
    const alleleExprBack = AlleleExpression.fromJSON(str);
    expect(alleleExprBack.toJSON()).toEqual(str);
  });
});
