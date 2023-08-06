import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { createContext } from 'react';

const defaultFunction = (): void => {};

const StrainCardContext = createContext<{
  strain: Strain;
  toggleHetPair: (pair: AllelePair) => void;
  toggleSex: () => void;
  showGenes: boolean;
}>({
  strain: new Strain(),
  toggleHetPair: defaultFunction,
  toggleSex: defaultFunction,
  showGenes: true,
});

export default StrainCardContext;
