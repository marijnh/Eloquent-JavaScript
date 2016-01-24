draw(circle(10, "black"));
draw(circle(30, "red"));
print("Hello world!");
print("Calculating (1 + 2 - 3): " + (1 + 2 - 3));

draw(rectangle(125, 75, "black"));

loadImage("smile",smile);

draw(image("smile"));

var eye = overlay(circle(10, "black"), circle(30, "purple"));

draw(eye);

draw(overlay(eye, rectangle(75,50,"white")));

var eyes = overlay(overlay(rectangle(60,60,"green"), overlay(rectangle(70,60,"pink"), rectangle(160,50,"red"))), rectangle(170, 60, "pink"));

var mouth = overlay(rectangle(50, 120, "green"), rectangle(50,140, "red"));

draw(overlay(eyes, overlay(mouth, circle(100, "green"))));

var collage = placeImage(circle(10,"black"),circle(20,"white"), 0, 0);
draw(placeImage(collage, circle(30, "red"), 0, 0));

loadImage("skull", "http://cursors4.totallyfreecursors.com/thumbnails/skull-crossbones1.gif");

draw(overlay(image("skull"), rectangle(125, 75, "black")));