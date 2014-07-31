// Note that the first argument to instantiateTemplate was changed to
// be the template itself, not its name, to make testing easier.

function instantiateTemplate(template, values) {
  function instantiateText(text, values) {
    return text.replace(/\{\{(\w+)\}\}/g, function(_, name) {
      return values[name];
    });
  }
  function attr(node, attrName) {
    return node.nodeType == document.ELEMENT_NODE &&
      node.getAttribute(attrName);
  }
  function instantiate(node, values) {
    if (node.nodeType == document.ELEMENT_NODE) {
      var copy = node.cloneNode();
      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];

        var when = attr(child, "template-when"), unless = attr(child, "template-unless");
        if (when && !values[when] || unless && values[unless])
          continue;

        var repeat = attr(child, "template-repeat");
        if (repeat)
          (values[repeat] || []).forEach(function(element) {
            copy.appendChild(instantiate(child, element));
          });
        else
          copy.appendChild(instantiate(child, values));
      }
      return copy;
    } else if (node.nodeType == document.TEXT_NODE) {
      return document.createTextNode(instantiateText(node.nodeValue, values));
    }
  }

  return instantiate(template, values);
}

// A simple test function to verify that the above actually works

function test(template, values, expected) {
  var testTemplate = document.createElement("div");
  testTemplate.innerHTML = template;
  var result = instantiateTemplate(testTemplate, values).innerHTML;
  if (result != expected)
    console.log("Unexpected instantiation. Expected\n  " + expected + "\ngot\n  " + result);
}

test('<h1 template-when="header">{{header}}</h1>',
     {header: "One"},
     '<h1 template-when="header">One</h1>');

test('<h1 template-when="header">{{header}}</h1>',
     {header: false},
     '');

test('<p><img src="icon.png" template-unless="noicon">Hello</p>',
     {noicon: true},
     '<p>Hello</p>');

test('<ol><li template-repeat="items">{{name}}: {{score}}</li></ol>',
     {items: [{name: "Alice", score: "10"}, {name: "Bob", score: "7"}]},
     '<ol><li template-repeat="items">Alice: 10</li><li template-repeat="items">Bob: 7</li></ol>');
