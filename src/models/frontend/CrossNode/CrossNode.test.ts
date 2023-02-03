import { describe, expect } from 'vitest';
import { CrossNodeModel } from './CrossNode';
import { e204HetOx802Het } from './CrossNode.mock';

describe('CrossNodeModel', () => {
  it('should be able to (de)serialize', () => {
    const str = e204HetOx802Het.toJSON();
    const e204HetOx802Het3Back = CrossNodeModel.fromJSON(str);
    expect(e204HetOx802Het3Back.toJSON()).toEqual(e204HetOx802Het.toJSON());
  });
});
