import { invoke } from '@tauri-apps/api/tauri';
import { db_Gene } from 'models/db/db_Gene';
import { GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';
import { Filter, prepareFilter } from '../models/db/filter/filter';

export const getGenes = async (): Promise<db_Gene[]> => {
  try {
    const res = await invoke('get_genes');
    return res as db_Gene[];
  } catch (err) {
    console.error('Unable to get genes from db', err);
    return [];
  }
};

export const getFilteredGenes = async (
  filter: Filter<GeneFieldName>
): Promise<db_Gene[]> => {
  try {
    const res = await invoke('get_filtered_genes', {
      filter: prepareFilter(filter),
    });
    return res as db_Gene[];
  } catch (err) {
    console.error('Unable to get filtered genes from db', err);
    return [];
  }
};

export const getGene = async (name: string): Promise<db_Gene | undefined> => {
  const fieldFilters = new Map<GeneFieldName, string[]>();
  fieldFilters.set('Name', [name]);
  const fieldSpecialFilters = new Map<GeneFieldName, SpecialFilter[]>();
  const filter: Filter<GeneFieldName> = {
    fieldFilters,
    fieldSpecialFilters,
    orderBy: [],
  };
  return (await getFilteredGenes(filter))[0];
};
