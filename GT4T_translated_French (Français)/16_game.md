{{meta {load_files: ["code/chapter/16_game.js", "code/levels.js"], zip: "html include=[\"css/game.css\"]"}}}

# Projet : Plate-forme Bir Oyunu

{{quote {author: "Iain Banks", title: "Oyunların Oyuncusu", chapter: true}

L'objectif est d'améliorer la qualité de l'offre.

quote}}

{{index "Banks, Ian", "project chapter", simulation}}

{{figure {url: "img/chapter_picture_16.jpg", alt: "Illustration showing a computer game character jumping over lava in a two dimensional world", chapter: "framed"}}}

Bilgisayarlara olan ilk hayranlığımın çoğu, birçok nerd çocuk gibi, bilgisayar ((oyun))larıyla ilgiliydi. Manipüle edebileceğim ve hikayelerin (bir şekilde) ortaya çıktığı minik simüle edilmiş ((dünya))lara çekildim - sanırım, aslında sundukları olasılklardan çok, ((hayal gücümü)) onlara yansıtma şeklimden dolayı.

Oyun programlamada kimseye bir ((kariyer)) dilemem. ((Müzik)) endüstrisi gibi, bu alanda çalışmak isteyen istekli gençlerin sayısı ile bu tür insanlara olan gerçek talep arasındaki tutarsızlık olduça sağlıksızir ortam yaratır. Ancak eğlence için oyun yazmak eğlencelidir.

{{index "jump-and-run game", dimensions}}

Bu bölüm küçük bir ((platform oyunu)) uygulamasını ele alacaktır. Platform oyunları (veya "zıpla ve koş" oyunları), ((oyuncunun)) genellikle iki boyutlu ve yandan görülen bir ((dünya)) içinde bir figürü hareket ettirmesini ve bu sırada şeylerin üzerinden ve üstüne atlamasını bekleyen oyunlardır.

## Oyun

{{index minimalism, "Palef, Thomas", "Dark Blue (game)"}}

Notre ((jeu)) sera grosso modo basé sur [Dark Blue](http://www.lessmilk.com/games/10)[ (_www.lessmilk.com/games/10_)]{if book} de Thomas Palef. J'ai choisi ce jeu parce qu'il est à la fois divertissant et minimaliste et parce qu'il peut être construit sans trop de ((code)). Il se présente comme suit :

{{figure {url: "img/darkblue.png", alt: "Screenshot of the 'Dark Blue' game, showing a world made out of colored boxes. There's a black box representing the player, standing on lines of white against a blue background. Small yellow coins float in the air, and some parts of the background are red, representing lava."}}}

{{index coin, lava}}

La ((case)) sombre représente le ((joueur)), dont la tâche consiste à collecter les cases jaunes (pièces) tout en évitant les cases rouges (lave). Un ((niveau)) est terminé lorsque toutes les pièces ont été collectées.

{{index keyboard, jumping}}

Le joueur peut se déplacer à l'aide des flèches gauche et droite et peut sauter avec la flèche du haut. Le saut est une spécialité de ce personnage de jeu. Il peut atteindre plusieurs fois sa propre hauteur et changer de direction en plein vol. Ce n'est peut-être pas tout à fait réaliste, mais cela donne au joueur l'impression de contrôler directement son ((avatar)) à l'écran.

{{index "fractional number", discretization, "artificial life", "electronic life"}}

Le ((jeu)) consiste en un ((arrière-plan)) statique, disposé comme une ((grille)), avec les éléments mobiles superposés sur cet arrière-plan. Chaque champ de la grille est soit vide, soit plein, soit ((lave)). Les éléments mobiles sont le joueur, les pièces et certains morceaux de lave. Les positions de ces éléments ne sont pas contraintes par la grille - leurs coordonnées peuvent être fractionnaires, ce qui permet un ((mouvement)) fluide.

## La technologie

{{index "event handling", keyboard, [DOM, graphics]}}

Nous utiliserons le DOM ((browser)) pour afficher le jeu, et nous lirons les données de l'utilisateur en gérant les événements liés aux touches.

{{index rectangle, "background (CSS)", "position (CSS)", graphics}}

Le code lié à l'écran et au clavier n'est qu'une petite partie du travail que nous devons effectuer pour construire ce ((jeu)). Comme tout ressemble à des ((boîtes))es colorées, le dessin est simple : nous créons des éléments DOM et utilisons le style pour leur donner une couleur de fond, une taille et une position.

{{index "table (HTML tag)"}}

Nous pouvons représenter l'arrière-plan comme une table puisqu'il s'agit d'une ((grille)) immuable de carrés. Les éléments en mouvement peuvent être superposés à l'aide d'éléments positionnés de manière absolue.

{{index performance, [DOM, graphics]}}

Dans les jeux et autres programmes qui doivent animer les ((graphiques)) et répondre aux ((entrées)) de l'utilisateur sans délai notable, ((l'efficacité)) est importante. Bien que le DOM n'ait pas été conçu à l'origine pour des graphiques de haute performance, il est en fait plus performant qu'on ne pourrait le penser. Vous avez vu des ((animations)) sur [Chapter ?](dom#animation). Sur une machine moderne, un jeu simple comme celui-ci fonctionne bien, même si nous ne nous préoccupons pas beaucoup de l'(optimisation).

{{index canvas, [DOM, graphics]}}

Dans le site [chapitre suivant](canvas), nous explorerons une autre technologie ((navigateur)), la balise `<canvas>`, qui offre une manière plus traditionnelle de dessiner des graphiques, en travaillant en termes de formes et de ((pixels)) plutôt qu'en termes d'éléments DOM.

## Niveaux

{{index dimensions}}

Nous aurons besoin d'un moyen lisible et modifiable par l'homme pour spécifier les niveaux. Puisque tout peut commencer sur une grille, nous pourrions utiliser de grandes chaînes dans lesquelles chaque caractère représente un élément - soit une partie de la grille d'arrière-plan, soit un élément mobile.

Le plan d'un petit niveau pourrait ressembler à ceci :

```{includeCode: true}
let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;
```

{{index level}}

