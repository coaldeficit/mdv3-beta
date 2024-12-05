const bulLib = require("md3/libs/bulletlib")
const ShotT4 = extend(UnitType, "rocketeer-mech", {});
ShotT4.constructor = () => extend(LegsUnit, {});

const missile = extend(MissileUnitType, "rocketeer-mech-missile", {
  targetAir: false,
  speed: 7.3,
  maxRange: 6,
  lifetime: 60 * 1.4,
  outlineColor: Pal.darkOutline,
  engineColor: Color.valueOf("#FFA665"),
  trailColor: Color.valueOf("#FFA665"),
  engineLayer: Layer.effect,
  health: 190,
  loopSoundVolume: 0.1
});
missile.constructor = () => extend(TimedKillUnit, {});
const missileExplosion = extend(Weapon, {
  shootCone: 361,
  mirror: false,
  reload: 1,
  shootOnDeath: true,
  bullet: bulLib.makeBullet({
    type: ExplosionBulletType,
    splashDamage: 110,
    splashDamageRadius: 25,
    shootEffect: Fx.massiveExplosion,
    collidesAir: false,
  }),
})
missile.weapons.add(missileExplosion)

const launcher = extend(Weapon, {
  name: "md3-rocketeer-launcher",
  y: -3,
  x: 13,
  top: true,
  inaccuracy: 0,
  reload: 90,
  shootSound: Sounds.missileLarge,
  recoil: 6,
  baseRotation: -7,
  shootCone: 60,
  bullet: bulLib.makeBullet({
    type: BulletType,
    shootEffect: Fx.shootBig,
    smokeEffect: Fx.shootBigSmoke2,
    shake: 1.5,
    speed: 0,
    keepVelocity: false,
    collidesAir: false,
    spawnUnit: missile
  }),
});

ShotT4.weapons.add(
  launcher
);

Blocks.exponentialReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-slugger-mech"),
  Vars.content.getByName(ContentType.unit, "md3-rocketeer-mech")
)

