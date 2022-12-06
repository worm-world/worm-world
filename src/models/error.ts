export class DBError extends Error {
  msg: string;

  constructor(msg: string) {
    super();
    this.msg = msg;
  }
}
