import { Gene } from '../Gene/Gene';
import { VariationInfo } from '../VariationInfo/VariationInfo';
import { Node, Edge } from 'reactflow';

interface iCrossTree {
  id: number;
  name: string;
  description: string;
  settings: {
    // AKA toggles
    longName: boolean;
    contents: boolean;
  };
  nodes: Node[];
  edges: Edge[];
  lastSaved: Date;
  genes: Gene[]; // To display in each node
  variations: VariationInfo[]; // To display in each node
}

// Uses React Flow nodes and edges. The nodes contain a data property
// which, for cross nodes, contains the model. This way,
// the tree can be traversed and relevant data gotten from it
export default class CrossTree {
  id: number;
  name: string;
  description: string;
  lastSaved: Date;

  settings: {
    longName: boolean;
    contents: boolean;
  };

  nodes: Node[];
  edges: Edge[];

  constructor(params: iCrossTree) {
    this.id = params.id; // TODO: Get from DB if undefined to ensure uniqueness
    this.name = params.name;
    this.description = params.description;
    this.lastSaved = params.lastSaved;
    this.settings = params.settings;
    this.nodes = params.nodes;
    this.edges = params.edges;
  }
}