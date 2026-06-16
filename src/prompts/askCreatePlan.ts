import { checkbox, confirm, input, select } from '@inquirer/prompts';
import path from 'node:path';
import type {
  AiShape,
  Blueprint,
  CreatePlan,
  FeatureModule,
  FullstackShape,
  ProjectShape,
  WebsiteShape,
} from '../types.js';
import { pathExists } from '../utils/pathExists.js';

export async function askCreatePlan(): Promise<CreatePlan> {
  const projectName = await askProjectName();
  const targetPath = path.join(process.cwd(), projectName);
  const blueprint = await askBlueprint();

  if (blueprint === 'website') {
    return askWebsitePlan(projectName, targetPath, blueprint);
  }

  if (blueprint === 'fullstack-product') {
    return askFullstackPlan(projectName, targetPath, blueprint);
  }

  return askAiPlan(projectName, targetPath, blueprint);
}

async function askProjectName(): Promise<string> {
  return input({
    message: 'Project name:',
    default: 'my-app',
    validate: async (value) => {
      if (!/^[a-z0-9][a-z0-9-_]*$/i.test(value)) {
        return 'Use letters, numbers, hyphens, or underscores. The name must start with a letter or number.';
      }

      const targetPath = path.join(process.cwd(), value);

      if (await pathExists(targetPath)) {
        return `A folder named "${value}" already exists in this location. Please choose a different name.`;
      }

      return true;
    },
  });
}

async function askBlueprint(): Promise<Blueprint> {
  return select({
    message: 'Choose a project blueprint:',
    choices: [
      {
        name: 'Website — landing page, portfolio, business site, documentation',
        value: 'website',
      },
      {
        name: 'Full-stack Product — SaaS, dashboard, app with database/backend logic',
        value: 'fullstack-product',
      },
      {
        name: 'AI App — chat app, assistant, content generator',
        value: 'ai-app',
      },
    ],
  });
}

async function askWebsitePlan(
  projectName: string,
  targetPath: string,
  blueprint: Blueprint
): Promise<CreatePlan> {
  const shape = await select<WebsiteShape>({
    message: 'What type of website?',
    choices: [
      { name: 'One-page landing page', value: 'one-page' },
      { name: 'Multi-page website', value: 'multi-page' },
    ],
  });

  const modules: FeatureModule[] = [];
  let pages: string[] = [];
  let sections: string[] = [];

  if (shape === 'one-page') {
    sections = await checkbox<string>({
      message: 'Which sections do you want?',
      choices: [
        { name: 'Hero', value: 'hero', checked: true },
        { name: 'Features', value: 'features', checked: true },
        { name: 'About', value: 'about' },
        { name: 'Pricing', value: 'pricing' },
        { name: 'FAQ', value: 'faq' },
        { name: 'Contact', value: 'contact', checked: true },
      ],
    });

    if (sections.length === 0) {
      sections = ['hero', 'features', 'contact'];
    }
  }

  if (shape === 'multi-page') {
    pages = await checkbox<string>({
      message: 'Which pages do you want?',
      choices: [
        { name: 'Home', value: 'home', checked: true },
        { name: 'About', value: 'about', checked: true },
        { name: 'Services', value: 'services', checked: true },
        { name: 'Projects', value: 'projects' },
        { name: 'Blog', value: 'blog' },
        { name: 'Contact', value: 'contact', checked: true },
      ],
    });

    if (!pages.includes('home')) {
      pages.unshift('home');
    }
  }

  const addSeo = await confirm({
    message: 'Add SEO starter files?',
    default: true,
  });

  if (addSeo) {
    modules.push('seo');
  }

  const addContactForm = await confirm({
    message: 'Add contact form placeholder?',
    default: true,
  });

  if (addContactForm) {
    modules.push('contact-form');
  }

  const sharedModules = await askSharedToolingModules({
    defaultDocker: false,
  });

  const installDependencies = await askInstallDependencies();

  return createPlan({
    projectName,
    targetPath,
    blueprint,
    shape,
    pages,
    sections,
    modules: [...modules, ...sharedModules],
    installDependencies,
  });
}

