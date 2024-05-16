import { RuleTester } from "eslint";
import { serverOnlyRule } from "./rule.server-only";
import { useServerRule } from "./rule.action-use-server";

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2017, sourceType: "module" },
});

const errors: any[] = [];

try {
  //@ts-ignore
  ruleTester.run("server-only", serverOnlyRule, {
    valid: [
      {
        code: "var foo = true",
        filename: "test.ts",
      },
      {
        code: `import 'server-only'; var invalidVariable = true`,
        filename: "test.server.ts",
      },
    ],

    invalid: [
      {
        code: "var invalidVariable = true",
        filename: "test.server.ts",
        errors: [{ messageId: "mustImportServerOnly" }],
        output: `import "server-only"\nvar invalidVariable = true`,
      },
      {
        code: "import 'server-only'; var invalidVariable = true",
        filename: "test.ts",
        errors: [{ messageId: "serverOnlyShouldHaveFilename" }],
      },
    ],
  });
  console.log("Server-only tests passed!");
} catch (error) {
  errors.push(error);
}

try {
  //@ts-ignore
  ruleTester.run("action-use-server", useServerRule, {
    valid: [
      // If use-server present, pass
      {
        code: `"use server"
        var foo = true
      `,
        filename: "test.action.ts",
      },
      // Shouldn't do anything for non-action files
      {
        code: `var foo = true`,
        filename: "test.ts",
      },
    ],

    invalid: [
      // File named with .action but no "use server"... should FAIL
      {
        code: "var foo = true",
        filename: "test.action.ts",
        errors: [{ messageId: "mustUseServer" }],
        output: `"use server"\nvar foo = true`,
      },
    ],
  });
  console.log("Action use-server tests passed!");
} catch (error) {
  errors.push(error);
}

if (errors.length > 0) {
  console.log(errors);
  console.log("TESTS FAILED. SEE ERRORS ABOVE");
}
