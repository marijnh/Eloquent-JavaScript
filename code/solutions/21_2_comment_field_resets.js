// This isn't a stand-alone file, only a redefinition of displayTalks
// from skillsharing/public/skillsharing_client.js

function displayTalks(talks) {
  talks.forEach(function(talk) {
    var shown = shownTalks[talk.title];
    if (talk.deleted) {
      if (shown) {
        talkDiv.removeChild(shown);
        delete shownTalks[talk.title];
      }
    } else {
      var node = drawTalk(talk);
      if (shown) {
        var textField = shown.querySelector("input");
        var hasFocus = document.activeElement == textField;
        var value = textField.value;
        talkDiv.replaceChild(node, shown);
        var newTextField = node.querySelector("input");
        newTextField.value = value;
        if (hasFocus) newTextField.focus();
      } else {
        talkDiv.appendChild(node);
      }
      shownTalks[talk.title] = node;
    }
  });
}
