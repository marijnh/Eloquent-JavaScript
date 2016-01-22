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
