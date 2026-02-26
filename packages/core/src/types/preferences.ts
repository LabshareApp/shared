/** Appearance preferences for a single workspace (lab or institution). */
export interface WorkspacePref {
  color?: string; // Tailwind bg class e.g. 'bg-emerald-700'
  icon?: string; // Icon key e.g. 'flask'
}

/** Map of workspace ID → appearance preferences. */
export type WorkspacePrefsMap = Record<string, WorkspacePref>;
