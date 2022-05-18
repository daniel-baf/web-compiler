import { Component, Input, OnInit } from '@angular/core';
import { AstNode } from 'src/app/models/tree/ast-node.model';
import { graphviz } from 'd3-graphviz';
import { D3GraphGenService } from 'src/app/services/d3-graph-gen.service';

@Component({
  selector: 'app-graph-gallery',
  templateUrl: './graph-gallery.component.html',
  styleUrls: ['./graph-gallery.component.css'],
})
export class GraphGalleryComponent implements OnInit {
  @Input() _drawable: AstNode[] = [];

  constructor(private _d3_graph: D3GraphGenService) {}

  ngOnInit(): void {}

  d3_g() {
    for (let _index = 0; _index < this._drawable.length; _index++) {
      try {
        let _graph_content = this._d3_graph.generate_graph(
          this._drawable[_index]
        );
        graphviz(`#graph${_index}`).renderDot(_graph_content);
      } catch (error) {}
    }
    // console.log(_graphs);
  }
}
