// OpenCode plugin entry — the ONLY file OpenCode loads from .opencode/plugin/.
// It exposes the real plugin from the root adapter tree (adapter/opencode/plugin.mjs),
// which lives OUTSIDE this scanned dir so OpenCode never loads engine.mjs /
// normalise.mjs as plugins (see adapter/INSTALL.md ## OpenCode). In a downstream the
// adapter is vendored at .ai-pm/tooling/adapter/ and the import path is adjusted;
// here it is the repo-root adapter/.
//
// It MUST be an OWN export, NOT a re-export. Dogfooded on opencode 1.17.0: a
// re-export (`export { AiPmEnforcement } from "..."`) LOADS without error but its
// tool.execute.before hook never fires — OpenCode's loader does not register hooks
// off a re-exported binding. Importing the impl and re-exposing it as a fresh own
// export does register and fire.
import { AiPmEnforcement as impl } from "../../adapter/opencode/plugin.mjs";
export const AiPmEnforcement = impl;
