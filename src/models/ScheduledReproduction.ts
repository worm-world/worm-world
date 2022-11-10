/**
 * @summary Tracks when a reproduction should occur and marks when complete
 * @PrimaryKey {id}
 * @ForeignKeys {reproductionId: Reproduction.id}
 */
export default interface ScheduledReproduction {
    id: Number,
    reproductionId: Number, 
    date: Date, 
    completed: Boolean,
}

