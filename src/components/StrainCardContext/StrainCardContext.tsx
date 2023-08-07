import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { createContext } from 'react';

const StrainCardContext = createContext<{
  strain: Strain;
  toggleHetPair?: (pair: AllelePair) => void;
  toggleSex?: () => void;
  showGenes: boolean;
}>({
  strain: new Strain(),
  showGenes: true,
});

export default StrainCardContext;