Les points sont des espaces vides, les caractères dièse ( `#`) sont des murs et les signes plus sont de la lave. La position de départ du ((joueur)) est le ((signe at)) ( `@`). Chaque caractère O est une pièce de monnaie, et le signe égal ( `=`) en haut est un bloc de lave qui se déplace horizontalement d'avant en arrière.

{{index bouncing}}

Nous prendrons en charge deux autres types de ((lave)) en mouvement : le caractère pipe ( `|`) crée des blobs se déplaçant verticalement, et `v` indique _goutte à goutte_ la lave se déplaçant verticalement, qui ne rebondit pas en avant et en arrière mais se déplace uniquement vers le bas, sautant à sa position de départ lorsqu'elle touche le sol.

Un ((jeu)) entier se compose de plusieurs ((niveaux)) que le ((joueur)) doit compléter. Un niveau est terminé lorsque toutes les ((pièces)) ont été collectées. Si le joueur touche de la ((lave)), le niveau en cours est ramené à sa position de départ et le joueur peut réessayer.

{{id level}}

## Lecture d'un niveau

{{index "Level class"}}

La ((classe)) suivante stocke un objet ((niveau)). Son argument doit être la chaîne de caractères qui définit le niveau.

```{includeCode: true}
class Level {
  constructor(plan) {
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type != "string") {
          let pos = new Vec(x, y);
          this.startActors.push(type.create(pos, ch));
          type = "empty";
        }
        return type;
      });
    });
  }
}
```

{{index "trim method", "split method", [whitespace, trimming]}}

La méthode `trim` est utilisée pour supprimer les espaces au début et à la fin de la chaîne du plan. Cela permet à notre exemple de plan de commencer par une nouvelle ligne, de sorte que toutes les lignes se trouvent directement les unes en dessous des autres. La chaîne restante est divisée en ((caractère de nouvelle ligne)) et chaque ligne est répartie dans un tableau, ce qui produit des tableaux de caractères.

{{index [array, "as matrix"]}}

Ainsi, `rows` contient un tableau de tableaux de caractères, les lignes du plan. Nous pouvons en déduire la largeur et la hauteur du niveau. Mais nous devons encore séparer les éléments mobiles de la grille d'arrière-plan. Nous appellerons les éléments mobiles _acteurs_. Ils seront stockés dans un tableau d'objets. L'arrière-plan sera un tableau de tableaux de chaînes de caractères, contenant des types de champs tels que `"empty"`, `"wall"` ou `"lava"`.

{{index "map method"}}

Pour créer ces tableaux, nous appliquons le mappage sur les lignes, puis sur leur contenu. Rappelez-vous que `map` transmet l'index du tableau comme second argument à la fonction de mapping, qui nous indique les coordonnées x et y d'un personnage donné. Les positions dans le jeu seront stockées sous forme de paires de coordonnées, le coin supérieur gauche étant 0,0 et chaque carré de l'arrière-plan ayant une unité de hauteur et de largeur.

{{index "static method"}}

Pour interpréter les caractères du plan, le constructeur de `Level` utilise l'objet `levelChars` qui, pour chaque caractère utilisé dans les descriptions de niveau, contient une chaîne de caractères s'il s'agit d'un type d'arrière-plan, et une classe s'il s'agit d'un acteur. Lorsque `type` est une classe d'acteur, sa méthode statique `create` est utilisée pour créer un objet, qui est ajouté à `startActors`, et la fonction de mise en correspondance renvoie `"empty"` pour ce carré d'arrière-plan.

{{index "Vec class"}}

