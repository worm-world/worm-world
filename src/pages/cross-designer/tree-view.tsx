import { getCrossTreeById } from 'api/crossTree';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useLocation } from 'react-router-dom';
import CrossEditor from 'components/CrossEditor/CrossEditor';
import { useState } from 'react';

const TreeViewPage = (): JSX.Element => {
  const [currentTree, setCurrentTree]: [
    CrossTree | null,
    (tree: CrossTree) => void
  ] = useState<CrossTree | null>(null);

  const currentTreeId: string = useLocation().state.treeId;
  const currentTreePromise = getCrossTreeById(parseInt(currentTreeId));
  currentTreePromise
    .then((currentTree) => setCurrentTree(currentTree))
    .catch((err) => err);

  return <CrossEditor crossTree={currentTree} />;
};

export default TreeViewPage;
