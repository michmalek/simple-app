module.exports = {
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
  };