import { EPVN } from '../tree/ast-node-expected.model';

export class SymTable {
  private _table: SymTableRow[];

  constructor() {
    this._table = [];
  }

  public find(id: String): SymTableRow | undefined {
    return this._table.find((_row) => {
      if (_row._id === id) {
        return _row;
      }
      return null;
    });
  }

  public add(_id: String, _value: any, _line: number, _type: EPVN): Boolean {
    if (this.find(_id) === undefined) {
      this._table.push(new SymTableRow(_id, _value, _line, _type));
      return true;
    }
    return false;
  }

  public remove(_id: String): Boolean {
    let _row = this.find(_id);
    if (_row != null) {
      this._table.splice(this._table.indexOf(_row));
      return true;
    }
    return false;
  }

  public update(_id: String, _value: any): Boolean {
    let _row = this.find(_id);
    if (_row != null) {
      _row._value = _value;
      return true;
    }
    return false;
  }
}

export class SymTableRow {
  constructor(
    public _id: String,
    public _value: any,
    public _line: number,
    public _type: EPVN
  ) {}
}
