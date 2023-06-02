import { describe, expect, test } from 'vitest';
import { StrainNode as StrainNodeModel } from 'models/frontend/StrainNode/StrainNode';
import { e204HetOx802Het } from 'models/frontend/StrainNode/StrainNode.mock';

describe('StrainNodeModel', () => {
  test('should be able to (de)serialize', () => {
    const str = e204HetOx802Het.toJSON();
    const e204HetOx802Het3Back = StrainNodeModel.fromJSON(str);
    expect(e204HetOx802Het3Back.toJSON()).toEqual(e204HetOx802Het.toJSON());
    expect(e204HetOx802Het3Back.strain).toEqual(e204HetOx802Het.strain);
    expect(e204HetOx802Het3Back.strain.chromPairMap).toEqual(
      e204HetOx802Het.strain.chromPairMap
    );
    expect(
      [...e204HetOx802Het3Back.strain.chromPairMap.values()][0][0].strictEquals(
        [...e204HetOx802Het.strain.chromPairMap.values()][0][0]
      )
    ).toBe(true);
  });
});
