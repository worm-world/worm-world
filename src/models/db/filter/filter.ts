import { FilterType } from 'models/db/filter/FilterType';

export type FilterTuple<T> = [T, FilterType];
/**
 * A generic filter for interacting with the database
 * The type you provide should be an autogenerated DB field name enum
 *
 */
export interface Filter<T> {
  /**
   * @overview Specify dynamic filtering of a DB table
   *
   * @description The nested array structure allows AND / OR statements
   * To create chained AND statements: add tuples in the INNER-MOST arrays
   * To create chained OR statements: add multiple arrays with a single tuple in each
   * To create mixed AND / OR statements: any combination of the above 2 lines
   *
   * -----------------------------------------------
   *
   * @example
   * [
   *   [ [field1, val1], [field2, val2], [field3, val3] ]
   * ]
   *
   * ^ would generate: WHERE (field1 == val1 AND field2 == val2 AND field3 == val3);
   *
   * -----------------------------------------------
   *
   * @example
   * [
   *   [ [field1, val1] ],
   *   [ [field1, val2] ],
   *   [ [field2, val3] ],
   * ]
   *
   * ^ would generate: WHERE (field1 == val1) OR (field1 == val2) OR (field2 == val3);
   *
   * -----------------------------------------------
   *
   * @example
   * [
   *   [ [field1, val1], [field2, val2], [field3, val3] ],
   *   [ [field1, val1], [field4, val4] ],
   *   [ [field5, val5] ],
   * ]
   *
   * ^ would generate: WHERE (field1 == val1 AND field2 == val2 AND field3 == and val3) OR
   *                         (field1 == val1 AND field4 == val4) OR
   *                         (field5 == val5);
   */
  filters: Array<Array<FilterTuple<T>>>;
  /**
   * @overview Allows ordering based on fieldNames
   * @example
   * [field1, field2] would generate the the following statement:
   *
   * <select query> ... ORDER BY field1, field2
   */
  orderBy: T[];
}
