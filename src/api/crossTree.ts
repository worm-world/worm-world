import CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

let temp = JSON.stringify(mockCrossTree.simpleCrossTree);

// Mocked for now
export const getAllCrossTrees = async (): Promise<CrossTree[]> => {
  const trees: CrossTree[] = [
    JSON.parse(JSON.stringify(mockCrossTree.simpleCrossTree)),
    JSON.parse(JSON.stringify(mockCrossTree.mediumCrossTree)),
    JSON.parse(temp),
  ];
  return await Promise.resolve(trees);
};

// Mocked for now
export const getCrossTreeById = async (id: number): Promise<CrossTree> => {
  if (id === 0) return mockCrossTree.simpleCrossTree;
  else if (id === 1) return mockCrossTree.mediumCrossTree;
  else return JSON.parse(temp);
};

export const saveCrossTree = async (tree: CrossTree): Promise<void> => {
  // await invoke('save_cross_tree', { id: tree.id, tree });
  temp = JSON.stringify(tree);
};

// export const getNextTreeId = async (): Promise<number> => {
//   return await invoke('getNextTreeId');
// };
