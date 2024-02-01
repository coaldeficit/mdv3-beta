let bulLib = require("md3/libs/bulletlib")
const BomberT3 = extend(UnitType, "showerer-ship", {});
BomberT3.constructor = () => extend(UnitEntity, {});

const showererBomb = extend(BombBulletType, {
  hitEffect: Fx.flakExplosion,
  shootEffect: Fx.none,
  smokeEffect: Fx.none,
  width: 10,
  height: 14,
  splashDamageRadius: 60,
  splashDamage: 50,
  status: StatusEffects.blasted,
  fragBullets: 17,
  fragBullet: bulLib.makeBullet({
    type: BombBulletType,
    speed: 4,
    hitEffect: Fx.flakExplosion,
    shootEffect: Fx.none,
    smokeEffect: Fx.none,
    width: 5,
    height: 7,
    splashDamageRadius: 30,
    splashDamage: 9,
    status: StatusEffects.blasted
  }),
  range(){ // note to anyone reading: always override the range function for any bomb-type projectiles so that the unit ai actually uses them
    return 140
  }
});
const bombCannon = extend(Weapon, {
  name: "md3-generic-bomber-weapon",
  minShootVelocity: 0.35,
  x: 0,
  shootY: 0,
  reload: 30,
  velocityRnd: 1,
  shootCone: 180,
  inaccuracy: 15,
  shootSound: Sounds.none,
  bullet: showererBomb
});
BomberT3.weapons.add(
  bombCannon
);

Blocks.multiplicativeReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-pelter-ship"),
  Vars.content.getByName(ContentType.unit, "md3-showerer-ship")
)