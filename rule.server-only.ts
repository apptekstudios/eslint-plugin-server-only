import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
export const createRule = ESLintUtils.RuleCreator.withoutDocs;

export const serverOnlyRule = createRule({
  meta: {
    docs: {
      description:
        "Rule to require import of 'server-only' package if file-name contains .server",
    },
    type: "suggestion",
    messages: {
      mustImportServerOnly:
        "File named with .server must import 'server-only'.",
      serverOnlyShouldHaveFilename: `File containing 'import "server-only" should have '.server' in its name`,
    },
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
  create: (context) => {
    const shouldCheckServerOnly = context.filename.includes(".server");

    var hasFoundServerOnly = false;
    var serverOnlyNode: TSESTree.Node | null = null;
    return {
      ImportDeclaration: (node) => {
        if (hasFoundServerOnly) return;
        if (node.source.value == "server-only") {
          serverOnlyNode = node;
          hasFoundServerOnly = true;
          return;
        }
      },
      "Program:exit": (programNode) => {
        if (shouldCheckServerOnly) {
          if (!hasFoundServerOnly) {
            context.report({
              messageId: "mustImportServerOnly",
              node: programNode,
              fix(fixer) {
                return fixer.insertTextBefore(
                  programNode,
                  `import "server-only"\n`
                );
              },
            });
          }
        } else {
          if (hasFoundServerOnly && serverOnlyNode != null) {
            context.report({
              messageId: "serverOnlyShouldHaveFilename",
              node: serverOnlyNode,
            });
          }
        }
      },
    };
  },
});
