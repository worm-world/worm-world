import { type db_Tree } from 'models/db/db_Tree';
import type { Action } from 'models/db/task/Action';
import { Sex } from 'models/enums';
import { type StrainNode as StrainNodeModel } from 'models/frontend/StrainNode/StrainNode';
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
import { CrossEditorFilter } from 'components/CrossFilterModal/CrossEditorFilter';
import moment from 'moment';
import { Task } from 'models/frontend/Task/Task';

export interface ICrossTree {
  name: string;
  nodes: Node[];
  edges: Edge[];
  invisibleNodes: Set<string>;
  crossFilters: Map<string, CrossEditorFilter>;
  lastSaved: Date;
  editable: boolean;
}

export interface iTaskDependencyTree {
  task: Task;
  taskParents: iTaskDependencyTree[];
}

// Uses React Flow nodes and edges. The nodes contain a data property
// which, for strain nodes, contains the model. This way,
// the tree can be traversed and relevant data gotten from it
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

  @Type(() => CrossEditorFilter)
  @Transform(
    (data: { obj: any }) => {
      const d = data?.obj?.crossFilters ?? {};
      const filters = new Map(
        Object.keys(d).map((key) => {
          const filter = CrossEditorFilter.fromJSON(JSON.stringify(d[key]));
          return [key, filter];
        }) ?? null
      );
      return filters;
    },
    { toClassOnly: true }
  )
  public crossFilters: Map<string, CrossEditorFilter>;

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
      x: 96,
      y: 137,
    };
  }

  /**
   * @param refNode Strain node that is the direct parent of the X icon
   * @returns XY coordinates of where to place the X icon in the editor
   */
  public static getXIconPos(refNode: Node): XYPosition {
    const padding = 40;
    const strainWidth = refNode.width ?? 256;
    const strainHeight = refNode.height ?? 124;
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
      rowNodes.forEach(() => {
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
   * Given an UP-TO-DATE cross tree, generates a list of all tasks for a given node
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

    // self cross task
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
