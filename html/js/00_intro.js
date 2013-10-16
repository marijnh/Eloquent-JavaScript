function range(start, end) {
  var out = [];
  for (var i = start; i <= end; i++) out.push(i);
  return out;
}
function sum(array) {
  return array.reduce(function(a, b) { return a + b; }, 0);
}

function fac(n) {
  if (n == 0)
    return 1;
  else
    return fac(n - 1) * n;
}
