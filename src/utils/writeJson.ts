import fs from 'node:fs/promises';

export async function writeJson(
  filePath: string,
  value: unknown
): Promise<void> {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
