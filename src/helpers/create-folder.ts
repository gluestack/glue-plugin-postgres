import { mkdir } from "node:fs/promises";

export const createFolder = async (path: string): Promise<void> => {
  await mkdir(path, { recursive: true });
};
