import { EPVN } from './ast-node-expected.model';

export class AstNode {
  constructor(
    private _label: EPVN,
    private _children: AstNode[] = [],
    private _tabs: number = 0,
    private _parent: AstNode | null = null,
    private _ignore_child: number = 0
  ) {
    // check is a selection and add ignore value
    if (_label === EPVN.stmt_selection) {
      this._ignore_child = 1;
    } else if (_label === EPVN.func) {
      this._ignore_child = 3;
    }
  }

  get label(): EPVN {
    return this._label;
  }

  set label(label: EPVN) {
    this._label = label;
  }

  get children(): AstNode[] {
    return this._children;
  }

  get tabs(): number {
    return this._tabs;
  }

  get parent(): AstNode | null {
    return this._parent;
  }

  set parent(parent: AstNode | null) {
    this._parent = parent;
  }

  public add_child(child: AstNode) {
    try {
      this._children.push(child);
    } catch (error) {
      console.log('error adding child: ' + error);
    }
  }

  // this method is only called to know the nodes wich are 'line', 'selection'...
  public get_last_child_type(): AstNode {
    try {
      if (this._children.length <= this._ignore_child) {
        return new AstNode(EPVN.EMPTY_LIST);
      } else {
        let last = this._children[this._children.length - 1];
        if (last._label != undefined) {
          return last;
        } else {
          return new AstNode(EPVN.EMPTY_LIST);
        }
      }
    } catch (error) {
      // TODO show error html
      return new AstNode(EPVN.EMPTY_LIST);
    }
  }
}
