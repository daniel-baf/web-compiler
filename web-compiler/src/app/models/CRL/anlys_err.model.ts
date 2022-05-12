export class AnalysisError {
  constructor(
    private _line: number,
    private _col: number,
    private _type: String,
    private _lexem: String
  ) {}

  public get line(): number {
    return this._line;
  }

  public get col(): number {
    return this._col;
  }

  public get type(): String {
    return this._type;
  }

  public get lexem(): String {
    return this._lexem;
  }
}
