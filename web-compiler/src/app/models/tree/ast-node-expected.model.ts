import { AstNode } from './ast-node.model';

export enum EPVN { // Expected previous node
  // generica
  id, // 0
  int_val, // 1
  double_val, // 2
  char_val, // 3
  val_com, // 4
  bool_val, // 5
  // var types
  int, // 6
  char, // 7
  bool, // 8
  double, // 9
  string, // 10
  void, // 11
  // logical operators
  and, // 12
  or, // 13
  not, // 14
  // relational operators
  GT, // grather than 15
  LT, // lower than 16
  EQ, // equals 17
  NE, // not equals 18
  LET, // lower or equals 19
  HET, // higher or equals 20
  // op operations
  PP, // plus plus 21
  LL, // less less 22
  // arythmetic operators
  ADD, // 23
  SUB, // 24
  MULT, // 25
  DIV, // 26
  MOD, // 27
  POUND, // 28
  PARENTHESIS, // 29
  UMINUS, // 30
  // function calls
  param, // 31
  // headers
  import, // 32
  uncertainity, // 33
  // main tree children
  FILE, // 34
  BODY, // 35
  HEADER, // 36
  EMPTY_LIST, // 37
  // globals
  global_var_dec, //  38
  // line actions
  func_call, //  39
  var_dec, // 40
  return, // 41
  print_stmt, // 42
  continue, //  43
  break, // 44
  // selection
  while, // 45
  for, // 46
  if, // 47
  else, // 48
  else_if, // 49
  // function declare
  func, // 50
  func_main, // 51
  // statements
  stmt_line, // 52
  stmt_selection, // 53
  // draw functions
  draw_ast, //  54
  draw_ts, // 55
  draw_exp, // 56
  // invalid actions
  invalid_cast, // 57
  // other
  EQQ, // == 58
}

export class ValidPrevNodeChecker {
  constructor() {}

  public check_prev(_cur_node: AstNode, _prev_node: AstNode) {
    switch (_cur_node.label) {
      //  check global vars
      case EPVN.global_var_dec:
        switch (_prev_node.label) {
          case EPVN.import:
          case EPVN.uncertainity:
          case EPVN.global_var_dec:
          case EPVN.EMPTY_LIST:
            return true;
          default:
            return false;
        }
      //  check functions
      case EPVN.func:
      case EPVN.func_main:
        switch (_prev_node.label) {
          case EPVN.import:
          case EPVN.uncertainity:
          case EPVN.global_var_dec:
          case EPVN.func:
          case EPVN.func_main:
          case EPVN.EMPTY_LIST:
            return true;
          default:
            return false;
        }
      case EPVN.stmt_selection:
      case EPVN.stmt_line:
        switch (_prev_node.label) {
          case EPVN.EMPTY_LIST:
          case EPVN.stmt_line:
          case EPVN.stmt_selection:
          case EPVN.func:
          case EPVN.func_main:
            if (_cur_node.label === EPVN.stmt_selection) {
              if (
                _cur_node.children[0].label === EPVN.else_if &&
                _prev_node.children[0].label != EPVN.if
              ) {
                return false;
              } else if (
                _cur_node.children[0].label === EPVN.else &&
                !(
                  _prev_node.children[0].label === EPVN.if ||
                  _prev_node.children[0].label === EPVN.else_if
                )
              ) {
                return false;
              }
            }
            // check else if || else || else if
            return true;
          default:
            return false;
        }
      default:
        return false;
    }
  }

  public is_parent(_stmt_type: EPVN): Boolean {
    try {
      switch (_stmt_type) {
        case EPVN.func:
        case EPVN.func_main:
        case EPVN.stmt_selection:
        case EPVN.BODY:
          // case EPVN.HEADER:
          // case EPVN.FILE:
          return true;
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }
}
