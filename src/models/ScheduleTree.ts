/**
 * @PrimaryKey {id}
 * @ForeignKey {treeId: Tree.id}
 */
export default interface ScheduleTree {
    id: Number, 
    treeId: Number,
}