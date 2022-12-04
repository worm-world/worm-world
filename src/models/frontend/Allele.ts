import { getFilteredAlleleExpressions } from 'api/alleleExpressions';
import { getGene } from 'api/gene';
import { getVariation } from 'api/variationInfo';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';
import { Filter } from 'models/db/filter/filter';
import { AlleleExpression } from 'models/frontend/AlleleExpression';
import { Gene } from 'models/frontend/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo';

interface IAllele {
  name: string;
  geneName?: string;
  contents?: string;
}

export class Allele {
  name: string;
  gene?: Gene;
  variationInfo?: VariationInfo;
  alleleExpressions: AlleleExpression[] = [];
  contents?: string;

  constructor(fields: IAllele) {
    this.name = fields.name;
    fields.geneName !== undefined // Sets gene or variationInfo
      ? getGene(fields.geneName)
          .then((res) => {
            if (res != null) this.gene = Gene.createFromRecord(res);
          })
          .catch((err) => console.error('error generating gene: ', err))
      : getVariation(fields.name)
          .then((res) => {
            if (res != null)
              this.variationInfo = VariationInfo.createFromRecord(res);
          })
          .catch((err) => console.error('error generating variation: ', err));

    const filter = this.getAlleleExpressionsFilter(fields.name);
    getFilteredAlleleExpressions(filter)
      .then((res) => {
        this.alleleExpressions = res.map((record) =>
          AlleleExpression.createFromRecord(record)
        );
      })
      .catch((err) =>
        console.error('error generating allele expressions: ', err)
      );
    this.contents = fields.contents;
  }

  private readonly getAlleleExpressionsFilter = (
    alleleName: string
  ): Filter<AlleleExpressionFieldName> => {
    const filters = new Map<AlleleExpressionFieldName, string[]>();
    filters.set('AlleleName', [alleleName]);
    const specialFilters = new Map<
      AlleleExpressionFieldName,
      SpecialFilter[]
    >();
    const filter: Filter<AlleleExpressionFieldName> = {
      fieldFilters: filters,
      fieldSpecialFilters: specialFilters,
      orderBy: [],
    };

    return filter;
  };
}
