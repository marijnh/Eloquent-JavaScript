var text = "'I'm the cook,' he said, 'it's my job.'";

console.log(text.replace(/['^.'.]/g, '$1"$2'));
// → "I'm the cook," he said, "it's my job."
