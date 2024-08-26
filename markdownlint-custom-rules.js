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
            "Title must follow the pattern '# CXE-ADR000X: [ Brief title of ADR ]'",
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
      const tableSeparatorPattern = /^\| ---[-]+ \| ---[-]+ \|$/;
      const patterns = [
        /^\| \*\*Status:\*\*[ ]+\| (Drafting|Reviewing|Published|Deprecated|Superseded) \s*\|$/,
        /^\| \*\*Author:\*\*[ ]+\| .+\s*\|$/,
        /^\| \*\*Date:\*\*[ ]+\| \d{4}-\d{2}-\d{2} \s*\|$/,
        /^\| \*\*RFC:\*\*[ ]+\| .* \s*\|$/,
        /^\| \*\*Supersedes:\*\*[ ]+\| .* \s*\|$/,
        /^\| \*\*Deprecates:\*\*[ ]+\| .* \s*\|$/,
      ];

      let tableStartIndex = -1;
      let tableEndIndex = -1;

      // Find the start and end of the table
      for (let i = 0; i < lines.length; i++) {
        if (
          tableHeaderPattern.test(lines[i]) &&
          tableSeparatorPattern.test(lines[i + 1])
        ) {
          tableStartIndex = i + 2;
        }
        if (
          tableStartIndex !== -1 &&
          patterns.every((pattern, index) =>
            pattern.test(lines[tableStartIndex + index])
          )
        ) {
          tableEndIndex = tableStartIndex + patterns.length;
          break;
        }
      }

      if (tableStartIndex === -1 || tableEndIndex === -1) {
        onError({
          lineNumber: 1,
          detail: "Table pattern is missing or incorrect.",
        });
        return;
      }

      // Validate the table rows
      for (let i = 0; i < patterns.length; i++) {
        if (!patterns[i].test(lines[tableStartIndex + i])) {
          onError({
            lineNumber: tableStartIndex + i + 1,
            detail: `Table row does not match the required format: ${patterns[i]}`,
          });
        }
      }
    },
  },
];
