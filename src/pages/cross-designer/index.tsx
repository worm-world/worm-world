import SavedTreeCard, {
  SavedTreeCardProps,
} from 'components/SavedTreeCard/SavedTreeCard';
import { TopNav } from 'components/TopNav/TopNav';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import { useOutletContext } from 'react-router-dom';

const CrossDesignerIndex = (): JSX.Element => {
  // Trees will come from some API call
  const tree = mockCrossTree.ed3CrossTree;
  const trees: SavedTreeCardProps[] = [
    {
      treeId: tree.id,
      name: tree.name,
      description: tree.description,
      lastSaved: tree.lastSaved,
    },
    {
      treeId: tree.id,
      name: tree.name,
      description: tree.description,
      lastSaved: tree.lastSaved,
    },
    {
      treeId: tree.id,
      name: tree.name,
      description: tree.description,
      lastSaved: tree.lastSaved,
    },
    {
      treeId: tree.id,
      name: tree.name,
      description: tree.description,
      lastSaved: tree.lastSaved,
    },
    {
      treeId: tree.id,
      name: tree.name,
      description: tree.description,
      lastSaved: tree.lastSaved,
    },
  ];
  return (
    <>
      <TopNav title={'Cross Designer'}></TopNav>
      <div className='m-8 flex flex-wrap gap-10'>
        {trees.map((tree) => {
          return <SavedTreeCard key={tree.treeId} {...tree} />;
        })}
      </div>
    </>
  );
};
export default CrossDesignerIndex;
