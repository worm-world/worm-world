import { describe, expect, test } from 'vitest';
import { CrossNodeModel } from './CrossNode';
import { e204HetOx802Het } from './CrossNode.mock';

describe('CrossNodeModel', () => {
  test('should be able to (de)serialize', () => {
    const str = e204HetOx802Het.toJSON();
    const e204HetOx802Het3Back = CrossNodeModel.fromJSON(str);
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