async function askFullstackPlan(
  projectName: string,
  targetPath: string,
  blueprint: Blueprint
): Promise<CreatePlan> {
  const shape = await select<FullstackShape>({
    message: 'What type of full-stack product?',
    choices: [
      { name: 'SaaS starter', value: 'saas' },
      { name: 'Dashboard with database', value: 'dashboard' },
      { name: 'Custom full-stack app', value: 'custom' },
    ],
  });

  const modules: FeatureModule[] = [];

  const useDatabase = await confirm({
    message: 'Add Prisma + PostgreSQL?',
    default: true,
  });

  if (useDatabase) {
    modules.push('prisma', 'postgresql', 'env-example');
  }

  const useRedis = await confirm({
    message: 'Add Redis for cache, sessions, queues, or rate limiting?',
    default: false,
  });

  if (useRedis) {
    modules.push('redis', 'env-example');
  }

  const sharedModules = await askSharedToolingModules({
    defaultDocker: true,
  });

  const installDependencies = await askInstallDependencies();

  return createPlan({
    projectName,
    targetPath,
    blueprint,
    shape,
    pages: [],
    sections: [],
    modules: [...modules, ...sharedModules],
    installDependencies,
  });
}

async function askAiPlan(
  projectName: string,
  targetPath: string,
  blueprint: Blueprint
): Promise<CreatePlan> {
  const shape = await select<AiShape>({
    message: 'What type of AI app?',
    choices: [
      { name: 'Chat app', value: 'chat' },
      { name: 'AI assistant', value: 'assistant' },
      { name: 'Content generator', value: 'content-generator' },
    ],
  });

  const modules: FeatureModule[] = ['ai-sdk', 'env-example'];

  const storeData = await confirm({
    message: 'Store conversations or generated content in a database?',
    default: false,
  });

  if (storeData) {
    modules.push('prisma', 'postgresql');
  }

  const useRedis = await confirm({
    message: 'Add Redis for rate limiting or temporary AI state?',
    default: false,
  });

  if (useRedis) {
    modules.push('redis');
  }

  const sharedModules = await askSharedToolingModules({
    defaultDocker: false,
  });

  const installDependencies = await askInstallDependencies();

  return createPlan({
    projectName,
    targetPath,
    blueprint,
    shape,
    pages: [],
    sections: [],
    modules: [...modules, ...sharedModules],
    installDependencies,
  });
}

async function askSharedToolingModules(options: {
  defaultDocker: boolean;
}): Promise<FeatureModule[]> {
  const modules: FeatureModule[] = [];

  const addDocker = await confirm({
    message: 'Add Docker files?',
    default: options.defaultDocker,
  });

  if (addDocker) {
    modules.push('docker');
  }

  const addGithubActions = await confirm({
    message: 'Add GitHub Actions CI?',
    default: true,
  });

  if (addGithubActions) {
    modules.push('github-actions');
  }

  return modules;
}

async function askInstallDependencies(): Promise<boolean> {
  return confirm({
    message: 'Install dependencies after generation?',
    default: true,
  });
}

function createPlan(options: {
  projectName: string;
  targetPath: string;
  blueprint: Blueprint;
  shape: ProjectShape;
  pages: string[];
  sections: string[];
  modules: FeatureModule[];
  installDependencies: boolean;
}): CreatePlan {
  return {
    projectName: options.projectName,
    targetPath: options.targetPath,
    blueprint: options.blueprint,
    shape: options.shape,
    pages: options.pages,
    sections: options.sections,
    modules: uniqueModules(options.modules),
    installDependencies: options.installDependencies,
  };
}

function uniqueModules(modules: FeatureModule[]): FeatureModule[] {
  return Array.from(new Set(modules));
}
