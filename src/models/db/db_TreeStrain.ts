import { Sex } from '../enums';

/**
 * @PrimaryKey {id}
 * @ForeignKeys {treeId: Tree.id} {strain: strain.name} {crossId: Cross.id}
 */
export default interface TreeStrain {
  id: Number;
  treeId: Number;
  strain: String;
  sex: Sex;
  crossId: Number;
}
