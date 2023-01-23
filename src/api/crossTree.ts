import CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

// Mocked for now
export const getAllCrossTrees = async (): Promise<CrossTree[]> => {
  //   return await invoke('get_all_cross_trees');
  const trees: CrossTree[] = [
    mockCrossTree.simpleCrossTree,
    mockCrossTree.mediumCrossTree,
  ];
  return await Promise.resolve(trees);
};

// export const saveCrossTree = async (tree: CrossTree): Promise<void> => {
//   await invoke('save_cross_tree', { id: tree.id, tree });
// };

// export const getNextTreeId = async (): Promise<number> => {
//   return await invoke('getNextTreeId');
// };
