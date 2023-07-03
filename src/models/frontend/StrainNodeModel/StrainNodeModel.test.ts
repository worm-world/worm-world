import { describe, expect, test } from 'vitest';
import { StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import * as mockModels from 'models/frontend/StrainNodeModel/StrainNodeModel.mock';

describe('StrainNodeModel', () => {
  test('(De)serializes', () => {
    const model = mockModels.e204HetOx802Het;
    const str = model.toJSON();
    const modelBack = StrainNodeModel.fromJSON(str);
    expect(modelBack).toEqual(model);
    expect(modelBack.toJSON).toBeDefined();
    expect(modelBack.strain.toJSON).toBeDefined();
  });
});
