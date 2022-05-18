import { Injectable } from '@angular/core';
import { EPVN } from '../models/tree/ast-node-expected.model';
import { AstNode } from '../models/tree/ast-node.model';

@Injectable({
  providedIn: 'root',
})
export class D3GraphGenService {
  constructor() {}

  public generate_graph(_node: AstNode): string {
    let _graph = 'digraph G {\n';
    let _headers: string[] = [];
    let _pointers: string[] = [];
    this.build_dot_file(_node, _headers, _pointers);
    _headers.forEach((_head) => {
      _graph += `${_head}\n`;
    });
    _pointers.forEach((_pointer) => {
      _graph += `${_pointer}\n`;
    });
    _graph += '}';
    return _graph;
  }

  private build_dot_file(
    _node: AstNode,
    _nodes: string[],
    _pointers: string[]
  ) {
    try {
      // create main node
      let _cur_node = `node${_nodes.length}`;
      // check if valid label
      if (_node.label === undefined || _node.label === null) {
        _nodes.push(`${_cur_node} [label="${_node}"]`);
      } else {
        _nodes.push(`${_cur_node} [label="${EPVN[_node.label]}"]`);
        // call children
        _node.children.forEach((_child) => {
          _pointers.push(`${_cur_node} -> node${_nodes.length}`);
          try {
            this.build_dot_file(_child, _nodes, _pointers);
          } catch (error) {
            console.log('error calling child');
          }
        });
      }
    } catch (error) {
      console.log('error executing node label');
    }
  }
}
