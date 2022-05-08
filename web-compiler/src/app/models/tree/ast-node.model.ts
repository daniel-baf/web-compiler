export class AstNode {
  constructor(
    private label: String,
    private children: [] = [],
    private tabs: Number = 0,
  ) {}
}
