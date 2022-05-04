export interface CLRError {
  line: number;
  col: number;
  lexem: string;
  errType: CLRErrorType;
  expectedTkns: string;
}

export enum CLRErrorType {
  Lexical,
  Syntactical,
  Semantical,
}

export interface CLRErrorMap {
  [key: string]: CLRError;
}