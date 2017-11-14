// Fill in this regular expression.
let number = /^(\+|-|)(\d+(\.\d*)?|\.\d+)([eE](\+|-|)\d+)?$/;

// Tests:
for (let str in ["1", "-1", "+15", "1.55", ".5", "5.",
                 "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(s)) {
    console.log("Failed to match '" + s + "'");
  }
}
for (let str in ["1a", "+-1", "1.2.3", "1+1", "1e4.5",
                 ".5.", "1f5", "."]) {
  if (number.test(s)) {
    console.log("Incorrectly accepted '" + s + "'");
  }
}