La position de l'acteur est stockée sous la forme d'un objet `Vec`. Il s'agit d'un vecteur bidimensionnel, un objet doté de propriétés `x` et `y`, comme le montrent les exercices de [Chapter ?](object#exercise_vector).

{{index [state, in objects]}}

Au fur et à mesure que le jeu se déroule, les acteurs se retrouvent à des endroits différents, voire disparaissent complètement (comme le font les pièces de monnaie lorsqu'elles sont collectées). Nous utiliserons une classe `State` pour suivre l'état d'un jeu en cours.

```{includeCode: true}
class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
}
```

La propriété `status` passera à `"lost"` ou `"won"` lorsque le jeu sera terminé.

Il s'agit à nouveau d'une structure de données persistante : la mise à jour de l'état du jeu crée un nouvel état et laisse l'ancien intact.

## Acteurs

{{index actor, "Vec class", [interface, object]}}

Les objets acteurs représentent la position et l'état actuels d'un élément mobile donné dans notre jeu. Tous les objets acteurs se conforment à la même interface. Leur propriété `pos` contient les coordonnées du coin supérieur gauche de l'élément, et leur propriété `size` contient sa taille.

Ils disposent ensuite d'une méthode `update`, qui est utilisée pour calculer leur nouvel état et leur nouvelle position après un pas de temps donné. Elle simule ce que fait l'acteur - se déplacer en réponse aux touches fléchées pour le joueur et rebondir d'avant en arrière pour la lave - et renvoie un nouvel objet acteur mis à jour.

La propriété `type` contient une chaîne de caractères qui identifie le type de l'acteur ( `"player"`, `"coin"` ou `"lava"`), ce qui est utile pour dessiner le jeu : l'aspect du rectangle dessiné pour un acteur est basé sur son type.

Les classes d'acteurs ont une méthode statique `create` qui est utilisée par le constructeur `Level` pour créer un acteur à partir d'un personnage du plan de niveau. On lui donne les coordonnées du personnage et le personnage lui-même, ce qui est nécessaire car la classe `Lava` gère plusieurs personnages différents.

{{id vector}}

Il s'agit de la classe `Vec` que nous utiliserons pour nos valeurs bidimensionnelles, telles que la position et la taille des acteurs.

```{includeCode: true}
class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}
```

{{index "times method", multiplication}}

La méthode `times` met à l'échelle un vecteur par un nombre donné. Elle sera utile lorsque nous devrons multiplier un vecteur de vitesse par un intervalle de temps pour obtenir la distance parcourue pendant ce temps.

Les différents types d'acteurs ont leurs propres classes car leur comportement est très différent. Définissons ces classes. Nous aborderons leurs méthodes `update` plus tard.

{{index simulation, "Player class"}}

La classe du joueur possède une propriété `speed` qui stocke sa vitesse actuelle afin de simuler l'élan et la gravité.

```{includeCode: true}
class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)),
                      new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);
```

Comme un joueur a une hauteur d'une case et demie, sa position initiale est fixée à une demi-case au-dessus de la position où le personnage `@` est apparu. De cette façon, le bas du personnage s'aligne sur le bas de la case dans laquelle il est apparu.

La propriété `size` est la même pour toutes les instances de `Player`, nous la stockons donc sur le prototype plutôt que sur les instances elles-mêmes. Nous aurions pu utiliser un ((getter)) comme `type`, mais cela créerait et renverrait un nouvel objet `Vec` à chaque fois que la propriété est lue, ce qui serait un gaspillage. (Les chaînes de caractères, étant ((immuables)), n'ont pas besoin d'être recréées à chaque fois qu'elles sont évaluées).

{{index "Lava class", bouncing}}

Lors de la construction d'un acteur `Lava`, nous devons initialiser l'objet différemment selon le personnage sur lequel il est basé. La lave dynamique se déplace à sa vitesse actuelle jusqu'à ce qu'elle rencontre un obstacle. À ce moment-là, si elle possède la propriété `reset`, elle sautera pour revenir à sa position de départ (goutte à goutte). Dans le cas contraire, elle inversera sa vitesse et continuera dans l'autre sens (rebond).

La méthode `create` examine le caractère transmis par le constructeur `Level` et crée l'acteur de lave approprié.

```{includeCode: true}
class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() { return "lava"; }

  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vec(1, 1);
```

{{index "Coin class", animation}}

 `Coin` Les acteurs sont relativement simples. La plupart du temps, ils restent assis à leur place. Mais pour animer un peu le jeu, ils sont dotés d'un "wobble", un léger mouvement vertical de va-et-vient. Pour suivre ce mouvement, un objet pièce stocke une position de base ainsi qu'une propriété `wobble` qui suit la ((phase)) du mouvement de rebond. L'ensemble de ces éléments détermine la position réelle de la pièce (stockée dans la propriété `pos`).

```{includeCode: true}
class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
                    Math.random() * Math.PI * 2);
  }
}

Coin.prototype.size = new Vec(0.6, 0.6);
```

{{index "Math.random function", "random number", "Math.sin function", sine, wave}}

Dans [Chapter?](dom#sin_cos), nous avons vu que `Math.sin` nous donne la coordonnée y d'un point sur un cercle. Cette coordonnée va et vient dans une forme d'onde régulière à mesure que nous nous déplaçons le long du cercle, ce qui rend la fonction sinusoïdale utile pour modéliser un mouvement ondulatoire.

{{index pi}}

Pour éviter que toutes les pièces montent et descendent de manière synchrone, la phase de départ de chaque pièce est aléatoire. La période de la vague de `Math.sin`, c'est-à-dire la largeur de la vague qu'elle produit, est de 2π. Nous multiplions la valeur renvoyée par `Math.random` par ce nombre pour donner à la pièce une position de départ aléatoire sur la vague.

{{index map, [object, "as map"]}}

Nous pouvons maintenant définir l'objet `levelChars` qui associe les personnages du plan aux types de grilles d'arrière-plan ou aux classes d'acteurs.

```{includeCode: true}
const levelChars = {
  ".": "empty", "#": "wall", "+": "lava",
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};
```

Nous disposons ainsi de tous les éléments nécessaires à la création d'une instance `Level`.

```{includeCode: strip_log}
let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);
// → 22 by 9
```

La tâche qui nous attend consiste à afficher ces niveaux à l'écran et à modéliser le temps et le mouvement à l'intérieur de ces niveaux.

## L'encapsulation, un fardeau

{{index "programming style", "program size", complexity}}

La plupart du code de ce chapitre ne se préoccupe pas beaucoup de ((encapsulation)) pour deux raisons. Premièrement, l'encapsulation demande un effort supplémentaire. Elle rend les programmes plus volumineux et nécessite l'introduction de concepts et d'interfaces supplémentaires. Comme il n'y a qu'une quantité limitée de code que l'on peut jeter à la figure d'un lecteur avant que ses yeux ne se dessillent, j'ai fait un effort pour que le programme reste petit.

{{index [interface, design]}}

Deuxièmement, les différents éléments de ce jeu sont si étroitement liés que si le comportement de l'un d'entre eux changeait, il est peu probable que les autres puissent rester en l'état. Les interfaces entre les éléments finiraient par encoder un grand nombre d'hypothèses sur la façon dont le jeu fonctionne. Cela les rend beaucoup moins efficaces - chaque fois que vous changez une partie du système, vous devez toujours vous préoccuper de la façon dont cela affecte les autres parties parce que leurs interfaces ne couvriraient pas la nouvelle situation.

Certaines pages _((point de coupe))s_ d'un système se prêtent bien à une séparation par le biais d'interfaces rigoureuses, mais d'autres non. Essayer d'encapsuler quelque chose qui n'est pas une frontière appropriée est un moyen sûr de gaspiller beaucoup d'énergie. Lorsque vous commettez cette erreur, vous remarquez généralement que vos interfaces deviennent maladroitement grandes et détaillées et qu'elles doivent être modifiées souvent, au fur et à mesure que le programme évolue.

{{index graphics, encapsulation, graphics}}

Il y a une chose que nous _volonté_ encapsulons, et c'est le sous-système ((dessin)). La raison en est que nous ((afficher)) le même jeu d'une manière différente sur le site [chapitre suivant](canvas#canvasdisplay). En plaçant le dessin derrière une interface, nous pouvons y charger le même programme de jeu et y brancher un nouveau ((module)) d'affichage.

{{id domdisplay}}

## Dessin

{{index "DOMDisplay class", [DOM, graphics]}}

L'encapsulation du code ((dessin)) se fait en définissant un objet _((affichage))_, qui affiche un ((niveau)) et un état donnés. Le type d'affichage que nous définissons dans ce chapitre est appelé `DOMDisplay` parce qu'il utilise des éléments DOM pour afficher le niveau.

{{index "style attribute", CSS}}

Nous utiliserons une feuille de style pour définir les couleurs et autres propriétés fixes des éléments qui composent le jeu. Il serait également possible d'assigner directement la propriété `style` des éléments lorsque nous les créons, mais cela produirait des programmes plus verbeux.

{{index "class attribute"}}

La fonction d'aide suivante permet de créer un élément et de lui attribuer des attributs et des nœuds enfants :

```{includeCode: true}
function elt(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}
```

Un affichage est créé en lui donnant un élément parent auquel il doit s'ajouter et un objet ((niveau)).

```{includeCode: true}
class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt("div", {class: "game"}, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() { this.dom.remove(); }
}
```

{{index level}}

La grille ((background)) du niveau, qui ne change jamais, est dessinée une seule fois. Les acteurs sont redessinés chaque fois que l'affichage est mis à jour avec un état donné. La propriété `actorLayer` sera utilisée pour suivre l'élément qui contient les acteurs afin qu'ils puissent être facilement retirés et remplacés.

{{index scaling, "DOMDisplay class"}}

Nos ((coordonnées)) et nos tailles sont exprimées en unités ((grille)), où une taille ou une distance de 1 correspond à un bloc de la grille. Lorsque nous définissons des tailles ((pixel)), nous devons augmenter l'échelle de ces coordonnées - tout dans le jeu serait ridiculement petit avec un seul pixel par carré. La constante `scale` indique le nombre de pixels qu'une seule unité occupe à l'écran.

```{includeCode: true}
const scale = 20;

function drawGrid(level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt("tr", {style: `height: ${scale}px`},
        ...row.map(type => elt("td", {class: type})))
  ));
}
```

{{index "table (HTML tag)", "tr (HTML tag)", "td (HTML tag)", "spread operator"}}

Comme indiqué, l'arrière-plan est dessiné sous la forme d'un élément `<table>`. Cela correspond bien à la structure de la propriété `rows` du niveau - chaque ligne de la grille est transformée en une ligne de tableau (élément `<tr>`). Les chaînes de la grille sont utilisées comme noms de classe pour les cellules du tableau ( `<td>`). L'opérateur spread (triple point) est utilisé pour transmettre des tableaux de nœuds enfants à `elt` en tant qu'arguments distincts.

{{id game_css}}

Le ((CSS)) suivant donne au tableau l'aspect de l'arrière-plan que nous souhaitons :

```{lang: "css"}
.background    { background: rgb(52, 166, 251);
                 table-layout: fixed;
                 border-spacing: 0;              }
.background td { padding: 0;                     }
.lava          { background: rgb(255, 100, 100); }
.wall          { background: white;              }
```

{{index "padding (CSS)"}}

Certains d'entre eux ( `table-layout`, `border-spacing`, et `padding`) sont utilisés pour supprimer un comportement par défaut indésirable. Nous ne voulons pas que la disposition du ((tableau)) dépende du contenu de ses cellules, et nous ne voulons pas d'espace entre les cellules du ((tableau)) ni de remplissage à l'intérieur de celles-ci.

{{index "background (CSS)", "rgb (CSS)", CSS}}

La règle `background` définit la couleur d'arrière-plan. CSS permet de spécifier les couleurs sous forme de mots ( `white`) ou sous un format tel que `rgb(R, G, B)`, où les composantes rouge, verte et bleue de la couleur sont séparées en trois nombres compris entre 0 et 255. Ainsi, dans `rgb(52, 166, 251)`, la composante rouge est 52, la verte est 166 et la bleue est 251. La composante bleue étant la plus importante, la couleur obtenue sera bleutée. Vous pouvez voir que dans la règle `.lava`, le premier nombre (rouge) est le plus grand.

{{index [DOM, graphics]}}

Nous dessinons chaque ((acteur)) en créant un élément DOM pour lui et en définissant la position et la taille de cet élément en fonction des propriétés de l'acteur. Les valeurs doivent être multipliées par `scale` pour passer des unités de jeu aux pixels.

```{includeCode: true}
function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}
```

{{index "position (CSS)", "class attribute"}}

Pour donner à un élément plus d'une classe, nous séparons les noms de classe par des espaces. Dans le code ((CSS)) suivant, la classe `actor` donne aux acteurs leur position absolue. Le nom de leur type est utilisé comme classe supplémentaire pour leur donner une couleur. Nous n'avons pas besoin de redéfinir la classe `lava` car nous réutilisons la classe pour les carrés de la grille de lave que nous avons définie plus tôt.

```{lang: "css"}
.actor  { position: absolute;            }
.coin   { background: rgb(241, 229, 89); }
.player { background: rgb(64, 64, 64);   }
```

{{index graphics, optimization, efficiency, [state, "of application"], [DOM, graphics]}}

La méthode `syncState` est utilisée pour afficher un état donné. Elle supprime d'abord les anciens graphiques des acteurs, s'il y en a, puis redessine les acteurs dans leurs nouvelles positions. Il peut être tentant d'essayer de réutiliser les éléments du DOM pour les acteurs, mais pour que cela fonctionne, nous aurions besoin de beaucoup de comptabilité supplémentaire pour associer les acteurs aux éléments du DOM et pour nous assurer que nous supprimons les éléments lorsque leurs acteurs disparaissent. Comme il n'y a généralement qu'une poignée d'acteurs dans le jeu, les redessiner tous n'est pas coûteux.

```{includeCode: true}
DOMDisplay.prototype.syncState = function(state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};
```

{{index level, "class attribute"}}

En ajoutant l'état actuel du niveau en tant que nom de classe au wrapper, nous pouvons styliser l'acteur joueur légèrement différemment lorsque la partie est gagnée ou perdue en ajoutant une règle ((CSS)) qui ne prend effet que lorsque le joueur a un ((élément ancêtre)) avec une classe donnée.

```{lang: "css"}
.lost .player {
  background: rgb(160, 64, 64);
}
.won .player {
  box-shadow: -4px -7px 8px white, 4px -7px 8px white;
}
```

{{index player, "box shadow (CSS)"}}

Après avoir touché la ((lave)), la couleur du joueur devient rouge foncé, suggérant une brûlure. Lorsque la dernière pièce a été collectée, nous ajoutons deux ombres blanches floues, l'une en haut à gauche et l'autre en haut à droite, afin de créer un effet de halo blanc.

{{id viewport}}

{{index "position (CSS)", "max-width (CSS)", "overflow (CSS)", "max-height (CSS)", viewport, scrolling, [DOM, graphics]}}

Nous ne pouvons pas supposer que le niveau tient toujours dans le _fenêtre_- l'élément dans lequel nous dessinons le jeu. C'est pourquoi l'appel à `scrollPlayerIntoView` est nécessaire. Il garantit que si le niveau dépasse de la fenêtre de visualisation, nous faisons défiler cette fenêtre pour nous assurer que le joueur est proche de son centre. Le ((CSS)) suivant donne à l'élément DOM enveloppant du jeu une taille maximale et s'assure que tout ce qui dépasse de la boîte de l'élément n'est pas visible. Nous lui donnons également une position relative afin que les acteurs qu'il contient soient positionnés par rapport au coin supérieur gauche du niveau.

```{lang: css}
.game {
  overflow: hidden;
  max-width: 600px;
  max-height: 450px;
  position: relative;
}
```

{{index scrolling}}

Dans la méthode `scrollPlayerIntoView`, nous déterminons la position du lecteur et mettons à jour la position de défilement de l'élément enveloppant. Nous modifions la position de défilement en manipulant les propriétés `scrollLeft` et `scrollTop` de cet élément lorsque le lecteur est trop proche du bord.

```{includeCode: true}
DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // The viewport
  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5))
                         .times(scale);

  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};
```

{{index center, coordinates, readability}}

La façon dont le centre du joueur est trouvé montre comment les méthodes de notre type `Vec` permettent d'écrire des calculs avec des objets d'une manière relativement lisible. Pour trouver le centre de l'acteur, nous ajoutons sa position (son coin supérieur gauche) et la moitié de sa taille. C'est le centre en coordonnées de niveau, mais nous en avons besoin en coordonnées de pixel, donc nous multiplions le vecteur résultant par notre échelle d'affichage.

{{index validation}}

Ensuite, une série de contrôles vérifie que la position du lecteur n'est pas en dehors de la plage autorisée. Notez que parfois, les coordonnées de défilement du non-sens seront inférieures à zéro ou dépasseront la zone de défilement de l'élément. Ce n'est pas grave, le DOM les contraindra à des valeurs acceptables. Si vous réglez `scrollLeft` sur -10, il deviendra 0.

Il aurait été légèrement plus simple de toujours essayer de faire défiler le lecteur jusqu'au centre de la ((fenêtre)). Mais cela crée un effet plutôt dérangeant. Lorsque vous sautez, la vue se déplace constamment de haut en bas. Il est plus agréable d'avoir une zone "neutre" au milieu de l'écran où vous pouvez vous déplacer sans provoquer de défilement.

{{index [game, screenshot]}}

Nous sommes maintenant en mesure d'afficher notre minuscule niveau.

```{lang: html}
<link rel="stylesheet" href="css/game.css">

<script>
  let simpleLevel = new Level(simpleLevelPlan);
  let display = new DOMDisplay(document.body, simpleLevel);
  display.syncState(State.start(simpleLevel));
</script>
```

{{if book

{{figure {url: "img/game_simpleLevel.png", alt: "Screenshot of the rendered level", width: "7cm"}}}

si}}

{{index "link (HTML tag)", CSS}}

La balise `<link>`, lorsqu'elle est utilisée avec `rel="stylesheet"`, permet de charger un fichier CSS dans une page. Le fichier `game.css` contient les styles nécessaires à notre jeu.

## Mouvement et collision

{{index physics, [animation, "platform game"]}}

Nous en sommes maintenant au point où nous pouvons commencer à ajouter le mouvement. L'approche de base, adoptée par la plupart des jeux de ce type, consiste à diviser le ((temps)) en petites étapes et, pour chaque étape, à déplacer les acteurs d'une distance correspondant à leur vitesse multipliée par la taille de l'étape temporelle. Le temps étant mesuré en secondes, les vitesses sont exprimées en unités par seconde.

{{index obstacle, "collision detection"}}

Déplacer des objets est facile. La difficulté consiste à gérer les interactions entre les éléments. Lorsque le joueur heurte un mur ou un sol, il ne doit pas se contenter de le traverser. Le jeu doit remarquer qu'un mouvement donné fait qu'un objet heurte un autre objet et réagir en conséquence. Pour les murs, le mouvement doit être arrêté. Lorsqu'une pièce de monnaie est touchée, elle doit être ramassée. Lorsque l'on touche de la lave, il faut perdre la partie.

La résolution de ce problème dans le cas général est une tâche ardue. Vous pouvez trouver des bibliothèques, généralement appelées _((moteur physique))s_, qui simulent l'interaction entre des objets physiques en deux ou trois ((dimensions)). Nous adopterons une approche plus modeste dans ce chapitre, en ne traitant que les collisions entre objets rectangulaires et en les traitant de manière assez simpliste.

{{index bouncing, "collision detection", [animation, "platform game"]}}

Avant de déplacer le ((joueur)) ou un bloc de ((lave)), nous testons si le mouvement l'amènerait à l'intérieur d'un mur. Si c'est le cas, nous annulons simplement le mouvement. La réaction à une telle collision dépend du type d'acteur - le joueur s'arrêtera, tandis qu'un bloc de lave rebondira.

{{index discretization}}

Cette approche exige que nos pas de ((temps)) soient plutôt petits, car le mouvement s'arrêtera avant que les objets ne se touchent réellement. Si les pas de temps (et donc les pas de mouvement) sont trop grands, le joueur finira par planer à une distance notable au-dessus du sol. Une autre approche, sans doute meilleure mais plus compliquée, consisterait à trouver le point de collision exact et à s'y déplacer. Nous adopterons l'approche simple et masquerons ses problèmes en veillant à ce que l'animation se déroule par petites étapes.

{{index obstacle, "touches method", "collision detection"}}

{{id touches}}

Cette méthode nous indique si un ((rectangle)) (spécifié par une position et une taille) touche un élément de grille du type donné.

```{includeCode: true}
Level.prototype.touches = function(pos, size, type) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
                      y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (here == type) return true;
    }
  }
  return false;
};
```

{{index "Math.floor function", "Math.ceil function"}}

La méthode calcule l'ensemble des carrés de la grille avec lesquels le corps ((se superpose)) en utilisant `Math.floor` et `Math.ceil` sur ses ((coordonnées)). Rappelez-vous que les carrés de la ((grille)) ont une taille de 1 par 1 unité. En ((arrondissant)) les côtés d'une boîte vers le haut et vers le bas, nous obtenons l'ensemble des carrés ((arrière-plan)) que la boîte touche.

{{figure {url: "img/game-grid.svg", alt: "Diagram showing a grid with a black box overlaid on it. All of the grid squares that are partially covered by the block are marked.", width: "3cm"}}}

Nous bouclons sur le bloc de ((grille)) carrés trouvés en ((arrondissant)) les ((coordonnées)) et retournons `true` lorsqu'un carré correspondant est trouvé. Les carrés en dehors du niveau sont toujours traités comme `"wall"` pour s'assurer que le joueur ne peut pas quitter le monde et que nous n'essaierons pas accidentellement de lire en dehors des limites de notre tableau `rows`.

La méthode `update` utilise `touches` pour déterminer si le joueur touche de la lave.

```{includeCode: true}
State.prototype.update = function(time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) {
    return new State(this.level, actors, "lost");
  }

  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};
```

La méthode reçoit un pas de temps et une structure de données qui lui indique quelles touches sont maintenues enfoncées. La première chose qu'elle fait est d'appeler la méthode `update` sur tous les acteurs, ce qui produit un tableau d'acteurs mis à jour. Les acteurs reçoivent également le pas de temps, les clés et l'état, afin qu'ils puissent baser leur mise à jour sur ces éléments. Seul le joueur lira les touches, puisque c'est le seul acteur contrôlé par le clavier.

Si la partie est déjà terminée, aucun traitement supplémentaire ne doit être effectué (la partie ne peut pas être gagnée après avoir été perdue, ou vice versa). Dans le cas contraire, la méthode teste si le joueur touche de la lave en arrière-plan. Si c'est le cas, la partie est perdue et nous avons terminé. Enfin, si le jeu est toujours en cours, la méthode vérifie si d'autres acteurs chevauchent le joueur.

Le chevauchement entre les acteurs est détecté à l'aide de la fonction `overlap`. Elle prend deux objets acteurs et renvoie un résultat vrai lorsqu'ils se touchent, ce qui est le cas lorsqu'ils se chevauchent à la fois le long de l'axe x et de l'axe y.

```{includeCode: true}
function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y;
}
```

Si un acteur se chevauche, sa méthode `collide` a la possibilité de mettre à jour l'état. Si vous touchez un acteur de lave, l'état du jeu devient `"lost"`. Les pièces de monnaie disparaissent lorsque vous les touchez et passent à l'état `"won"` lorsqu'il s'agit de la dernière pièce de monnaie du niveau.

```{includeCode: true}
Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function(state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};
```

{{id actors}}

## Mise à jour des acteurs

{{index actor, "Lava class", lava}}

Les méthodes `update` des objets acteurs prennent comme arguments le pas de temps, l'objet état et un objet `keys`. La méthode pour le type d'acteur `Lava` ignore l'objet `keys`.

```{includeCode: true}
Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    return new Lava(this.pos, this.speed.times(-1));
  }
};
```

{{index bouncing, multiplication, "Vec class", "collision detection"}}

Cette méthode `update` calcule une nouvelle position en ajoutant le produit du pas ((temps)) et de la vitesse actuelle à son ancienne position. Si aucun obstacle ne bloque cette nouvelle position, il s'y déplace. S'il y a un obstacle, le comportement dépend du type de bloc ((lave)) - la lave qui coule a une position `reset`, à laquelle elle revient lorsqu'elle heurte quelque chose. La lave rebondissante inverse sa vitesse en la multipliant par -1, de sorte qu'elle commence à se déplacer dans la direction opposée.

{{index "Coin class", coin, wave}}

Les pièces utilisent leur méthode `update` pour osciller. Elles ignorent les collisions avec la grille puisqu'elles oscillent simplement à l'intérieur de leur propre carré.

```{includeCode: true}
const wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function(time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
                  this.basePos, wobble);
};
```

{{index "Math.sin function", sine, phase}}

La propriété `wobble` est incrémentée pour suivre le temps, puis utilisée comme argument à `Math.sin` pour trouver la nouvelle position sur la ((vague)). La position actuelle de la pièce est alors calculée à partir de sa position de base et d'un décalage basé sur cette vague.

{{index "collision detection", "Player class"}}

Il reste donc le ((joueur)) lui-même. Les mouvements du joueur sont gérés séparément par ((axis)), car le fait de heurter le sol ne doit pas empêcher les mouvements horizontaux, et le fait de heurter un mur ne doit pas empêcher les mouvements de chute ou de saut.

```{includeCode: true}
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys) {
  let xSpeed = 0;
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  if (keys.ArrowRight) xSpeed += playerXSpeed;
  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }

  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};
```

{{index [animation, "platform game"], keyboard}}

Le mouvement horizontal est calculé en fonction de l'état des touches fléchées gauche et droite. Si aucun mur ne bloque la nouvelle position créée par ce mouvement, celle-ci est utilisée. Sinon, l'ancienne position est conservée.

{{index acceleration, physics}}

Le mouvement vertical fonctionne de la même manière mais doit simuler ((saut)) et ((gravité)). La vitesse verticale du joueur ( `ySpeed`) est d'abord accélérée pour tenir compte de la ((gravité)).

{{index "collision detection", keyboard, jumping}}

Nous vérifions à nouveau la présence de murs. S'il n'y en a pas, la nouvelle position est utilisée. S'il y a _est_ un mur, il y a deux résultats possibles. Lorsque la flèche vers le haut est pressée _et_ nous nous déplaçons vers le bas (ce qui signifie que la chose que nous avons frappée est en dessous de nous), la vitesse est réglée sur une valeur négative relativement importante. Le joueur saute alors. Si ce n'est pas le cas, le joueur s'est simplement heurté à quelque chose, et la vitesse est fixée à zéro.

La force de gravité, la vitesse de ((saut)), et pratiquement toutes les autres ((constantes)) de ce jeu ont été fixées uniquement par ((essais et erreurs)). J'ai testé des valeurs jusqu'à ce que je trouve une combinaison qui me plaise.

## Touches de suivi

{{index keyboard}}

Pour un ((jeu)) comme celui-ci, nous ne voulons pas que les touches prennent effet une fois par pression. Au contraire, nous voulons que leur effet (déplacement de la figurine du joueur) reste actif tant qu'elles sont maintenues enfoncées.

{{index "preventDefault method"}}

Nous devons mettre en place un gestionnaire de touches qui stocke l'état actuel des touches de déplacement vers la gauche, la droite et le haut. Nous devrons également appeler `preventDefault` pour ces touches afin qu'elles ne finissent pas par ((faire défiler)) la page.

{{index "trackKeys function", "key code", "event handling", "addEventListener method"}}

La fonction suivante, lorsqu'elle reçoit un tableau de noms de clés, renvoie un objet qui suit la position actuelle de ces clés. Elle enregistre des gestionnaires d'événements pour les événements `"keydown"` et `"keyup"` et, lorsque le code de la clé dans l'événement est présent dans l'ensemble des codes qu'elle suit, met à jour l'objet.

```{includeCode: true}
function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const arrowKeys =
  trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);
```

{{index "keydown event", "keyup event"}}

La même fonction de traitement est utilisée pour les deux types d'événements. Elle consulte la propriété `type` de l'objet de l'événement pour déterminer si l'état de la clé doit être mis à jour à true ( `"keydown"`) ou false ( `"keyup"`).

{{id runAnimation}}

## Le déroulement du jeu

{{index "requestAnimationFrame function", [animation, "platform game"]}}

La fonction `requestAnimationFrame`, que nous avons vue dans [Chapter?](dom#animationFrame), est un bon moyen d'animer un jeu. Mais son interface est assez primitive : pour l'utiliser, nous devons savoir à quel moment notre fonction a été appelée la dernière fois et appeler à nouveau `requestAnimationFrame` après chaque image.

{{index "runAnimation function", "callback function", [function, "as value"], [function, "higher-order"], [animation, "platform game"]}}

Définissons une fonction d'aide qui enveloppe ces parties ennuyeuses dans une interface pratique et nous permet d'appeler simplement `runAnimation`, en lui donnant une fonction qui attend une différence de temps comme argument et dessine une seule image. Lorsque la fonction frame renvoie la valeur `false`, l'animation s'arrête.

```{includeCode: true}
function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

{{index time, discretization}}

J'ai fixé un pas de cadre maximal de 100 millisecondes (un dixième de seconde). Lorsque l'onglet ou la fenêtre du navigateur contenant notre page est masqué, les appels à `requestAnimationFrame` sont suspendus jusqu'à ce que l'onglet ou la fenêtre soit à nouveau affiché. Dans ce cas, la différence entre `lastTime` et `time` correspondra à la durée totale pendant laquelle la page a été masquée. Faire avancer le jeu d'autant en une seule étape serait ridicule et pourrait provoquer des effets secondaires bizarres, tels que la chute du joueur à travers le sol.

La fonction convertit également les pas de temps en secondes, une quantité plus facile à comprendre que les millisecondes.

{{index "callback function", "runLevel function", [animation, "platform game"]}}

La fonction `runLevel` prend un objet `Level` et un constructeur ((display)) et renvoie une promesse. Elle affiche le niveau (dans `document.body`) et laisse l'utilisateur jouer. Lorsque le niveau est terminé (perdu ou gagné), `runLevel` attend une seconde de plus (pour permettre à l'utilisateur de voir ce qui se passe), puis efface l'affichage, arrête l'animation et résout la promesse en statut de fin de jeu.

```{includeCode: true}
function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}
```

{{index "runGame function"}}

Un jeu est une séquence de ((niveaux)). Chaque fois que le ((joueur)) meurt, le niveau en cours est redémarré. Lorsqu'un niveau est terminé, on passe au niveau suivant. Ceci peut être exprimé par la fonction suivante, qui prend un tableau de plans de niveau (chaînes) et un constructeur ((display)) :

```{includeCode: true}
async function runGame(plans, Display) {
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]),
                                Display);
    if (status == "won") level++;
  }
  console.log("You've won!");
}
```

{{index "asynchronous programming", "event handling"}}

Comme nous avons fait en sorte que `runLevel` renvoie une promesse, `runGame` peut être écrit à l'aide d'une fonction `async`, comme le montre [Chapter ?](async). Elle renvoie une autre promesse, qui se résout lorsque le joueur termine le jeu.

{{index game, "GAME_LEVELS data set"}}

Un ensemble de plans ((niveau)) est disponible dans la reliure `GAME_LEVELS` dans [le bac à sable de ce chapitre](https://eloquentjavascript.net/code#16)[ ([_https://eloquentjavascript.net/code#16_](https://eloquentjavascript.net/code#16))]{if book}. Cette page les transmet à `runGame`, qui lance un jeu réel.

```{sandbox: null, focus: yes, lang: html, startCode: true}
<link rel="stylesheet" href="css/game.css">

<body>
  <script>
    runGame(GAME_LEVELS, DOMDisplay);
  </script>
</body>
```

{{if interactive

Voyez si vous pouvez les battre. Je me suis amusé à les construire.

si}}

## Exercices

### Fin de la partie

{{index "lives (exercise)", game}}

Dans les ((jeux de plateforme)), le joueur commence avec un nombre limité de _vies_ et perd une vie à chaque fois qu'il meurt. Lorsque le joueur n'a plus de vies, le jeu recommence depuis le début.

{{index "runGame function"}}

Ajustez `runGame` pour mettre en œuvre les vies. Le joueur commence avec trois vies. Afficher le nombre actuel de vies (à l'aide de `console.log`) à chaque fois qu'un niveau commence.

{{if interactive

```{lang: html, test: no, focus: yes}
<link rel="stylesheet" href="css/game.css">

<body>
<script>
  // The old runGame function. Modify it...
  async function runGame(plans, Display) {
    for (let level = 0; level < plans.length;) {
      let status = await runLevel(new Level(plans[level]),
                                  Display);
      if (status == "won") level++;
    }
    console.log("You've won!");
  }
  runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>
```

si}}

### Mise en pause du jeu

{{index "pausing (exercise)", "escape key", keyboard}}

Permettre de mettre en pause (suspendre) et d'annuler la pause du jeu en appuyant sur la touche Esc.

{{index "runLevel function", "event handling"}}

Pour ce faire, il suffit de modifier la fonction `runLevel` afin d'utiliser un autre gestionnaire d'événements clavier et d'interrompre ou de reprendre l'animation chaque fois que la touche Esc est actionnée.

{{index "runAnimation function"}}

À première vue, l'interface `runAnimation` ne semble pas adaptée à ce type d'utilisation, mais elle l'est si l'on réorganise la façon dont `runLevel` l'appelle.

{{index [binding, global], "trackKeys function"}}

Une fois que cela fonctionne, vous pouvez essayer autre chose. La façon dont nous avons enregistré les gestionnaires d'événements du clavier est quelque peu problématique. L'objet `arrowKeys` est actuellement une liaison globale, et ses gestionnaires d'événements sont conservés même lorsqu'aucun jeu n'est en cours d'exécution. On pourrait dire qu'ils _((fuite))_ sortent de notre système. Étendez `trackKeys` pour fournir un moyen de désenregistrer ses gestionnaires, puis modifiez `runLevel` pour enregistrer ses gestionnaires lorsqu'il démarre et les désenregistrer à nouveau lorsqu'il est terminé.

{{if interactive

```{lang: html, focus: yes, test: no}
<link rel="stylesheet" href="css/game.css">

<body>
<script>
  // The old runLevel function. Modify this...
  function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
      runAnimation(time => {
        state = state.update(time, arrowKeys);
        display.syncState(state);
        if (state.status == "playing") {
          return true;
        } else if (ending > 0) {
          ending -= time;
          return true;
        } else {
          display.clear();
          resolve(state.status);
          return false;
        }
      });
    });
  }
  runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>
