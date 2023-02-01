import { invoke } from '@tauri-apps/api';
import { db_Tree } from 'models/db/db_Tree';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

const temp = mockCrossTree.emptyCrossTree;

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
export const insertTree = async (tree: db_Tree): Promise<void> => {
  await invoke('insert_tree', { tree });
};

// export const getNextTreeId = async (): Promise<number> => {
//   return await invoke('getNextTreeId');
// };
