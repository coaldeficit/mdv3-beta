const SporeT2 = extend(UnitType, "panaeolus-boat", {});
SporeT2.constructor = () => extend(UnitWaterMove, {});
SporeT2.immunities.add(StatusEffects.sporeSlowed);
SporeT2.immunities.add(StatusEffects.sapped);
let heal = extend(RegenAbility, {
  amount: 28/60,
  getBundle() {return 'ability.regen'},
})
SporeT2.abilities.add(heal);

const shootsound = Vars.tree.loadSound("panaeolus-bullet")
const oilBullet = extend(BasicBulletType, {
  speed: 4,
  damage: 3,
  ammoMultiplier: 1,
  lifetime: 40,
  layer: 111,
  frontColor: Color.valueOf("242424"),
  backColor: Color.valueOf("000000"),
  height: 10,
  width: 8,
  shrinkY: 0,
  shrinkX: 0,
  collidesAir: true,
  status: StatusEffects.tarred,
  statusDuration: 60,
  puddles: 1,
  puddleRange: 0,
  puddleAmount: 8,
  puddleLiquid: Liquids.oil,
})
const mainGun = extend(Weapon, {
  name: "md3-panaeolus-gun",
  top: true,
  rotate: true,
  y: -2,
  x: 0,
  mirror: false,
  reload: 60,
  shootSound: shootsound,
  inaccuracy: 2.5,
  rotateSpeed: 10,
  bullet: oilBullet,
});
mainGun.shoot.shots = 12
mainGun.shoot.shotDelay = 2
SporeT2.weapons.add(
  mainGun,
);

Blocks.additiveReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-mycena-boat"),
  Vars.content.getByName(ContentType.unit, "md3-panaeolus-boat")
)