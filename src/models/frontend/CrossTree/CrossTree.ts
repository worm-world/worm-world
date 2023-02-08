import { db_Tree } from 'models/db/db_Tree';
import type { Action } from 'models/db/task/Action';
import { db_Task } from 'models/db/task/db_Task';
import { Sex } from 'models/enums';
import { iCrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { StrainOption } from 'models/frontend/Strain/Strain';
import { Node, Edge, XYPosition } from 'reactflow';
import { ulid } from 'ulid';
import {
  Exclude,
  instanceToPlain,
  plainToInstance,
  Type,
} from 'class-transformer';

export interface iCrossTree {
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
  public readonly id: string;
  public name: string;
  public description: string;
  @Type(() => Date)
  public lastSaved: Date;

  public settings: {
    longName: boolean;
    contents: boolean;
  };

  // @Type(() => Node)
  public nodes: Node[];

  public edges: Edge[];
  private currId: number;

  @Exclude()
  private currNode: Node;

  @Exclude()
  private readonly defaultNode: Node = {
    id: '-1',
    position: { x: 0, y: 0 },
    data: {},
  };

  constructor(params: iCrossTree) {
    if (params === null || params === undefined) {
      params = {
        name: '',
        description: '',
        settings: {
          longName: false,
          contents: false,
        },
        nodes: [],
        edges: [],
        lastSaved: new Date(),
      };
    }
    this.id = ulid();
    this.name = params.name;
    this.description = params.description;
    this.lastSaved = params.lastSaved;
    this.settings = params.settings;
    this.edges = [...params.edges];
    this.nodes = [...params.nodes];
    this.currId = this.instantiateCurrId();
    this.currNode = this.instantiateCurrNode();
  }

  static fromJSON(json: string): CrossTree {
    return [plainToInstance(CrossTree, JSON.parse(json))].flat()[0];
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  private instantiateCurrId(): number {
    const ids = this.nodes
      .map((node) => parseInt(node.id))
      .concat(this.edges.map((edge) => parseInt(edge.id)));
    return ids.length > 0 ? Math.max(...ids) : -1;
  }

  private instantiateCurrNode(): Node {
    return this.nodes.length > 0 ? this.nodes[0] : this.defaultNode;
  }

  public addNode(node: Node): void {
    this.nodes = this.nodes.concat(node);
  }

  public addNodes(nodes: Node[]): void {
    this.nodes = this.nodes.concat(nodes);
  }

  public removeNode(toRemove: Node): void {
    if (toRemove !== this.defaultNode) {
      this.nodes = this.nodes.filter((node) => node.id !== toRemove.id);
    }
  }

  public addEdge(edge: Edge): void {
    this.edges = this.edges.concat(edge);
  }

  public addEdges(edges: Edge[]): void {
    edges.forEach((edge) => this.addEdge(edge));
  }

  /**
   * Flexible method allowing you to remove all edges with a {sourceId},
   * OR all edges with a {targetId}
   * OR all edges that have both the specified {sourceId} AND {targetId}
   *
   * @param sourceId -- string id of the source node of the edge
   * @param targetId -- string id of the target node of the edge
   */
  public removeEdges({
    sourceId,
    targetId,
  }: {
    sourceId?: string;
    targetId?: string;
  }): void {
    const sourceFilter = (edge: Edge): boolean => edge.source !== sourceId;
    const targetFilter = (edge: Edge): boolean => edge.target !== targetId;
    let combinedFilter = (_: Edge): boolean => true;
    if (sourceId !== undefined) combinedFilter = sourceFilter;
    if (targetId !== undefined) combinedFilter = targetFilter;
    if (sourceId !== undefined && targetId !== undefined)
      combinedFilter = (edge: Edge) => sourceFilter(edge) || targetFilter(edge);

    this.edges = this.edges.filter(combinedFilter);
  }

  public getCurrId(): string {
    return this.currId.toString();
  }

  public getNextId(): string {
    return (++this.currId).toString();
  }

  public getSelfIconPos(): XYPosition {
    return {
      x: this.currNode.position.x + 96,
      y: this.currNode.position.y + 150,
    };
  }

  public getXIconPos(): XYPosition {
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
  }

  public getCrossStrainPos(): XYPosition {
    const posX =
      this.currNode.data.sex === Sex.Male
        ? this.currNode.position.x + 400
        : this.currNode.position.x - 400;
    return { x: posX, y: this.currNode.position.y };
  }

  public getNodeById(nodeId: string): Node {
    return this.nodes.find((node) => node.id === nodeId) ?? this.defaultNode;
  }

  public setCurrNode(nodeId: string): void {
    this.currNode = this.getNodeById(nodeId);
  }

  public getCurrNode(): Node {
    return this.currNode;
  }

  public calculateChildPositions(
    parentPos: XYPosition,
    children: StrainOption[],
    parentWidth?: number,
    childWidth?: number
  ): XYPosition[] {
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
  }

  private isChildEdge(
    edgeId: string,
    parentId: string,
    usedEdges: Set<string>
  ): boolean {
    return edgeId === parentId && !usedEdges.has(edgeId);
  }

  private isChildNode(node: Node, edge: Edge, usedNodes: Set<string>): boolean {
    return node.id === edge.target && !usedNodes.has(node.id);
  }

  public getDecendentNodesAndEdges(
    parent: Node,
    usedNodes: Set<string> = new Set<string>(),
    usedEdges: Set<string> = new Set<string>()
  ): [Node[], Edge[]] {
    const [graphNodes, graphEdges] = [this.nodes, this.edges];
    usedNodes.add(parent.id);

    let childEdges = graphEdges.filter((edge) =>
      this.isChildEdge(edge.source, parent.id, usedEdges)
    );
    let childNodes = childEdges.flatMap(
      (edge) =>
        graphNodes.find((node) => this.isChildNode(node, edge, usedNodes)) ?? []
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
  }

  public generateTasks(node: Node): db_Task[] {
    const ancestryChain = this.getAncestryChain(node);
    const treeId = this.id;
    const tasks: db_Task[] = [];
    this.generateTasksRec(treeId, ancestryChain, tasks);
    return tasks;
  }

  private generateTasksRec(
    treeId: string,
    ancestryChain: StrainAncestry,
    tasks: db_Task[]
  ): void {
    if (ancestryChain.parents.length === 0) return;

    const strain1String = JSON.stringify(
      instanceToPlain(ancestryChain.parents[0].strain)
    );

    let strain2String: string | null = null;
    if (ancestryChain.parents.at(1) !== undefined) {
      strain2String = JSON.stringify(
        instanceToPlain(ancestryChain.parents.at(1)?.strain)
      );
    }

    const action: Action =
      ancestryChain.parents.length === 1 ? 'SelfCross' : 'Cross';

    const task: db_Task = {
      id: ulid(),
      due_date: new Date().toString(), // todo calculate this
      action,
      strain1: strain1String,
      strain2: strain2String,
      notes: null,
      completed: false,
      tree_id: treeId,
    };
    tasks.push(task);

    ancestryChain.parents.forEach((chain) =>
      this.generateTasksRec(treeId, chain, tasks)
    );
  }

  private getParentStrains(child: Node): Node[] {
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
  }

  private getAncestryChain(child: Node): StrainAncestry {
    const parents = this.getParentStrains(child);
    return {
      strain: child.data,
      parents: parents.map((parent) => this.getAncestryChain(parent)),
    };
  }

  public clone(): CrossTree {
    const treeProps: iCrossTree = {
      name: this.name,
      description: this.description,
      settings: {
        longName: false,
        contents: false,
      },
      nodes: [...this.nodes],
      edges: [...this.edges],
      lastSaved: new Date(),
    };
    const tree = new CrossTree(treeProps);
    return tree;
  }

  public generateRecord(editable: boolean): db_Tree {
    return {
      id: this.id,
      name: this.name,
      data: JSON.stringify(instanceToPlain(this)),
      lastEdited: this.lastSaved.toString(),
      editable,
    };
  }
}

interface StrainAncestry {
  strain: iCrossNodeModel;
  parents: StrainAncestry[];
}
