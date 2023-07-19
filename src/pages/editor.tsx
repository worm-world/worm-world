import { getCrossDesign, updateCrossDesign } from 'api/crossDesign';
import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import { useLocation } from 'react-router-dom';
import Editor, { NodeType } from 'components/Editor/Editor';
import { useEffect, useState } from 'react';
import Spinner from 'components/Spinner/Spinner';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { type Strain } from 'models/frontend/Strain/Strain';
import { ReactFlowProvider, type Node } from 'reactflow';
import { toast } from 'react-toastify';
import { ChromosomePair } from 'models/frontend/ChromosomePair/ChromosomePair';

const EditorPage = (): React.JSX.Element => {
  const [crossDesign, setCrossDesign] = useState<CrossDesign>();
  const crossDesignId: string = useLocation().state.crossDesignId;

  useEffect(() => {
    if (crossDesign !== undefined)
      updateCrossDesign(crossDesign.generateRecord()).catch(() => {
        toast.error('Unable to save design');
      });
  }, [crossDesign]);

  useEffect(() => {
    getCrossDesign(crossDesignId)
      .then((dbCrossDesign) => {
        const crossDesign = CrossDesign.fromJSON(dbCrossDesign.data);
        fixNodeDeserialization(crossDesign);
        setCrossDesign(crossDesign);
      })
      .catch(console.error);
  }, []);

  if (crossDesign === undefined) {
    return <Spinner />;
  } else {
    return (
      <ReactFlowProvider>
        <Editor crossDesign={crossDesign} setCrossDesign={setCrossDesign} />
      </ReactFlowProvider>
    );
  }
};

const fixNodeDeserialization = (crossDesign: CrossDesign): void => {
  for (const node of crossDesign.nodes) {
    if (node.type === NodeType.Strain) {
      const strainNode: Node<Strain> = node;
      // Strain's chromPairMap deserialized as object -- should be Map
      const chromPairObj = strainNode.data.chromPairMap as unknown as Record<
        string,
        ChromosomePair
      >;
      const chromPairMap = new Map();
      for (const key in chromPairObj) {
        chromPairMap.set(
          key,
          new ChromosomePair(
            chromPairObj[key].allelePairs.map((pair: unknown) =>
              AllelePair.fromJSON(JSON.stringify(pair))
            )
          )
        );
      }
      strainNode.data.chromPairMap = chromPairMap;
    }
  }
};

export default EditorPage;
