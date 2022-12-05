import { FilterType } from 'models/db/filter/FilterType';

/**
 * A generic filter for interacting with the database
 * The type you provide should be an autogenerated DB field name enum
 * */
export interface Filter<T> {
  fieldFilters: Map<T, FilterType[]>;
  orderBy: T[];
}
