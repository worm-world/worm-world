import { db_Tree } from 'models/db/db_Tree';
import type { Action } from 'models/db/task/Action';
import { db_Task } from 'models/db/task/db_Task';
import { Sex } from 'models/enums';
import { iCrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { StrainOption } from 'models/frontend/Strain/Strain';
import { Node, Edge, XYPosition } from 'reactflow';
import { ulid } from 'ulid';
import { instanceToPlain, plainToInstance, Type } from 'class-transformer';
import { FlowType } from 'components/CrossFlow/CrossFlow';

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
  /** #region class vars / initialization */
  public readonly id: string;
  public name: string;
  public description: string;
  @Type(() => Date)
  public lastSaved: Date;

  public nodes: Node[];
  public edges: Edge[];
  public settings: {
    longName: boolean;
    contents: boolean;
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
  }
  /** #endregion class vars / initialization */

  /**
   * Flexible method allowing you to remove all edges with a {sourceId},
   * OR all edges with a {targetId}
   * OR all edges that have both the specified {sourceId} AND {targetId}
   *
   * @param sourceId -- string id of the source node of the edge
   * @param targetId -- string id of the target node of the edge
   */
  public static removeEdges(
    edges: Edge[],
    {
      sourceId,
      targetId,
    }: {
      sourceId?: string;
      targetId?: string;
    }
  ): Edge[] {
    const sourceFilter = (edge: Edge): boolean => edge.source !== sourceId;
    const targetFilter = (edge: Edge): boolean => edge.target !== targetId;
    let combinedFilter = (_: Edge): boolean => true;
    if (sourceId !== undefined) combinedFilter = sourceFilter;
    if (targetId !== undefined) combinedFilter = targetFilter;
    if (sourceId !== undefined && targetId !== undefined)
      combinedFilter = (edge: Edge) => sourceFilter(edge) || targetFilter(edge);

    return edges.filter(combinedFilter);
  }

  /* #region public static methods */
  /**
   * @param refNode Strain node that is the direct parent of the self icon
   * @returns XY coordinates of where to place the self icon in the editor
   */
  public static getSelfIconPos(): XYPosition {
    return {
      x: 96,
      y: 125,
    };
  }

  /**
   * @param refNode Strain node that is the direct parent of the X icon
   * @returns XY coordinates of where to place the X icon in the editor
   */
  public static getXIconPos(refNode: Node): XYPosition {
    const padding = 40;
    const strainWidth = refNode.width ?? 256;
    const strainHeight = refNode.height ?? 100;
    const xSide = 64;
    const x = // place on left/right side of refNode
      refNode.data.sex === Sex.Male ? strainWidth + padding : -xSide - padding;

    const y = strainHeight / 2 - xSide / 2;
    return { x, y };
  }

  /**
   * @param refNode "floating" strain node in editor that is being crossed with strain created from form
   * @returns XY coordinates of where to place the other strain created from the form
   */
  public static getCrossStrainPos(refNodeSex: Sex): XYPosition {
    const posX = refNodeSex === Sex.Male ? 400 : -400; // place on left/right side of refNode
    return { x: posX, y: 0 };
  }

  /**
   *
   * @param parentIcon Self or XIcon that will be parent of all child strains
   * @param refStrain One of the parent strains (used to determine size and placement)
   * @param children List of all children resulting from the cross
   * @returns List of XY coordinates where each index corresponds with the indices in the children list
   */
  public static calculateChildPositions(
    parentIcon: Node,
    refStrain: Node,
    children: StrainOption[]
  ): XYPosition[] {
    const positions: XYPosition[] = [];
    const nodesPerRow = 5;
    const rowHeight = 150;

    const parWidth = parentIcon.width ?? 64;
    const parHeight = parentIcon.height ?? 64;
    const width = refStrain.width ?? 256;
    const startingX = parWidth / 2;
    const nodePadding = 10;
    const xDistance = width + nodePadding;

    let currYPos = 187;
    if (parentIcon.type === FlowType.SelfIcon) currYPos -= parHeight + 37;

    // Determines grid layout of children
    for (let i = 0; i < children.length; i += nodesPerRow) {
      const rowNodes = children.slice(i, i + nodesPerRow);
      const totalWidth = xDistance * rowNodes.length - nodePadding;
      const offSet = totalWidth / 2;
      let currXPos = startingX - offSet;
      rowNodes.forEach((_) => {
        positions.push({
          x: currXPos,
          y: currYPos,
        });
        currXPos += xDistance;
      });
      currYPos += rowHeight;
    }

    return positions;
  }

  /**
   * Given a graph and a parent node, recursively fetches all of that node's children nodes/edges
   * @param graphNodes List of all nodes
   * @param graphEdges List of all edges
   * @param parent Node to get all the children from
   * @param usedNodes Mark nodes already seen (to prevent cycles). Autoinitilized, so can be left blank when the function
   * @param usedEdges Mark edges already seen (to prevent cycles). Autoinitilized, so can be left blank when the function
   */
  public static getDecendentNodesAndEdges(
    graphNodes: Node[],
    graphEdges: Edge[],
    parent: Node,
    usedNodes: Set<string> = new Set<string>(),
    usedEdges: Set<string> = new Set<string>()
  ): [Node[], Edge[]] {
    usedNodes.add(parent.id);

    // Get next generation of decendents
    let childEdges = graphEdges.filter((edge) =>
      this.isChildEdge(edge.source, parent.id, usedEdges)
    );
    let childNodes = childEdges.flatMap(
      (edge) =>
        graphNodes.find((node) => this.isChildNode(node, edge, usedNodes)) ?? []
    );

    // Mark nodes/edges as seen
    childNodes.forEach((node) => usedNodes.add(node.id));
    childEdges.forEach((edge) => usedEdges.add(edge.id));

    // recursively get future generations
    [...childNodes].forEach((child) => {
      const [recNodes, recEdges] = this.getDecendentNodesAndEdges(
        graphNodes,
        graphEdges,
        child,
        usedNodes,
        usedEdges
      );
      childNodes = childNodes.concat(recNodes);
      childEdges = childEdges.concat(recEdges);
    });

    return [childNodes, childEdges];
  }

  static fromJSON(json: string): CrossTree {
    return [plainToInstance(CrossTree, JSON.parse(json))].flat()[0];
  }
  /* #endregion public static methods */

  /* #region public class methods */
  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  /** Generates a ULID */
  public createId(): string {
    return ulid();
  }

  /** Creates a copy of this cross tree */
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

  /**
   * @param editable Mark whether this tree can be edited or not
   * @returns db record of this tree
   */
  public generateRecord(editable: boolean): db_Tree {
    return {
      id: this.id,
      name: this.name,
      data: this.toJSON(),
      lastEdited: this.lastSaved.toString(),
      editable,
    };
  }

  /**
   * Given an UP-TO-DATE cross tree, generates a list of all tasks for a given node
   */
  public generateTasks(node: Node): db_Task[] {
    const ancestryChain = this.getAncestryChain(node);
    const tasks: db_Task[] = [];
    this.generateTasksRec(ancestryChain, tasks);
    return tasks;
  }
  /* #endregion public class methods */

  /* #region private helper methods */
  private static isChildEdge(
    edgeSourceId: string,
    parentNodeId: string,
    usedEdges: Set<string>
  ): boolean {
    return edgeSourceId === parentNodeId && !usedEdges.has(edgeSourceId);
  }

  /**
   * Given a child edge, checks if the candidate node is a child
   */
  private static isChildNode(
    candidateNode: Node,
    childEdge: Edge,
    usedNodes: Set<string>
  ): boolean {
    return (
      candidateNode.id === childEdge.target && !usedNodes.has(candidateNode.id)
    );
  }

  /**
   * Recursive function to determine the hierarchy of tasks to complete
   * @param ancestryChain hierarchy of parents for a given strain
   * @param tasks list of tasks that is being mutated through each call of the function
   * @returns
   */
  private generateTasksRec(
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
      tree_id: this.id,
    };
    tasks.push(task);

    ancestryChain.parents.forEach((chain) =>
      this.generateTasksRec(chain, tasks)
    );
  }

  /**
   * Given a child node and an UP-TO-DATE cross tree, gets that child's parents as a list
   */
  private getParentStrains(child: Node): Node[] {
    const [graphNodes, graphEdges] = [this.nodes, this.edges];
    const parentEdges = graphEdges.filter((edge) => edge.target === child.id);
    const crossIconEdges = parentEdges.flatMap(
      (edge) => graphNodes.find((node) => node.id === edge.source) ?? []
    );

    if (crossIconEdges.length === 0) return [];

    const iconParentEdges = graphEdges.filter(
      (edge) => edge.target === crossIconEdges[0].id
    );
    const parentStrains = iconParentEdges.flatMap(
      (edge) => graphNodes.find((node) => node.id === edge.source) ?? []
    );

    return parentStrains;
  }

  /**
   * Recursively generates a hierarchy of ancestors for a given node
   */
  private getAncestryChain(child: Node): StrainAncestry {
    const parents = this.getParentStrains(child);
    return {
      strain: child.data,
      parents: parents.map((parent) => this.getAncestryChain(parent)),
    };
  }
  /* #endregion private helper methods */
}

/**
 * Representation of a family tree allowing you to link a strain with one or more parents
 * and link parents with one or more parents, etc.
 */
interface StrainAncestry {
  strain: iCrossNodeModel;
  parents: StrainAncestry[];
}
