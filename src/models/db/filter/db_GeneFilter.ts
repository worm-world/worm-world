// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';
import type { GeneFieldName } from './db_GeneFieldName';

export interface GeneFilter {
  fieldFilters: Map<GeneFieldName, string[]>;
  fieldSpecialFilters: Map<GeneFieldName, SpecialFilter[]>;
  orderBy: GeneFieldName[];
}
