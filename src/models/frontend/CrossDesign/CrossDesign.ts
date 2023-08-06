import type { Action } from 'models/db/task/db_Action';
import { Sex } from 'models/enums';
import { Strain } from 'models/frontend/Strain/Strain';
import { type Node, type Edge, type XYPosition, getIncomers } from 'reactflow';
import { ulid } from 'ulid';
import {
  instanceToPlain,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import { StrainFilter } from 'models/frontend/StrainFilter/StrainFilter';
import moment from 'moment';
import { Task } from 'models/frontend/Task/Task';
import {
  STRAIN_NODE_HEIGHT,
  STRAIN_NODE_WIDTH,
} from 'components/StrainNode/StrainNode';
import { NodeType } from 'components/Editor/Editor';
import { type db_CrossDesign } from 'models/db/db_CrossDesign';

export const NODE_PADDING = 36;
// middle nodes (X or Self)
export const MIDDLE_NODE_HEIGHT = 64;
export const MIDDLE_NODE_WIDTH = 64;

export interface ICrossDesign {
  name: string;
  nodes: Node[];
  edges: Edge[];
  strainFilters: Map<string, StrainFilter>;
  lastSaved: Date;
  editable: boolean;
  id?: string;
}

export interface TaskTree {
  task: Task;
  taskParents: TaskTree[];
}

export const addToArray = <T extends { id: string }>(
  items: T[],
  ...newItems: T[]
): T[] => {
  items = [...items];
  newItems.forEach((newItem) => {
    const idx = items.findIndex((item) => item.id === newItem.id);
    if (idx > 0) {
      items.splice(idx, 1, newItem);
    } else {
      items.push(newItem);
    }
  });
  return items;
};

export default class CrossDesign {
  public readonly id: string;
  public name: string;
  public editable: boolean;
  @Type(() => Date)
  public lastSaved: Date;

  @Type(() => StrainFilter)
  @Transform(
    (data: { obj: any }) => {
      const d = data?.obj?.strainFilters ?? {};
      const filters = new Map(
        Object.keys(d).map((key) => {
          const filter = StrainFilter.fromJSON(JSON.stringify(d[key]));
          return [key, filter];
        }) ?? null
      );
      return filters;
    },
    { toClassOnly: true }
  )
  public strainFilters: Map<string, StrainFilter>;

  @Transform(
    (data: { obj: any }) => {
      const nodes: Node[] = data?.obj?.nodes ?? [];
      return nodes.map((node) => {
        if (node.type === NodeType.Strain)
          node.data = new Strain((node as Node<Strain>).data);
        return node;
      });
    },
    { toClassOnly: true }
  )
  public nodes: Node[];

  public edges: Edge[];

  constructor(params: ICrossDesign) {
    if (params === null || params === undefined) {
      params = {
        name: '',
        nodes: [],
        edges: [],
        strainFilters: new Map(),
        lastSaved: new Date(),
        editable: false,
      };
    }
    this.id = params.id ?? ulid();
    this.name = params.name;
    this.lastSaved = params.lastSaved;
    this.edges = [...params.edges];
    this.nodes = [...params.nodes];
    this.strainFilters = new Map(params.strainFilters);
    this.editable = params.editable;
  }

  /**
   * @param refNode Strain node that is the direct parent of the self icon
   * @returns XY coordinates of where to place the self icon in the editor
   */
  public static getSelfNodePos(): XYPosition {
    return {
      x: STRAIN_NODE_WIDTH / 2 - MIDDLE_NODE_WIDTH / 2,
      y: STRAIN_NODE_HEIGHT + NODE_PADDING,
    };
  }

  public static getXNodePos(
    hermNode: Node<Strain>,
    relative = true
  ): XYPosition {
    const x = STRAIN_NODE_WIDTH + 2 * NODE_PADDING;
    const y = STRAIN_NODE_HEIGHT / 2 - MIDDLE_NODE_HEIGHT / 2;
    return relative
      ? {
          x,
          y,
        }
      : { x: x + hermNode.position.x, y: y + hermNode.position.y };
  }

  public static getRelStrainPos(
    matedNode: Node<Strain>,
    relative = true
  ): XYPosition {
    const x =
      (STRAIN_NODE_WIDTH +
        2 * NODE_PADDING +
        MIDDLE_NODE_WIDTH +
        2 * NODE_PADDING) *
      (matedNode.data.sex === Sex.Hermaphrodite ? 1 : -1);
    return { x, y: 0 };
  }

  public static getAbsolutePos(relPos: XYPosition, node: Node): XYPosition {
    return { x: relPos.x + node.position.x, y: relPos.y + node.position.y };
  }

  /** @returns List of XY coordinates (relative to middle node position) */
  public static calculateChildPositions(
    middleNodeType: NodeType.X | NodeType.Self,
    childCount: number
  ): XYPosition[] {
    const positions: XYPosition[] = [];
    const maxNodesInRow = 5;
    const xMidpoint = MIDDLE_NODE_WIDTH / 2;
    const deltaX = STRAIN_NODE_WIDTH + NODE_PADDING;
    const deltaY = STRAIN_NODE_HEIGHT + NODE_PADDING;

    let y =
      middleNodeType === NodeType.X
        ? MIDDLE_NODE_HEIGHT / 2 + STRAIN_NODE_HEIGHT / 2 + 3 * NODE_PADDING
        : MIDDLE_NODE_HEIGHT + NODE_PADDING;
    for (let i = 0; i < childCount; i += maxNodesInRow) {
      const nodesInRow = Math.min(maxNodesInRow, childCount - i);
      const rowWidth = deltaX * nodesInRow - NODE_PADDING;
      let x = xMidpoint - rowWidth / 2;
      for (let j = 0; j < nodesInRow; j++) {
        positions.push({ x, y });
        x += deltaX;
      }
      y += deltaY;
    }

    return positions;
  }

  static fromJSON(json: string): CrossDesign {
    return plainToInstance(
      CrossDesign,
      JSON.parse(json) as Record<string, unknown>
    );
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  public createId(): string {
    return ulid();
  }

  public clone(newId = false): CrossDesign {
    return new CrossDesign({
      ...this,
      id: newId ? this.createId() : this.id,
      nodes: [...this.nodes],
      strainFilters: new Map(this.strainFilters),
      edges: [...this.edges],
      lastSaved: new Date(),
    });
  }

  // Helper to help validate node order for subflows
  public static nodesAreValid(nodes: Node[]): boolean {
    return nodes.every(
      (node, idx) =>
        !nodes
          .slice(idx)
          .map((followingNode) => followingNode.id)
          .includes(node.parentNode ?? '')
    );
  }

  /** @returns db record of this tree */
  public generateRecord(): db_CrossDesign {
    return {
      ...this,
      data: this.toJSON(),
      lastEdited: this.lastSaved.toString(),
    };
  }

  /** @returns list of all tasks for a given node */
  public getTasks(node: Node<Strain>): Task[] {
    const ancestorTree = this.getAncestorTree(node);
    const taskTree = this.getTaskTree(ancestorTree);
    if (taskTree === undefined) {
      return [];
    }
    this.addDatesToTasks(taskTree);
    const tasks: Task[] = [];
    this.makeTreeIntoArray(taskTree, tasks);
    return tasks;
  }

  private makeTreeIntoArray(tree: TaskTree, tasks: Task[]): void {
    tasks.push(tree.task);
    tree.taskParents.forEach((parent) => {
      this.makeTreeIntoArray(parent, tasks);
    });
  }

  private getTaskTree(
    ancestorTree: AncestorTree,
    childTaskId?: string
  ): TaskTree | undefined {
    if (ancestorTree.parents.length === 0) return undefined;

    const [hermStrain, maleStrain] = ancestorTree.parents.map((parent) =>
      parent.strain.toJSON()
    );

    const task = new Task({
      id: ulid(),
      dueDate: null,
      action: ancestorTree.parents.length === 1 ? 'SelfCross' : 'Cross',
      hermStrain,
      maleStrain: maleStrain ?? null,
      resultStrain: ancestorTree.strain.toJSON(),
      notes: null,
      completed: false,
      crossDesignId: this.id,
      childTaskId: childTaskId ?? null,
    });

    const taskParents = ancestorTree.parents.flatMap(
      (parent: AncestorTree) => this.getTaskTree(parent, task.id) ?? []
    );

    return {
      task,
      taskParents,
    };
  }

  private addDays(days: number, date?: Date): Date {
    return moment(date).add(days, 'days').toDate();
  }

  private addDatesToTasks(taskDeps: TaskTree): void {
    const defaultMaturationDay = 3;
    taskDeps.taskParents.forEach((parent) => {
      this.addDatesToTasks(parent);
    });

    if (taskDeps.taskParents.length === 0) {
      taskDeps.task.dueDate = moment().toDate();
      return;
    }

    // self-cross task
    const parent1 = taskDeps.taskParents[0].task.resultStrain;
    let maturationDays = parent1?.getMaturationDays() ?? defaultMaturationDay;
    if (taskDeps.taskParents.length === 1) {
      taskDeps.task.dueDate = this.addDays(
        maturationDays,
        taskDeps.taskParents[0].task.dueDate
      );
      return;
    }

    // cross between 2 strains.
    const parent2 = taskDeps.taskParents[1].task.resultStrain;
    maturationDays = Math.max(
      parent1?.getMaturationDays() ?? defaultMaturationDay,
      parent2?.getMaturationDays() ?? defaultMaturationDay
    );
    const parent1DueDate = moment(taskDeps.taskParents[0].task.dueDate);
    const parent2DueDate = moment(taskDeps.taskParents[1].task.dueDate);
    const latestParentDate = parent1DueDate.isAfter(parent2DueDate)
      ? parent1DueDate.toDate()
      : parent2DueDate.toDate();

    taskDeps.task.dueDate = this.addDays(maturationDays, latestParentDate);

    // Determine if a parent tree needs to be started later in time (rather than today)
    const dueDateDiff = parent1DueDate.diff(parent2DueDate, 'days');
    if (Math.abs(dueDateDiff) >= maturationDays) {
      const parentToBump = parent1DueDate.isAfter(parent2DueDate)
        ? taskDeps.taskParents[1]
        : taskDeps.taskParents[0];

      this.bumpDatesBack(parentToBump, dueDateDiff);
    }
  }

  private bumpDatesBack(tree: TaskTree, daysToBumpBack: number): void {
    tree.task.dueDate = this.addDays(daysToBumpBack, tree.task.dueDate);
    tree.taskParents.forEach((parent) => {
      this.bumpDatesBack(parent, daysToBumpBack);
    });
  }

  public getParentStrains(strain: Node<Strain>): Array<Node<Strain>> {
    const middleNodes = getIncomers(strain, this.nodes, this.edges);
    return middleNodes.flatMap((middleNode) =>
      getIncomers(middleNode, this.nodes, this.edges)
    );
  }

  /**
   * Recursively generates a hierarchy of ancestors for a given node
   */
  private getAncestorTree(child: Node): AncestorTree {
    return {
      strain: child.data,
      parents: this.getParentStrains(child).map((parent) =>
        this.getAncestorTree(parent)
      ),
    };
  }
}

interface AncestorTree {
  strain: Strain;
  parents: AncestorTree[];
}
