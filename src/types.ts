export type Minifier = {
  extensions: string[];
  fromPath: (
    path: string,
    extension: string,
    minifiers: Record<string, Minifier>,
  ) => Promise<void>;
  fromString: (
    path: string,
    extension: string,
    minifiers: Record<string, Minifier>,
  ) => Promise<string>;
};
