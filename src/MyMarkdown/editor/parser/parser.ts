import { worker } from './worker';
export type ParserResult = {
  schema: any[];
  links: { path: number[]; target: string }[];
};

const transformResult = (result: ParserResult) => {
  return { schema: result.schema, links: result.links || [] };
};

export const parserMdToSchema = (code: string): ParserResult => {
  return transformResult(worker(code));
};
