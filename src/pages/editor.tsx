import { getCrossDesign } from 'api/crossDesign';
import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import { useLocation } from 'react-router-dom';
import Editor, { NodeType } from 'components/Editor/Editor';
import { useEffect, useState } from 'react';
import Spinner from 'components/Spinner/Spinner';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { type Strain } from 'models/frontend/Strain/Strain';
import { ReactFlowProvider, type Node } from 'reactflow';
import { ChromosomePair } from 'models/frontend/ChromosomePair/ChromosomePair';
import StrainFilter from 'models/frontend/StrainFilter/StrainFilter';

const EditorPage = (): React.JSX.Element => {
  const [crossDesign, setCrossDesign] = useState<CrossDesign>();
  const crossDesignId: string = useLocation().state.crossDesignId;

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
        <Editor crossDesign={crossDesign} />
      </ReactFlowProvider>
    );
  }
};

const fixNodeDeserialization = (crossDesign: CrossDesign): void => {
  for (const node of crossDesign.nodes) {
    if (node.type === NodeType.Strain) {
      const strainNode: Node<Strain> = node;
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
    if (node.type === NodeType.X || node.type === NodeType.Self) {
      const middleNode: Node<StrainFilter> = node;
      middleNode.data.alleleNames = new Set(middleNode.data.alleleNames);
      middleNode.data.reqConditions = new Set(middleNode.data.reqConditions);
      middleNode.data.supConditions = new Set(middleNode.data.supConditions);
      middleNode.data.exprPhenotypes = new Set(middleNode.data.exprPhenotypes);
      middleNode.data.hidden = new Set(middleNode.data.hidden);
      middleNode.data = new StrainFilter({ ...middleNode.data });
    }
  }
};

export default EditorPage;
