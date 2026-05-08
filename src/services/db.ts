import Dexie, { type EntityTable } from "dexie";
import type { Garment } from "@/types/garment";

export type SavedProject = {
  id: string;
  name: string;
  garment: Garment;
  updatedAt: string;
};

class LuxoriaDatabase extends Dexie {
  projects!: EntityTable<SavedProject, "id">;

  constructor() {
    super("luxoria-designer-db");
    this.version(1).stores({
      projects: "id, name, updatedAt",
    });
  }
}

export const db = new LuxoriaDatabase();
