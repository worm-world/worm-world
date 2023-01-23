import SavedTreeCard, {
  SavedTreeCardProps,
} from 'components/SavedTreeCard/SavedTreeCard';
import { TopNav } from 'components/TopNav/TopNav';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

const CrossDesignerIndex = (): JSX.Element => {
  // Trees will come from some API call
  const trees: SavedTreeCardProps[] = [
    {
      tree: mockCrossTree.simpleCrossTree,
      name: mockCrossTree.simpleCrossTree.name,
      description: mockCrossTree.simpleCrossTree.description,
      lastSaved: mockCrossTree.simpleCrossTree.lastSaved,
    },
    {
      tree: mockCrossTree.mediumCrossTree,
      name: mockCrossTree.mediumCrossTree.name,
      description: mockCrossTree.mediumCrossTree.description,
      lastSaved: mockCrossTree.mediumCrossTree.lastSaved,
    },
  ];
  return (
    <>
      <TopNav title={'Cross Designer'}></TopNav>
      <div className='m-8 flex flex-wrap gap-10'>
        {trees.map((tree, index) => {
          return <SavedTreeCard key={index} {...tree} />;
        })}
      </div>
    </>
  );
};
export default CrossDesignerIndex;
