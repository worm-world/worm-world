// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ChromosomeName } from "./filter/db_ChromosomeName";

export interface db_Variation { alleleName: string, chromosome: ChromosomeName | null, physLoc: number | null, geneticLoc: number | null, recombSuppressor: [number, number] | null, }