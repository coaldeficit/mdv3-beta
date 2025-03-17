const subturrets = require("md3/blocks/subturrets")
const blockcheck = require("md3/libs/blockcheck")

const ShotT5 = extend(UnitType, "blitz-mech", {});
ShotT5.constructor = () => extend(LegsUnit, {});

const turretBullet = extend(BasicBulletType, {
  speed: 4,
  lifetime: 60,
  damage: 190,
  shootEffect: Fx.shootBig,
  smokeEffect: Fx.shootBigSmoke2,
  shake: 0.5,
  keepVelocity: false,
  collides: false,
  collidesAir: false,
  width: 30,
  height: 45,
  splashDamage: 800,
  splashDamageRadius: 32,
  despawned(b) {
    this.super$despawned(b)
    let develop = true
    blockcheck.iterateSquare(Math.round(b.x/8)-1,Math.round(b.y/8)-1,3,3,(other => {
      if (other.block() != Blocks.air) {
        develop = false
      }
    }));
    if (develop) Vars.world.tile(Math.round(b.x/8), Math.round(b.y/8)).setNet(subturrets.blade, b.owner.team, 0)
  }
})
const turretLauncher = extend(Weapon, {
  name: "md3-generic-bomber-weapon",
  y: 0,
  x: 0,
  top: true,
  mirror: false,
  inaccuracy: 0,
  reload: 360,
  shootSound: Sounds.artillery,
  shootCone: 2,
  bullet: turretBullet,
});
ShotT5.weapons.add(
  turretLauncher
);

Blocks.tetrativeReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-rocketeer-mech"),
  Vars.content.getByName(ContentType.unit, "md3-blitz-mech")
)