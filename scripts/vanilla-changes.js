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
UnitTypes.flare.itemCapacity = 6
UnitTypes.horizon.itemCapacity = 0 // already 0 in vanilla but just in case it gets increased
UnitTypes.zenith.itemCapacity = 0
UnitTypes.antumbra.itemCapacity = 30
UnitTypes.eclipse.itemCapacity = 70
UnitTypes.poly.itemCapacity = 20
UnitTypes.mega.itemCapacity = 40
UnitTypes.quad.itemCapacity = 80
UnitTypes.oct.itemCapacity = 140

// ON CLIENT LOAD
Events.on(ClientLoadEvent, e => {
  // NUMBERED ENEMY BASES
  const convertToBase = [
    85,223, // its strictly personal
    92,93,94,96,155, // plt area
    53,54,79,80,120,253,263,264, // south pole
    72,132,266,270,271, // hard drive area
    26,66,67,128,235, // north pole
    2,9,17,41,78,197 // misc sectors
  ]
  for (let i=0;i<convertToBase.length;i++) {
    Planets.serpulo.sectors.get(convertToBase[i]).generateEnemyBase = true
  }
  Planets.serpulo.sectors.get(182).generateEnemyBase = false // enemy base moved to sector 17
  Planets.serpulo.updateBaseCoverage()
})