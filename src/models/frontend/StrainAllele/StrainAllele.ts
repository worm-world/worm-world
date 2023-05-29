import { db_StrainAllele } from 'models/db/db_StrainAllele';

interface iStrainAllele {
  strainName: string;
  alleleName: string;
  homozygous: boolean;
}

export class StrainAllele {
  strainName: string;
  alleleName: string;
  homozygous: boolean;

  constructor(fields: iStrainAllele) {
    this.strainName = fields.strainName ?? '';
    this.alleleName = fields.alleleName ?? '';
    this.homozygous = fields.homozygous;
  }

  public generateRecord(): db_StrainAllele {
    return {
      strain_name: this.strainName,
      allele_name: this.alleleName,
      homozygous: this.homozygous,
    };
  }
}
