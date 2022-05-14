import { EPVN } from '../../../tree/ast-node-expected.model';
import { AstNode } from '../../../tree/ast-node.model';

export class ExprCaster {
  private _caster: ItmCaster;

  constructor() {
    this._caster = new ItmCaster();
  }

  public get_final_cast(_expr: AstNode, _ident = 0): AstNode {
    try {
      let rs: any = true;
      let lr = _expr.children[0];
      let rr = _expr.children[1];
      // check types are valid
      if (lr.label > 5) {
        console.log(_ident + ' get expr lr');
        lr = this.get_final_cast(lr, _ident + 1);
        //   //   lr = this.get_final_cast(lr);
      }
      if (rr.label > 5) {
        console.log(_ident + ' get expr rr');
        rr = this.get_final_cast(rr, _ident + 1);
      }
      rs = this._caster.cast(lr, rr, _expr.label);
      console.log(`type: ${EPVN[rs.label]} val: ${rs.children[0]}`);
      return new AstNode(EPVN.bool_val, [rs]);
    } catch (error) {
      return new AstNode(EPVN.invalid_cast, []);
    }
  }
}

export class ItmCaster {
  public cast(_left: AstNode, _right: AstNode, _action: EPVN): AstNode {
    let ll: any = _left.children[0];
    let lr: any = _right.children[0];
    // check both are valid
    switch (_action) {
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
      case EPVN.POUND:
        console.log('pound');
        break;
      case EPVN.MOD:
        console.log('mod');
        break;
      case EPVN.PARENTHESIS:
        console.log('parenthesis');
        break;
      case EPVN.PP:
        console.log('pp');
        break;
      case EPVN.LL:
        console.log('ll');
        break;
      case EPVN.GT:
        console.log('gt');
        break;
      case EPVN.LT:
        console.log('lt');
        break;
      case EPVN.EQ:
        console.log('eq');
        break;
      case EPVN.NE:
        console.log('ne');
        break;
      case EPVN.LET:
        console.log('let');
        break;
      case EPVN.HET:
        console.log('het');
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
}
