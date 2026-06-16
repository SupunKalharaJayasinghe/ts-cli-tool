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

/**
 * Blueprint is the main project category selected by the user.
 */
export type Blueprint = 'website' | 'fullstack-product' | 'ai-app';

/**
 * Website shapes describe public-facing website structures.
 */
export type WebsiteShape = 'one-page' | 'multi-page';

/**
 * Full-stack shapes describe production-style app structures.
 */
export type FullstackShape = 'saas' | 'dashboard' | 'custom';

/**
 * AI shapes describe AI-first app structures.
 */
export type AiShape = 'chat' | 'assistant' | 'content-generator';

/**
 * Shape is the specific structure inside a blueprint.
 */
export type ProjectShape = WebsiteShape | FullstackShape | AiShape;

/**
 * Feature modules are optional capabilities applied to the generated project.
 */
export type FeatureModule =
  | 'seo'
  | 'contact-form'
  | 'prisma'
  | 'postgresql'
  | 'redis'
  | 'docker'
  | 'github-actions'
  | 'ai-sdk'
  | 'env-example';

/**
 * CreatePlan is the central object used by the future blueprint generator.
 *
 * Prompt answers should be converted into this object first.
 * Generators should read this object instead of depending directly on prompts.
 */
export interface CreatePlan {
  projectName: string;
  targetPath: string;
  blueprint: Blueprint;
  shape: ProjectShape;
  pages: string[];
  sections: string[];
  modules: FeatureModule[];
  installDependencies: boolean;
}
