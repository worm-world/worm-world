/**
 * @summary Tracks when a cross should occur and marks when complete
 * @PrimaryKey {id}
 * @ForeignKeys {crossId: Cross.id}
 */
export default interface ScheduledCross {
  id: Number;
  crossId: Number;
  date: Date;
  completed: Boolean;
}
