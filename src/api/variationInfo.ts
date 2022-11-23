import { invoke } from '@tauri-apps/api/tauri';
import db_VariationInfo from 'models/db/db_VariationInfo';

export const getVariationInfoRecordsFromDB = (): db_VariationInfo[] => {
  invoke('get_variation_info')
    .then((res) => {
      return res as db_VariationInfo[];
    })
    .catch((res) =>
      console.error('Unable to get variation info records from db')
    );
  return [];
};

export const getVariationInfoFromDB = (
  alleleName: String
): db_VariationInfo | undefined => {
  const genes = getVariationInfoRecordsFromDB();
  const filtered = genes.filter((record) => record.alleleName === alleleName);
  if (filtered.length === 1) return filtered[0];
  else {
    console.error(
      `Unable to find a variation info record with the name: ${name}`
    );
    return undefined;
  }
};
