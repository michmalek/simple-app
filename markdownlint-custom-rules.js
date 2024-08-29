module.exports = [
  {
    names: ["title-pattern"],
    description: "Enforce ADR title pattern",
    tags: ["title"],
    function: function titlePattern(params, onError) {
      const pattern = /^# CXE-ADR\d{4}: .+$/;
      if (!pattern.test(params.lines[0])) {
        onError({
          lineNumber: 1,
          detail:
            "Title must be on line 1 of file and follow the pattern '# CXE-ADR000X: [ Brief title of ADR ]'",
        });
      }
    },
  },
  {
    names: ["table-pattern"],
    description: "Enforce ADR table pattern",
    tags: ["table"],
    function: function tablePattern(params, onError) {
      const lines = params.lines;
      const tableHeaderPattern = /^\|[ ]+\|[ ]+\|$/;
      const tableSeparatorPattern = /^\|[ ]*[-]+[ ]*\|[ ]*[-]+[ ]*\|$/;
      const patterns = [
        /^\| \*\*Status:\*\*[ ]+\| (Drafting|Reviewing|Published|Deprecated|Superseded) \s*\|$/,
        /^\| \*\*Author:\*\*[ ]+\| .+\s*\|$/,
        /^\| \*\*Date:\*\*[ ]+\| \d{4}-\d{2}-\d{2} \s*\|$/,
        /^\| \*\*RFC:\*\*[ ]+\| .* \s*\|$/,
        /^\| \*\*Supersedes:\*\*[ ]+\| .* \s*\|$/,
        /^\| \*\*Deprecates:\*\*[ ]+\| .* \s*\|$/,
      ];

      let tableStartIndex = -1;

      // Find the start of the table
      for (let i = 0; i < lines.length; i++) {
        if (
          tableHeaderPattern.test(lines[i]) &&
          tableSeparatorPattern.test(lines[i + 1])
        ) {
          tableStartIndex = i + 2;
          break;
        }
      }

      // If the table start is not found, report an error
      if (tableStartIndex === -1) {
        onError({
          lineNumber: 1,
          detail:
            "Table pattern is missing or incorrect. Please see ADR template for example table that should be present in every ADR.",
        });
        return;
      }

      // Validate the table rows
      for (let i = 0; i < patterns.length; i++) {
        const lineIndex = tableStartIndex + i;
        if (!patterns[i].test(lines[lineIndex])) {
          onError({
            lineNumber: lineIndex + 1,
            detail: `Table row does not match the required format: ${patterns[i]}`,
          });
        }
      }
    },
  },
  {
    names: ["heading-pattern"],
    description: "Enforce specific headings and optional subheadings",
    tags: ["headings"],
    function: function headingPattern(params, onError) {
      const validHeadings = [
        /^## Context & Problem Statement\s*$/,
        /^## Decision Drivers\s*$/,
        /^## Considered Options\s*$/,
        /^## Decision Outcome\s*$/,
        /^## Resources\s*$/,
      ];

      const optionalHeadings = [
        /^### Positive Consequences.{0,50}\s*$/,
        /^### Negative Consequences.{0,50}\s*$/,
      ];

      const postResourceHeadings = [/^## Links\s*$/];

      let inOptionalSection = false;
      let afterResourcesSection = false;

      for (let i = 1; i < params.tokens.length; i++) {
        // Start from 1 to skip the title
        const token = params.tokens[i];

        if (token.type === "heading_open") {
          const heading = params.tokens[i + 1].line.trim();

          if (heading.match(/^## Decision Outcome\s*$/)) {
            inOptionalSection = true;
            afterResourcesSection = false;
          } else if (heading.match(/^## Resources\s*$/)) {
            inOptionalSection = false;
            afterResourcesSection = true;
          } else if (afterResourcesSection) {
            if (postResourceHeadings.some((pattern) => pattern.test(heading))) {
              afterResourcesSection = false; // Valid heading found, reset state
            } else {
              onError({
                lineNumber: token.lineNumber,
                detail: `Only "## Links" is allowed after "## Resources". Found: ${heading}`,
              });
              afterResourcesSection = false; // Ensure it only happens once
            }
          } else if (inOptionalSection) {
            if (
              !optionalHeadings.some((pattern) => pattern.test(heading)) &&
              heading.match(/^##/) &&
              !heading.match(/^## Resources\s*$/)
            ) {
              inOptionalSection = false;
            } else if (
              !optionalHeadings.some((pattern) => pattern.test(heading)) &&
              heading.match(/^###/)
            ) {
              onError({
                lineNumber: token.lineNumber,
                detail: `Only "### Positive Consequences" and "### Negative Consequences" are allowed between "## Decision Outcome" and "## Resources". Found: ${heading}`,
              });
            }
          } else if (
            !validHeadings.some((pattern) => pattern.test(heading)) &&
            !optionalHeadings.some((pattern) => pattern.test(heading)) &&
            !postResourceHeadings.some((pattern) => pattern.test(heading))
          ) {
            onError({
              lineNumber: token.lineNumber,
              detail: `Unexpected heading: ${heading}`,
            });
          }
        }
      }
    },
  },
];
