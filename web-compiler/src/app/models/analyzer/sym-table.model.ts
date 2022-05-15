import { EPVN } from '../tree/ast-node-expected.model';
import { AstNode } from '../tree/ast-node.model';

export class SymTable {
  private _table: SymTableRow[];

  constructor() {
    this._table = [];
  }

  public find_as_node(id: String) {
    let _row = this.find(id);
    if (_row != null) {
      let _data: any = _row._value;
      return new AstNode(this.cast_type_to_val(_row._type), [_data]);
    } else {
      return new AstNode(EPVN.invalid_cast);
    }
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

  private cast_type_to_val(_type: EPVN): EPVN {
    switch (_type) {
      case EPVN.int:
        return EPVN.int_val;
      case EPVN.char:
        return EPVN.char_val;
      case EPVN.bool:
        return EPVN.bool_val;
      case EPVN.double:
        return EPVN.bool_val;
      case EPVN.string:
        return EPVN.val_com;
      case EPVN.void:
        return EPVN.void;
      default:
        return EPVN.invalid_cast;
    }
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
