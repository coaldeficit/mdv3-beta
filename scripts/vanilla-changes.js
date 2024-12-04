const vfx = require("md3/libs/vfx")

// AMMO
let blastFuse = extend(ShrapnelBulletType, {
  length: Blocks.fuse.range+10+38,
  ammoMultiplier: 6,
  damage: 163,
  reloadMultiplier: 0.8,
  serrationLenScl: 13.8,
  toColor: Color.valueOf("FF795E"),
  rangeChange: 38,
  shootEffect: vfx.blastFuseShoot,
  smokeEffect: vfx.blastFuseShoot,
})
Blocks.fuse.ammoTypes.put(
  Items.blastCompound, blastFuse
);

// ITS STRICTLY PERSONAL
Units.flare.itemCapacity = 6
Units.horizon.itemCapacity = 0 // already 0 in vanilla but just in case it gets increased
Units.zenith.itemCapacity = 0
Units.antumbra.itemCapacity = 30
Units.eclipse.itemCapacity = 70
Units.poly.itemCapacity = 20
Units.mega.itemCapacity = 40
Units.quad.itemCapacity = 80
Units.oct.itemCapacity = 140