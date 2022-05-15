import { EPVN } from 'src/app/models/tree/ast-node-expected.model';
import { AstNode } from 'src/app/models/tree/ast-node.model';

export class ItmCaster {
  public pounnd(_base: number, _pound: number): number {
    return Math.pow(_base, _pound);
  }

  public cast(_label: EPVN, _left: AstNode, _right: AstNode): AstNode {
    if (
      _label === EPVN.ADD ||
      _label === EPVN.MULT ||
      _label === EPVN.DIV ||
      _label === EPVN.SUB ||
      _label === EPVN.MOD ||
      _label === EPVN.POUND
    ) {
      return this.eval_cast(_left, _right, _label);
    } else if (_label === EPVN.PARENTHESIS) {
      return _left;
    } else {
      // TODO add the ID eval and func call
      return new AstNode(EPVN.invalid_cast);
    }
  }

  private eval_cast(_left: AstNode, _right: AstNode, _action: EPVN): AstNode {
    let ll: any = _left.children[0];
    let lr: any = _right.children[0];
    // for operation, use var _data
    let _data: any;
    // check both are valid
    switch (_action) {
      //  arythmetic expression
      case EPVN.ADD:
        switch (_left.label) {
          case EPVN.bool_val:
            ll = ll === false ? 0 : 1;
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                return new AstNode(EPVN.double_val, [ll + lr]);
              case EPVN.double_val:
                return new AstNode(EPVN.double_val, [ll + lr]);
              case EPVN.val_com:
                return new AstNode(EPVN.val_com, [ll + lr]);
              case EPVN.int_val:
                lr = Number(lr) + Number(ll);
                return new AstNode(EPVN.int_val, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.double_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                return new AstNode(EPVN.double_val, [ll + lr]);
              case EPVN.double_val:
                return new AstNode(EPVN.double_val, [ll + lr]);
              case EPVN.val_com:
                return new AstNode(EPVN.val_com, [ll + lr]);
              case EPVN.int_val:
                return new AstNode(EPVN.double_val, [ll + lr]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                return new AstNode(EPVN.double_val, [ll + lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.val_com:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = `${ll}${lr === false ? 0 : 1}`;
                return new AstNode(EPVN.val_com, [lr]);
              case EPVN.double_val:
                lr = `${ll}${lr}`;
                return new AstNode(EPVN.val_com, [lr]);
              case EPVN.val_com:
                lr = `${ll}${lr}`;
                return new AstNode(EPVN.val_com, [lr]);
              case EPVN.int_val:
                lr = `${ll}${lr}`;
                return new AstNode(EPVN.val_com, [lr]);
              case EPVN.char_val:
                // cast char to number
                lr = `${ll}${lr}`;
                return new AstNode(EPVN.val_com, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.int_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                lr = Number(ll) + Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              case EPVN.double_val:
                lr = Number(ll) + Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              case EPVN.val_com:
                lr = `${ll}${lr}`;
                return new AstNode(EPVN.val_com, [lr]);
              case EPVN.int_val:
                lr = Number(ll) + Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                lr = Number(ll) + Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.char_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
                ll = ll.charCodeAt(0);
                return new AstNode(EPVN.double_val, [ll + lr]);
              case EPVN.val_com:
                lr = `${ll}${lr}`;
                return new AstNode(EPVN.val_com, [lr]);
              case EPVN.int_val:
                ll = ll.charCodeAt(0);
                ll = Number(ll) + Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = ll.charCodeAt(0);
                return new AstNode(EPVN.int_val, [ll + lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          default:
            return new AstNode(EPVN.invalid_cast);
        }
      case EPVN.SUB:
        switch (_left.label) {
          case EPVN.bool_val:
            ll = ll === false ? 0 : 1;
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
                ll = Number(ll) - Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.int_val:
                lr = Number(ll) - Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.double_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                ll = Number(ll) - Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.double_val:
                ll = Number(ll) - Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.int_val:
                ll = Number(ll) - Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll) - Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            } // exclude string, any string substraction is invalid
          case EPVN.int_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                lr = Number(ll) - Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              case EPVN.double_val:
                lr = Number(ll) - Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              case EPVN.int_val:
                lr = Number(ll) - Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                lr = Number(ll) - Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.char_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
                ll = ll.charCodeAt(0);
                ll = Number(ll) - Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.int_val:
                ll = ll.charCodeAt(0);
                ll = Number(ll) - Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll.charCodeAt(0)) - Number(lr);
                return new AstNode(EPVN.int_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          default:
            return new AstNode(EPVN.invalid_cast);
        }
      case EPVN.MULT:
        switch (_left.label) {
          case EPVN.bool_val:
            ll = ll === false ? 0 : 1;
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
                ll = Number(ll) * Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.int_val:
                lr = Number(ll) * Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.double_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                ll = Number(ll) * Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.double_val:
                ll = Number(ll) * Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.int_val:
                ll = Number(ll) * Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll) * Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            } // exclude string, any string substraction is invalid
          case EPVN.int_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                lr = Number(ll) * Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              case EPVN.double_val:
                lr = Number(ll) * Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              case EPVN.int_val:
                lr = Number(ll) * Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                lr = Number(ll) * Number(lr);
                return new AstNode(EPVN.int_val, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.char_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
                ll = ll.charCodeAt(0);
                ll = Number(ll) * Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.int_val:
                ll = ll.charCodeAt(0);
                ll = Number(ll) * Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll.charCodeAt(0)) * Number(lr);
                return new AstNode(EPVN.int_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          default:
            return new AstNode(EPVN.invalid_cast);
        }
      case EPVN.DIV:
        switch (_left.label) {
          case EPVN.bool_val:
            ll = ll === false ? 0 : 1;
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
              case EPVN.int_val:
                ll = Number(ll) / Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.double_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                ll = Number(ll) / Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.double_val:
              case EPVN.int_val:
                ll = Number(ll) / Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll) / Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            } // exclude string, any string substraction is invalid
          case EPVN.int_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                lr = Number(ll) / Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              case EPVN.double_val:
              case EPVN.int_val:
                lr = Number(ll) / Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                lr = Number(ll) / Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.char_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
              case EPVN.int_val:
                ll = ll.charCodeAt(0);
                ll = Number(ll) / Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll.charCodeAt(0)) / Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          default:
            return new AstNode(EPVN.invalid_cast);
        }
      case EPVN.MOD:
        switch (_left.label) {
          case EPVN.bool_val:
            ll = ll === false ? 0 : 1;
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
              case EPVN.int_val:
                ll = Number(ll) % Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.double_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                ll = Number(ll) % Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.double_val:
              case EPVN.int_val:
                ll = Number(ll) % Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll) % Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            } // exclude string, any string substraction is invalid
          case EPVN.int_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                lr = Number(ll) % Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              case EPVN.double_val:
              case EPVN.int_val:
                lr = Number(ll) % Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                lr = Number(ll) % Number(lr);
                return new AstNode(EPVN.double_val, [lr]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.char_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
              case EPVN.int_val:
                ll = ll.charCodeAt(0);
                ll = Number(ll) % Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll.charCodeAt(0)) % Number(lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          default:
            return new AstNode(EPVN.invalid_cast);
        }
      case EPVN.POUND:
        switch (_left.label) {
          case EPVN.bool_val:
            ll = ll === false ? 0 : 1;
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
              case EPVN.int_val:
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.double_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.double_val:
              case EPVN.int_val:
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            } // exclude string, any string substraction is invalid
          case EPVN.int_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.bool_val:
                lr = lr === false ? 0 : 1;
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.double_val:
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.int_val:
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.int_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.int_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          case EPVN.char_val:
            // fallthrough
            switch (_right.label) {
              case EPVN.double_val:
              case EPVN.int_val:
                ll = ll.charCodeAt(0);
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.double_val, [ll]);
              case EPVN.char_val:
                // cast char to number
                lr = lr.charCodeAt(0);
                ll = Number(ll.charCodeAt(0));
                ll = this.pounnd(ll, lr);
                return new AstNode(EPVN.double_val, [ll]);
              default:
                return new AstNode(EPVN.invalid_cast);
            }
          default:
            return new AstNode(EPVN.invalid_cast);
        }
      // compare expression
      case EPVN.GT:
        _data = ll > lr;
        return new AstNode(EPVN.bool_val, [_data]);
      case EPVN.LT:
        _data = ll < lr;
        return new AstNode(EPVN.bool_val, [_data]);
      case EPVN.EQQ:
        _data = ll === lr;
        return new AstNode(EPVN.bool_val, [_data]);
      case EPVN.NE:
        _data = ll != lr;
        return new AstNode(EPVN.bool_val, [_data]);
      case EPVN.LET:
        _data = ll <= lr;
        return new AstNode(EPVN.bool_val, [_data]);
      case EPVN.HET:
        _data = ll >= lr;
        return new AstNode(EPVN.bool_val, [_data]);
      // other
      case EPVN.PP:
        console.log('pp');
        break;
      case EPVN.LL:
        console.log('ll');
        break;
      case EPVN.and:
        console.log('and');
        break;
      case EPVN.or:
        console.log('or');
        break;
      case EPVN.not:
        console.log('not');
        break;
      default:
        console.log('invalid');
    }
    return new AstNode(EPVN.invalid_cast);
  }

  public is_evaluable(_label: EPVN): Boolean {
    return (
      _label === EPVN.ADD ||
      _label === EPVN.SUB ||
      _label === EPVN.MULT ||
      _label === EPVN.DIV ||
      _label === EPVN.MOD ||
      _label === EPVN.POUND
    );
  }

  public is_assignable(_expected: EPVN, _actual: EPVN): Boolean {
    switch (_expected) {
      case EPVN.int:
        return _actual === EPVN.int_val;
      case EPVN.char:
        return _actual === EPVN.char_val;
      case EPVN.bool:
        return _actual === EPVN.bool_val;
      case EPVN.double:
        return _actual === EPVN.double_val;
      case EPVN.string:
        return _actual === EPVN.val_com;
      default:
        return false;
    }
  }
}