```

si}}

{{hint

{{index "pausing (exercise)", [animation, "platform game"]}}

Une animation peut être interrompue en renvoyant `false` de la fonction donnée à `runAnimation`. Elle peut être poursuivie en appelant à nouveau `runAnimation`.

{{index closure}}

Nous devons donc communiquer le fait que nous mettons le jeu en pause à la fonction donnée à `runAnimation`. Pour ce faire, vous pouvez utiliser une liaison à laquelle le gestionnaire d'événements et la fonction ont tous deux accès.

{{index "event handling", "removeEventListener method", [function, "as value"]}}

Lorsque vous trouvez un moyen de désenregistrer les gestionnaires enregistrés par `trackKeys`, n'oubliez pas que la _exactes_ même valeur de fonction qui a été transmise à `addEventListener` doit être transmise à `removeEventListener` pour supprimer avec succès un gestionnaire. Ainsi, la valeur de la fonction `handler` créée dans `trackKeys` doit être disponible pour le code qui désenregistre les gestionnaires.

Vous pouvez ajouter une propriété à l'objet renvoyé par `trackKeys`, contenant soit la valeur de la fonction, soit une méthode qui gère directement le désenregistrement.

hint}}

### Un monstre

{{index "monster (exercise)"}}

Les jeux de plateforme ont traditionnellement des ennemis sur lesquels vous pouvez sauter pour les vaincre. Cet exercice vous demande d'ajouter un tel type d'acteur au jeu.

Nous l'appellerons un monstre. Les monstres se déplacent uniquement horizontalement. Vous pouvez les faire se déplacer dans la direction du joueur, rebondir d'avant en arrière comme de la lave horizontale, ou avoir n'importe quel type de mouvement. La classe n'a pas besoin de gérer les chutes, mais elle doit s'assurer que le monstre ne traverse pas les murs.

Lorsqu'un monstre touche le joueur, l'effet dépend du fait que le joueur saute ou non sur le monstre. Vous pouvez vous en rendre compte en vérifiant si le bas du joueur est proche du haut du monstre. Si c'est le cas, le monstre disparaît. Dans le cas contraire, la partie est perdue.

{{if interactive

```{test: no, lang: html, focus: yes}
<link rel="stylesheet" href="css/game.css">
<style>.monster { background: purple }</style>

