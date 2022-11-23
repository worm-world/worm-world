import { invoke } from '@tauri-apps/api/tauri';
import db_Gene from 'models/db/db_Gene';

export const getGenesFromDB = (): db_Gene[] => {
  invoke('get_genes')
    .then((res) => {
      return res as db_Gene[];
    })
    .catch((res) => console.error('Unable to get genes from db'));
  return [];
};

export const getGeneFromDB = (name: String): db_Gene | undefined => {
  const genes = getGenesFromDB();
  const filtered = genes.filter((record) => record.name === name);
  if (filtered.length === 1) return filtered[0];
  else {
    console.error(`Unable to find a gene with the name: ${name}`);
    return undefined;
  }
};
