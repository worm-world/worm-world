// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';
import type { PhenotypeFieldName } from './db_PhenotypeFieldName';

export interface PhenotypeFilter {
  fieldFilters: Map<PhenotypeFieldName, string[]>;
  fieldSpecialFilters: Map<PhenotypeFieldName, SpecialFilter[]>;
  orderBy: PhenotypeFieldName[];
}