<body>
  <script>
    // Complete the constructor, update, and collide methods
    class Monster {
      constructor(pos, /* ... */) {}

      get type() { return "monster"; }

      static create(pos) {
        return new Monster(pos.plus(new Vec(0, -1)));
      }

      update(time, state) {}

      collide(state) {}
    }

    Monster.prototype.size = new Vec(1.2, 2);

    levelChars["M"] = Monster;

    runLevel(new Level(`
..................................
.################################.
.#..............................#.
.#..............................#.
.#..............................#.
.#...........................o..#.
.#..@...........................#.
.##########..............########.
..........#..o..o..o..o..#........
..........#...........M..#........
..........################........
..................................
`), DOMDisplay);
  </script>
</body>
```

si}}

{{hint

{{index "monster (exercise)", "persistent data structure"}}

Si vous souhaitez mettre en œuvre un type de mouvement avec état, tel que le rebond, assurez-vous de stocker l'état nécessaire dans l'objet acteur - incluez-le en tant qu'argument du constructeur et ajoutez-le en tant que propriété.

N'oubliez pas que `update` renvoie un objet _nouveau_, au lieu de modifier l'ancien.

{{index "collision detection"}}

Lors de la gestion des collisions, trouvez le joueur dans `state.actors` et comparez sa position à celle du monstre. Pour obtenir le _fond_ du joueur, vous devez ajouter sa taille verticale à sa position verticale. La création d'un état mis à jour ressemblera soit à la méthode `collide` de `Coin` (suppression de l'acteur), soit à la méthode `Lava` (passage de l'état à `"lost"`), en fonction de la position du joueur.

hint}}
