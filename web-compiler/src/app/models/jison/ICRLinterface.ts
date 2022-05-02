export interface CRLError {
  line: number;
  col: number;
  lexem: string;
  errType: CRLErrorType;
  expectedTkns: string;
}

export enum CRLErrorType {
  Lexical,
  Syntactical,
  Semantical,
}

export interface CRLErrorMap {
  [key: string]: CRLError;
}