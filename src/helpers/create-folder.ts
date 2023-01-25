import { mkdir } from "node:fs/promises";
import { fileExists } from "./file-exists";

export const createFolder = async (path: string): Promise<void> => {
  if (! await fileExists(path)) {
    await mkdir(path, { recursive: true });
  }
};
