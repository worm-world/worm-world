import { type MenuItem } from 'components/Menu/Menu';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { createContext } from 'react';

const EditorContext = createContext<{
  showGenes: boolean;
  openNote?: (id: string) => void;
  toggleHetPair?: (id: string, pair: AllelePair) => void;
  toggleSex?: (id: string) => void;
  getMenuItems?: (id: string) => MenuItem[];
}>({
  showGenes: true,
});

export default EditorContext;
