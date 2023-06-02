import { type db_StrainAllele } from 'models/db/db_StrainAllele';

interface iStrainAllele {
  strainName: string;
  alleleName: string;
  isHomozygous: boolean;
}

export class StrainAllele {
  strainName: string;
  alleleName: string;
  isHomozygous: boolean;

  constructor(fields: iStrainAllele) {
    this.strainName = fields.strainName ?? '';
    this.alleleName = fields.alleleName ?? '';
    this.isHomozygous = fields.isHomozygous;
  }

  public generateRecord(): db_StrainAllele {
    return {
      strain_name: this.strainName,
      allele_name: this.alleleName,
      is_homozygous: this.isHomozygous,
    };
  }
}
