const lh2status = new Effect(30, e => {
  Draw.z(110)
  Draw.color(Color.valueOf("#7a9a9B"))
  Fill.circle(e.x, e.y, e.fout() * 1.5);
});
const irradiatedstatus = new Effect(30, e => {
  Draw.z(110)
  Draw.color(Color.valueOf("#826B57"))
  Fill.circle(e.x, e.y, e.fout() * 1.5);
  Draw.color(Color.valueOf("#a68467"))
  Fill.circle(e.x, e.y, e.fout() * 0.75);
});
const freezeBombWeak = new Effect(30, e => {
  Draw.color(Color.valueOf("#6ecdec"));
  Lines.stroke(e.fout() * 2);
  let circleRad = 4 + e.finpow() * 96;
  Lines.circle(e.x, e.y, circleRad);
  Draw.color(Color.valueOf("#6ecdec"));
  for(let i = 0; i < 3; i++){
    Drawf.tri(e.x, e.y, 6, 70 * e.fout(), (i*120)-90);
  }
  for(let i = 0; i < 3; i++){
    Drawf.tri(e.x, e.y, 6, 45 * e.fout(), (i*120)+90);
  }
  Draw.color();
  for(let i = 0; i < 3; i++){
    Drawf.tri(e.x, e.y, 3, 25 * e.fout(), (i*120)-90);
  }
  for(let i = 0; i < 3; i++){
    Drawf.tri(e.x, e.y, 3, 12.5 * e.fout(), (i*120)+90);
  }
  Drawf.light(e.x, e.y, circleRad * 1.6, Color.valueOf("#6ecdec"), e.fout());
});
const freezeBomb = new Effect(30, e => {
  Draw.color(Color.valueOf("#6ecdec"));
  Lines.stroke(e.fout() * 2);
  let circleRad = 4 + e.finpow() * 146;
  Lines.circle(e.x, e.y, circleRad);
  Draw.color(Color.valueOf("#6ecdec"));
  Draw.z(Layer.effect + 0.002)
  for(let i = 0; i < 5; i++){
    Drawf.tri(e.x, e.y, 6, 70 * e.fout(), (i*72)-90);
  }
  for(let i = 0; i < 5; i++){
    Drawf.tri(e.x, e.y, 6, 45 * e.fout(), (i*72)+90);
  }
  Draw.color();
  for(let i = 0; i < 5; i++){
    Drawf.tri(e.x, e.y, 3, 25 * e.fout(), (i*72)-90);
  }
  for(let i = 0; i < 5; i++){
    Drawf.tri(e.x, e.y, 3, 12.5 * e.fout(), (i*72)+90);
  }
  Drawf.light(e.x, e.y, circleRad * 1.6, Color.valueOf("#6ecdec"), e.fout());
});
const freezeBombExplosion = new Effect(500, 30, e => {
  Angles.randLenVectors(e.id, 30, (Math.min(Interp.pow3Out.apply(e.fin()*3), 1)) * 180, (x, y) => {
    let size = e.fout() * 28;
    Draw.color(Color.valueOf("#ffffff"));
    Draw.alpha(0.6)
    Fill.circle(e.x + x, e.y + y, size/2);
  });
});
const tempbuffstatus = new Effect(30, e => {
  Draw.color(e.color)
  Fill.square(e.x, e.y, e.fslope() * 2, 45)
});
const permabuffstatus = new Effect(30, e => {
  Draw.color(e.color)
  Angles.randLenVectors(e.id, 2, 1 + e.fin() * 2, (x, y) => {
    Fill.square(e.x + x, e.y + y, e.fout() * 2.3 + 0.5);
  });
});
const insulatedstatus = new Effect(30, e => {
  Angles.randLenVectors(e.id, 2, 1 + e.fin() * 2, (x, y) => {
    Draw.alpha(1)
    Draw.color(Color.valueOf("#454545"))
    Fill.square(e.x + x, e.y + y, e.fout() * 2.3 + 0.5);
    Draw.color(Color.valueOf("#a2a2a2"))
    Fill.square(e.x + x, e.y + y, (e.fout() * 2.3 + 0.5)*0.5);
  });
});
const b135impactShockwave = Effect(13, 300, e => {
  Draw.color(Pal.lighterOrange, Color.lightGray, e.fin())
  Lines.stroke(e.fout() * 4 + 0.2)
  Lines.circle(e.x, e.y, e.fin() * 200)
});

module.exports = {
    lh2status: lh2status,
    irradiatedstatus: irradiatedstatus,
    freezeBombWeak: freezeBombWeak,
    freezeBomb: freezeBomb,
    freezeBombExplosion: freezeBombExplosion,
    tempbuffstatus: tempbuffstatus,
    permabuffstatus: permabuffstatus,
    insulatedstatus: insulatedstatus,
    b135impactShockwave: b135impactShockwave,
};
