import { describe, expect, test } from 'vitest';
import { StrainData } from 'models/frontend/StrainData/StrainData';
import * as mockModels from 'models/frontend/StrainData/StrainData.stories';

describe('StrainData', () => {
  test('(De)serializes', () => {
    const model = mockModels.e204HetOx802Het;
    const str = model.toJSON();
    const modelBack = StrainData.fromJSON(str);
    expect(modelBack).toEqual(model);
    expect(modelBack.toJSON).toBeDefined();
    expect(modelBack.strain.toJSON).toBeDefined();
  });
});
