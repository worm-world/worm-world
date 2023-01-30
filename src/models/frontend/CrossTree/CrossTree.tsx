import { Sex } from 'models/enums';
import { Gene } from 'models/frontend/Gene/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import { Node, Edge, XYPosition } from 'reactflow';

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
  public readonly id: number;
  public name: string;
  public description: string;
  public lastSaved: Date;
  public settings: {
    longName: boolean;
    contents: boolean;
  };

  public nodes: Node[];
  public edges: Edge[];
  private currId: number;
  private currNode: Node;
  private readonly defaultNode: Node = {
    id: '-1',
    position: { x: 0, y: 0 },
    data: {},
  };

  constructor(params: iCrossTree) {
    this.id = params.id; // TODO: Get from DB if undefined to ensure uniqueness
    this.name = params.name;
    this.description = params.description;
    this.lastSaved = params.lastSaved;
    this.settings = params.settings;
    this.edges = [...params.edges];
    this.nodes = [...params.nodes];
    this.currId = this.instantiateCurrId();
    this.currNode = this.instantiateCurrNode();
  }

  private readonly instantiateCurrId = (): number => {
    if (this.nodes.length > 0) {
      return Math.max(...this.nodes.map((node) => parseInt(node.id)));
    } else return 0;
  };

  private readonly instantiateCurrNode = (): Node => {
    return this.nodes.length > 0 ? this.nodes[0] : this.defaultNode;
  };

  public readonly addNode = (node: Node): void => {
    this.nodes.push(node);
  };

  public readonly addNodes = (nodes: Node[]): void => {
    nodes.forEach((node) => this.addNode(node));
  };

  public readonly addEdge = (edge: Edge): void => {
    this.edges.push(edge);
  };

  public readonly addEdges = (edges: Edge[]): void => {
    edges.forEach((edge) => this.addEdge(edge));
  };

  public readonly getCurrId = (): string => this.currId.toString();
  public readonly getNextId = (): string => (++this.currId).toString();

  public readonly getSelfIconPos = (): XYPosition => {
    return {
      x: this.currNode.position.x + 96,
      y: this.currNode.position.y + 150,
    };
  };

  public readonly getXIconPos = (): XYPosition => {
    const padding = 40;
    const strainWidth = this.currNode.width ?? 256;
    const strainHeight = this.currNode.height ?? 100;
    const xSide = 64;
    const x =
      this.currNode.data.sex === Sex.Male
        ? this.currNode.position.x + strainWidth + padding
        : this.currNode.position.x - xSide - padding;

    const y = this.currNode.position.y + strainHeight / 2 - xSide / 2;
    return { x, y };
  };

  public readonly getCrossStrainPos = (): XYPosition => {
    const posX =
      this.currNode.data.sex === Sex.Male
        ? this.currNode.position.x + 400
        : this.currNode.position.x - 400;
    return { x: posX, y: this.currNode.position.y };
  };

  public readonly setCurrNode = (nodeId: string): void => {
    const nodeToSet =
      this.nodes.find((node) => node.id === nodeId) ?? this.defaultNode;
    this.currNode = nodeToSet;
  };

  public readonly getCurrNode = (): Node => this.currNode;
}
