import CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

// Mocked for now
export const getAllCrossTrees = async (): Promise<CrossTree[]> => {
  const trees: CrossTree[] = [
    JSON.parse(JSON.stringify(mockCrossTree.simpleCrossTree)),
    JSON.parse(JSON.stringify(mockCrossTree.mediumCrossTree)),
  ];
  return await Promise.resolve(trees);
};

// Mocked for now
export const getCrossTreeById = async (id: number): Promise<CrossTree> => {
  if (id === 0) {
    return await Promise.resolve(mockCrossTree.simpleCrossTree);
  } else {
    return await Promise.resolve(mockCrossTree.mediumCrossTree);
  }
};

export const saveCrossTree = async (tree: CrossTree): Promise<void> => {
  // await invoke('save_cross_tree', { id: tree.id, tree });
  alert(JSON.stringify(tree));
};

// export const getNextTreeId = async (): Promise<number> => {
//   return await invoke('getNextTreeId');
// };
