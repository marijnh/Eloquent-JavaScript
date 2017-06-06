var faceEar = placeImage(circle(30, "white"), circle(100,"white"), 0 , 0);

var face = placeImage(circle(30, "white"), faceEar, 140, 0);

var leftEye = placeImage(circle(35,"black"), face, 25, 25);

var head = placeImage(circle(35,"black"), leftEye, 100, 25);

var scene = emptyScene(300, 400);

var body = overlay(circle(70, "white"),circle(125, "black"));

var withLeft = placeImage(circle(25, "white"), body, 50, 200);
var bodyWithFeet = placeImage(circle(25, "white"), withLeft, 130, 200);

var bodyScene = placeImage(bodyWithFeet, scene, 0, 150);

draw(placeImage(head, bodyScene, 40, 0));
