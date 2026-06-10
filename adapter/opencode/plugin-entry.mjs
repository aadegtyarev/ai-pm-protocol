// OpenCode plugin entry — install drops THIS file (only) into .opencode/plugin/.
// It exposes the real plugin from the adapter tree, which lives OUTSIDE the scanned
// plugin dir so OpenCode never loads engine.mjs / normalise.mjs as plugins (see
// INSTALL.md). Rewrite the path if the adapter is vendored elsewhere.
//
// It must be an OWN export, NOT a re-export. Dogfooded on opencode 1.17.0: a
// re-export (`export { AiPmEnforcement } from "..."`) LOADS without error but its
// tool.execute.before hook never fires — OpenCode's loader does not register hooks
// off a re-exported binding. Importing the impl and re-exposing it as a fresh own
// export does register and fire.
import { AiPmEnforcement as impl } from "../../.ai-pm/tooling/adapter/opencode/plugin.mjs";
export const AiPmEnforcement = impl;
