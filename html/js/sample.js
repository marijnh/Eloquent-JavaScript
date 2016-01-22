draw(circle(10, "black"));
draw(circle(30, "red"));
print("Hello world!");
print("Calculating (1 + 2 - 3): " + (1 + 2 - 3));

print("SMASH THE STATE");
draw(rectangle(125, 75, "black"));

var eye = overlay(circle(10, "black"), circle(30, "purple"));

draw(eye);

draw(overlay(eye, rectangle(75,50,"white")));

var eyes = overlay(overlay(rectangle(50,50,"green"), rectangle(150,50,"red")), rectangle(160, 60, "pink"));

draw(overlay(eyes, circle(100, "green")));

var collage = placeImage(circle(10,"black"),circle(20,"white"), 0, 0);
draw(placeImage(collage, circle(30, "red"), 0, 0));

var faceEar = placeImage(circle(30, "white"), circle(100,"white"), 0 , 0);

var face = placeImage(circle(30, "white"), faceEar, 140, 0);

var leftEye = placeImage(circle(35,"black"), face, 25, 25);

var head = placeImage(circle(35,"black"), leftEye, 100, 25);

var scene = emptyScene(300, 400);

draw(placeImage(head, scene, 0, 0));

var body = overlay(circle(70, "white"),circle(125, "black"));

var withLeft = placeImage(circle(25, "white"), body, 50, 200);
var bodyWithFeet = placeImage(circle(25, "white"), withLeft, 130, 200);

var bodyScene = placeImage(bodyWithFeet, scene, 0, 150);

draw(placeImage(head, bodyScene, 40, 0));



