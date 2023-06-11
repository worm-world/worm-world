import { type db_Tree } from 'models/db/db_Tree';
import type { Action } from 'models/db/task/Action';
import { Sex } from 'models/enums';
import { type StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import { type StrainOption } from 'models/frontend/Strain/Strain';
import { type Node, type Edge, type XYPosition } from 'reactflow';
import { ulid } from 'ulid';
import {
  instanceToPlain,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import { FlowType } from 'components/CrossFlow/CrossFlow';
import { OffspringFilter } from 'components/OffspringFilter/OffspringFilter';
import moment from 'moment';
import { Task } from 'models/frontend/Task/Task';
import {
  STRAIN_NODE_HEIGHT,
  STRAIN_NODE_WIDTH,
} from 'components/StrainNode/StrainNode';

export const NODE_PADDING = 32;
// middle nodes (X or Self)
export const MIDDLE_NODE_HEIGHT = 64;
export const MIDDLE_NODE_WIDTH = 64;

export interface ICrossTree {
  name: string;
  nodes: Node[];
  edges: Edge[];
  invisibleNodes: Set<string>;
  crossFilters: Map<string, OffspringFilter>;
  lastSaved: Date;
  editable: boolean;
}

export interface iTaskDependencyTree {
  task: Task;
  taskParents: iTaskDependencyTree[];
}

// Uses React Flow nodes and edges. The nodes contain a data property
// which, for strain nodes, contains the model.
export default class CrossTree {
  /** #region class vars / initialization */
  public readonly id: string;
  public name: string;
  public editable: boolean;
  @Type(() => Date)
  public lastSaved: Date;

  @Transform((data: { obj: any }) => {
    const nodeList = data?.obj?.invisibleNodes;
    return new Set(nodeList);
  })
  public invisibleNodes: Set<string>;

  @Type(() => OffspringFilter)
  @Transform(
    (data: { obj: any }) => {
      const d = data?.obj?.crossFilters ?? {};
      const filters = new Map(
        Object.keys(d).map((key) => {
          const filter = OffspringFilter.fromJSON(JSON.stringify(d[key]));
          return [key, filter];
        }) ?? null
      );
      return filters;
    },
    { toClassOnly: true }
  )
  public crossFilters: Map<string, OffspringFilter>;

  public nodes: Node[];
  public edges: Edge[];

  constructor(params: ICrossTree) {
    if (params === null || params === undefined) {
      params = {
        name: '',
        nodes: [],
        edges: [],
        invisibleNodes: new Set(),
        crossFilters: new Map(),
        lastSaved: new Date(),
        editable: true,
      };
    }
    this.id = ulid();
    this.name = params.name;
    this.lastSaved = params.lastSaved;
    this.edges = [...params.edges];
    this.nodes = [...params.nodes];
    this.invisibleNodes = new Set(params.invisibleNodes);
    this.crossFilters = new Map(params.crossFilters);
    this.editable = params.editable;
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
      x: STRAIN_NODE_WIDTH / 2 - MIDDLE_NODE_WIDTH / 2,
      y: STRAIN_NODE_HEIGHT + NODE_PADDING,
    };
  }

  /**
   * @param refNode Strain node that is the direct parent of the X icon
   * @returns XY coordinates of where to place the X icon in the editor
   */
  public static getXIconPos(refNode: Node): XYPosition {
    const x =
      refNode.data.sex === Sex.Male
        ? STRAIN_NODE_WIDTH + NODE_PADDING
        : -MIDDLE_NODE_WIDTH - NODE_PADDING;
    const y = STRAIN_NODE_HEIGHT / 2 - MIDDLE_NODE_HEIGHT / 2;
    return { x, y };
  }

  /**
   * @returns XY coordinates of where to place the other strain created from the form
   */
  public static getMatedStrainPos(sex: Sex): XYPosition {
    const x =
      (STRAIN_NODE_WIDTH + NODE_PADDING + MIDDLE_NODE_WIDTH + NODE_PADDING) *
      (sex === Sex.Male ? 1 : -1);
    return { x, y: 0 };
  }

  /**
   *
   * @param parentIcon Self or XIcon that will be parent of all child strains
   * @returns List of XY coordinates (relative to middle node position)
   * where each index corresponds with the indices in the children list
   */
  public static calculateChildPositions(
    middleNodeType: FlowType.XIcon | FlowType.SelfIcon,
    childOptions: StrainOption[]
  ): XYPosition[] {
    const positions: XYPosition[] = [];
    const maxNodesInRow = 5;
    const xMidpoint = MIDDLE_NODE_WIDTH / 2;
    const deltaX = STRAIN_NODE_WIDTH + NODE_PADDING;
    const deltaY = STRAIN_NODE_HEIGHT + NODE_PADDING;

    let y =
      middleNodeType === FlowType.XIcon
        ? MIDDLE_NODE_HEIGHT / 2 + STRAIN_NODE_HEIGHT / 2 + 3 * NODE_PADDING
        : MIDDLE_NODE_HEIGHT + NODE_PADDING;
    for (let i = 0; i < childOptions.length; i += maxNodesInRow) {
      const nodesInRow = childOptions.slice(i, i + maxNodesInRow);
      const rowWidth = deltaX * nodesInRow.length - NODE_PADDING;
      let x = xMidpoint - rowWidth / 2;
      nodesInRow.forEach(() => {
        positions.push({ x, y });
        x += deltaX;
      });
      y += deltaY;
    }

    return positions;
  }

  static fromJSON(json: string): CrossTree {
    return [plainToInstance(CrossTree, JSON.parse(json))].flat()[0];
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  public createId(): string {
    return ulid();
  }

  public clone(): CrossTree {
    const treeProps: ICrossTree = {
      name: this.name,
      nodes: [...this.nodes],
      invisibleNodes: new Set(this.invisibleNodes),
      crossFilters: new Map(this.crossFilters),
      edges: [...this.edges],
      lastSaved: new Date(),
      editable: this.editable,
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
   * Given a cross tree, generates a list of all tasks for a given node
   */
  public generateTasks(node: Node): Task[] {
    const ancestryChain = this.getAncestryChain(node);
    const taskDepTree = this.generateTasksRec(ancestryChain);
    if (taskDepTree === undefined) {
      return [];
    }
    this.addDatesToTasks(taskDepTree);
    const tasks: Task[] = [];
    this.makeTreeIntoArray(taskDepTree, tasks);
    return tasks;
  }

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
    ancestryChain: StrainAncestry
  ): iTaskDependencyTree | undefined {
    if (ancestryChain.parents.length === 0) return undefined;

    const [strain1, strain2] = ancestryChain.parents.map((parent) =>
      JSON.stringify(instanceToPlain(parent.strain))
    );

    const result = JSON.stringify(instanceToPlain(ancestryChain.strain));

    const action: Action =
      ancestryChain.parents.length === 1 ? 'SelfCross' : 'Cross';

    const taskParents = ancestryChain.parents.flatMap(
      (parent: StrainAncestry) => this.generateTasksRec(parent) ?? [] // handle undefined
    );

    const task = new Task({
      id: ulid(),
      due_date: moment().toDate().toString(), // todo calculate this
      action,
      strain1,
      strain2: strain2 ?? null,
      result,
      notes: null,
      completed: false,
      tree_id: this.id,
    });
    return {
      task,
      taskParents,
    };
  }

  private addDays(days: number, date?: Date): Date {
    return moment(date).add(days, 'days').toDate();
  }

  private addDatesToTasks(taskDeps: iTaskDependencyTree): void {
    const defaultMaturationDay = 3;
    taskDeps.taskParents.forEach((parent) => {
      this.addDatesToTasks(parent);
    });

    if (taskDeps.taskParents.length === 0) {
      taskDeps.task.dueDate = moment().toDate();
      return;
    }

    // self-cross task
    const parent0 = taskDeps.taskParents[0].task.result;
    let maturationDays =
      parent0?.strain.getMaturationDays() ?? defaultMaturationDay;
    if (taskDeps.taskParents.length === 1) {
      taskDeps.task.dueDate = this.addDays(
        maturationDays,
        taskDeps.taskParents[0].task.dueDate
      );
      return;
    }

    // cross between 2 strains.
    const parent1 = taskDeps.taskParents[1].task.result;
    maturationDays = Math.max(
      parent0?.strain.getMaturationDays() ?? defaultMaturationDay,
      parent1?.strain.getMaturationDays() ?? defaultMaturationDay
    );
    const parent0DueDate = moment(taskDeps.taskParents[0].task.dueDate);
    const parent1DueDate = moment(taskDeps.taskParents[1].task.dueDate);
    const latestParentDate = parent0DueDate.isAfter(parent1DueDate)
      ? parent0DueDate.toDate()
      : parent1DueDate.toDate();

    taskDeps.task.dueDate = this.addDays(maturationDays, latestParentDate);

    // Determine if a parent tree needs to be started later in time (rather than today)
    const dueDateDiff = parent0DueDate.diff(parent1DueDate, 'days');
    if (Math.abs(dueDateDiff) >= maturationDays) {
      const parentToBump = parent0DueDate.isAfter(parent1DueDate)
        ? taskDeps.taskParents[1]
        : taskDeps.taskParents[0];

      this.bumpDatesBack(parentToBump, dueDateDiff);
    }
  }

  private bumpDatesBack(
    tree: iTaskDependencyTree,
    daysToBumpBack: number
  ): void {
    tree.task.dueDate = this.addDays(daysToBumpBack, tree.task.dueDate);
    tree.taskParents.forEach((parent) => {
      this.bumpDatesBack(parent, daysToBumpBack);
    });
  }

  private makeTreeIntoArray(tree: iTaskDependencyTree, tasks: Task[]): void {
    tasks.push(tree.task);
    tree.taskParents.forEach((parent) => {
      this.makeTreeIntoArray(parent, tasks);
    });
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
  strain: StrainNodeModel;
  parents: StrainAncestry[];
}
