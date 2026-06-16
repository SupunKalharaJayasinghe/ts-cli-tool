export interface PackageJson {
  name: string;
  version: string;
  description: string;
  main: string;
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface EslintConfig {
  env: { node: boolean };
  extends: string[];
  parser?: string;
}

export interface BasicScaffoldOptions {
  projectName: string;
  targetPath: string;
  useTypeScript: boolean;
  includeLint: boolean;
  includeJest: boolean;
  includeDocker: boolean;
}
