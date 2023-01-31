import { getCrossTreeById } from 'api/crossTree';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useLocation } from 'react-router-dom';
import CrossEditor from 'components/CrossEditor/CrossEditor';
import { useEffect, useState } from 'react';

const TreeViewPage = (): JSX.Element => {
  const [currentTree, setCurrentTree]: [
    CrossTree | null,
    (tree: CrossTree | null) => void
  ] = useState<CrossTree | null>(null);

  const currentTreeId: string = useLocation().state.treeId;

  useEffect(() => {
    const currentTreePromise = getCrossTreeById(parseInt(currentTreeId));
    currentTreePromise
      .then((currentTree) => setCurrentTree(currentTree))
      .catch((err) => err);
  });

  if (currentTree === null) {
    return <>Loading</>;
  } else {
    return <CrossEditor crossTree={currentTree} />;
  }
};

export default TreeViewPage;
