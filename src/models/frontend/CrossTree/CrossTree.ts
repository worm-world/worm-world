import type { Action } from 'models/db/task/Action';
import { db_Task } from 'models/db/task/db_Task';
import { Sex } from 'models/enums';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { StrainOption } from 'models/frontend/Strain/Strain';
import { Node, Edge, XYPosition } from 'reactflow';
import { ulid } from 'ulid';

export interface iCrossTree {
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
    const ids = this.nodes
      .map((node) => parseInt(node.id))
      .concat(this.edges.map((edge) => parseInt(edge.id)));
    return ids.length > 0 ? Math.max(...ids) : -1;
  };

  private readonly instantiateCurrNode = (): Node => {
    return this.nodes.length > 0 ? this.nodes[0] : this.defaultNode;
  };

  public readonly addNode = (node: Node): void => {
    this.nodes = this.nodes.concat(node);
  };

  public readonly addNodes = (nodes: Node[]): void => {
    this.nodes = this.nodes.concat(nodes);
  };

  public readonly addEdge = (edge: Edge): void => {
    this.edges = this.edges.concat(edge);
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

  public readonly calculateChildPositions = (
    parentPos: XYPosition,
    children: StrainOption[],
    parentWidth?: number,
    childWidth?: number
  ): XYPosition[] => {
    const parWidth = parentWidth ?? 64;
    const width = childWidth ?? 256;
    const startingX = parentPos.x + parWidth / 2;
    const nodePadding = 10;
    const xDistance = width + nodePadding;
    const totalWidth = xDistance * children.length - nodePadding;
    const offSet = totalWidth / 2;
    const yPos = parentPos.y + 150;

    let currXPos = startingX - offSet;
    const positions: XYPosition[] = [];
    children.forEach((_) => {
      positions.push({
        x: currXPos,
        y: yPos,
      });
      currXPos += xDistance;
    });
    return positions;
  };

  private readonly isChildEdge = (
    edgeId: string,
    parentId: string,
    usedEdges: Set<string>
  ): boolean => edgeId === parentId && !usedEdges.has(edgeId);

  private readonly isChildNode = (
    nodeId: string,
    parentId: string,
    edgeId: string,
    usedNodes: Set<string>
  ): boolean => nodeId === edgeId && !usedNodes.has(nodeId);

  public readonly getDecendentNodesAndEdges = (
    parent: Node,
    usedNodes: Set<string> = new Set<string>(),
    usedEdges: Set<string> = new Set<string>()
  ): [Node[], Edge[]] => {
    const [graphNodes, graphEdges] = [this.nodes, this.edges];
    usedNodes.add(parent.id);

    let childEdges = graphEdges.filter((edge) =>
      this.isChildEdge(edge.source, parent.id, usedEdges)
    );
    let childNodes = childEdges.flatMap(
      (edge) =>
        graphNodes.find((node) =>
          this.isChildNode(node.id, parent.id, edge.target, usedNodes)
        ) ?? []
    );

    childNodes.forEach((node) => usedNodes.add(node.id));
    childEdges.forEach((edge) => usedEdges.add(edge.id));

    // recursively get children
    [...childNodes].forEach((child) => {
      const [recNodes, recEdges] = this.getDecendentNodesAndEdges(
        child,
        usedNodes,
        usedEdges
      );
      childNodes = childNodes.concat(recNodes);
      childEdges = childEdges.concat(recEdges);
    });

    return [childNodes, childEdges];
  };

  public readonly generateTasks = (node: Node): db_Task[] => {
    const ancestryChain = this.getAncestryChain(node);
    const treeId = ulid();
    const tasks: db_Task[] = [];
    this.generateTasksRec(treeId, ancestryChain, tasks);
    return tasks;
  };

  private readonly generateTasksRec = (
    treeId: string,
    ancestryChain: StrainAncestry,
    tasks: db_Task[]
  ): void => {
    if (ancestryChain.parents.length === 0) return;
    const strain1 = JSON.stringify(ancestryChain.parents[0].strain);
    const otherStrain = ancestryChain.parents.at(1)?.strain;
    const strain2 =
      otherStrain !== undefined ? JSON.stringify(otherStrain) : null;

    const action: Action =
      ancestryChain.parents.length === 1 ? 'SelfCross' : 'Cross';

    const task: db_Task = {
      id: ulid(),
      due_date: new Date().toString(), // todo calculate this
      action,
      strain1,
      strain2,
      notes: null,
      completed: false,
      tree_id: treeId,
    };
    tasks.push(task);

    ancestryChain.parents.forEach((chain) =>
      this.generateTasksRec(treeId, chain, tasks)
    );
  };

  private readonly getParentStrains = (child: Node): Node[] => {
    const [graphNodes, graphEdges] = [this.nodes, this.edges];
    const parentEdges = graphEdges.filter((edge) => edge.target === child.id);
    const crossIcon = parentEdges.flatMap(
      (edge) => graphNodes.find((node) => node.id === edge.source) ?? []
    );

    if (crossIcon.length === 0) return [];

    const iconParentEdges = graphEdges.filter(
      (edge) => edge.target === crossIcon[0].id
    );
    const parentStrains = iconParentEdges.flatMap(
      (edge) => graphNodes.find((node) => node.id === edge.source) ?? []
    );

    return parentStrains;
  };

  private readonly getAncestryChain = (child: Node): StrainAncestry => {
    const parents = this.getParentStrains(child);
    return {
      strain: child.data,
      parents: parents.map((parent) => this.getAncestryChain(parent)),
    };
  };
}

interface StrainAncestry {
  strain: CrossNodeModel;
  parents: StrainAncestry[];
}
