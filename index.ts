/**
 * @author Tobeas Brennan
 */

"use strict";

import { ESLint } from "eslint";
import { serverOnlyRule } from "./rule.server-only";
import { useServerRule } from "./rule.action-use-server";
import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

interface Plugin extends Omit<ESLint.Plugin, "rules"> {
  rules: Record<string, RuleModule<any, any, any>>;
}
const plugin: Plugin = {
  meta: {
    name: "eslint-plugin-server-only",
    version: "1.0",
  },
  rules: {
    "server-only": serverOnlyRule,
    "action-use-server": useServerRule,
  },
  configs: {
    recommended: {
      plugins: ["server-only"],
      rules: {
        "server-only/server-only": "error",
        "server-only/action-use-server": "error",
      },
    },
  },
};
export const meta = plugin.meta;
export const rules = plugin.rules;
export const configs = plugin.configs;
export default plugin;
