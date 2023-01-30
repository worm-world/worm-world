import CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

let temp = mockCrossTree.emptyCrossTree;

// Mocked for now
export const getAllCrossTrees = async (): Promise<CrossTree[]> => {
  const trees: CrossTree[] = [temp];
  return await Promise.resolve(trees);
};

// Mocked for now
export const getCrossTreeById = async (id: number): Promise<CrossTree> => {
  return temp;
};

// Mocked for now
export const saveCrossTree = async (tree: CrossTree): Promise<void> => {
  // await invoke('save_cross_tree', { id: tree.id, tree });
  temp = tree;
};

// export const getNextTreeId = async (): Promise<number> => {
//   return await invoke('getNextTreeId');
// };
