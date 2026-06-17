import type { CreatePlan } from '../types.js';
import { applyAiPlan } from './applyAiPlan.js';
import { applyFeatureModules } from './applyFeatureModules.js';
import { applyFullstackPlan } from './applyFullstackPlan.js';
import { applyWebsitePlan } from './applyWebsitePlan.js';
import { writeGeneratedReadme } from './writeGeneratedReadme.js';
import { writeGlobalsCss } from './starterBranding.js';

export async function applyPlan(plan: CreatePlan): Promise<void> {
  // Overwrite globals.css with the polished light theme styling
  await writeGlobalsCss(plan.targetPath);

  if (plan.blueprint === 'website') {
    await applyWebsitePlan(plan);
  }

  if (plan.blueprint === 'fullstack-product') {
    await applyFullstackPlan(plan);
  }

  if (plan.blueprint === 'ai-app') {
    await applyAiPlan(plan);
  }

  await applyFeatureModules(plan);
  await writeGeneratedReadme(plan);
}
