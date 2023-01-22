import SavedTreeCard, {
  SavedTreeCardProps,
} from 'components/SavedTreeCard/SavedTreeCard';
import { TopNav } from 'components/TopNav/TopNav';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import { useOutletContext } from 'react-router-dom';

const CrossDesignerIndex = (): JSX.Element => {
  const [count, setCount]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useOutletContext();

  console.log('count', count);

  const tree = mockCrossTree.ed3CrossTree;
  const trees: SavedTreeCardProps[] = [
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
      <div className='m-4'>
        {trees.map((tree) => {
          return <SavedTreeCard key={tree.treeId} {...tree} />;
        })}
      </div>
    </>
  );
};
export default CrossDesignerIndex;
