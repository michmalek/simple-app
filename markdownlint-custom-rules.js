module.exports = [
    {
        "names": ["title-pattern"],
        "description": "Enforce ADR title pattern",
        "tags": ["title"],
        "function": function titlePattern(params, onError) {
          const pattern = /^# CXE-ADR\d{4}: .+$/;
          if (!pattern.test(params.lines[0])) {
            onError({
              lineNumber: 1,
              detail: "Title must follow the pattern '# CXE-ADR000X: [ Brief title of ADR ]'"
            });
          }
        }
    },
      {
      "names": ["table-pattern"],
      "description": "Enforce ADR table pattern",
      "tags": ["table"],
      "function": function tablePattern(params, onError) {
        const tableLines = params.lines.slice(4, 10);
        const patterns = [
          /^\| \*\*Status:\*\*[ ]+\| (Drafting|Reviewing|Published|Deprecated|Superseded) \s*\|$/,
          /^\| \*\*Author:\*\*[ ]+\| .+\s*\|$/,
          /^\| \*\*Date:\*\*[ ]+\| \d{4}-\d{2}-\d{2} \s*\|$/,
          /^\| \*\*RFC:\*\*[ ]+\| .* \s*\|$/,
          /^\| \*\*Supersedes:\*\*[ ]+\| .* \s*\|$/,
          /^\| \*\*Deprecates:\*\*[ ]+\| .* \s*\|$/
        ];
        patterns.forEach((pattern, index) => {
          if (!pattern.test(tableLines[index])) {
            onError({
              lineNumber: index + 4,
              detail: `Table row does not match the required format: ${pattern}`
            });
          }
        });
      }
  }
];
