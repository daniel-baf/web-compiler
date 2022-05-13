import { EPVN } from '../../../tree/ast-node-expected.model';
import { AstNode } from '../../../tree/ast-node.model';

export class ExprCaster {
  constructor() {}

  public get_final_cast(_expr: AstNode): AstNode {
    let rs: any = true;

    console.log(_expr);

    return new AstNode(EPVN.bool_val, [rs]);
  }

  public is_valid_result(_dec_type: EPVN, _res_type: EPVN): Boolean {
    switch (_dec_type) {
      case EPVN.int:
        return _res_type === EPVN.int_val;
      case EPVN.char:
        return _res_type === EPVN.char_val;
      case EPVN.double:
        return _res_type === EPVN.double_val;
      case EPVN.bool:
        return _res_type === EPVN.bool_val;
      case EPVN.string:
        return _res_type === EPVN.val_com;
      default:
        return false;
    }
  }
}

export class ItmCaster {
  public cast(_action: EPVN, _left: AstNode, _right: AstNode | null): AstNode {
    if (_left != null && _right === null) {
      return _left;
    } else if (_left != null && _right != null) {
      switch (_action) {
        case EPVN.ADD:
          break;
        case EPVN.SUB:
          break;
        case EPVN.MULT:
          break;
        case EPVN.DIV:
          break;
        case EPVN.MOD:
          break;
        case EPVN.POUND:
          break;
        case EPVN.PARENTHESIS:
          return _left;
        default:
          return new AstNode(EPVN.invalid_cast);
          break;
      }
    }
    return new AstNode(EPVN.invalid_cast);
  }
}
