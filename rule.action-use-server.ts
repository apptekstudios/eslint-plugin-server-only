import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
export const createRule = ESLintUtils.RuleCreator.withoutDocs;

export const useServerRule = createRule({
  meta: {
    docs: {
      description:
        "Rule to require 'use server' at start of file named .action",
    },
    type: "suggestion",
    messages: {
      mustUseServer: `File named with .action must declare "use server"`,
    },
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
  create: (context) => {
    if (!context.filename.includes(".action")) return {};
    const firstNode = context.sourceCode.getNodeByRangeIndex(0);

    if (firstNode == null) {
      return {};
    }
    if (
      firstNode.type != AST_NODE_TYPES.Literal ||
      firstNode.value != "use server"
    ) {
      context.report({
        messageId: "mustUseServer",
        node: firstNode,
        fix(fixer) {
          return fixer.insertTextBefore(firstNode, `"use server"\n`);
        },
      });
      return {};
    }
    return {};
  },
});
