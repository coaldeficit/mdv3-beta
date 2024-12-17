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
    95,178, // plt area
    79,263, // south pole
    66,128,232,235, // north pole
    41,45, // misc sectors
  ]
  for (let i=0;i<convertToBase.length;i++) {
    Planets.serpulo.sectors.get(convertToBase[i]).generateEnemyBase = true
  }
  
  // WE LOVE NPC AND IMPACT
  const convertToSurv = [
    24,129,224,225,226,227, // north pole
  ]
  for (let i=0;i<convertToSurv.length;i++) {
    Planets.serpulo.sectors.get(convertToSurv[i]).generateEnemyBase = false
  }
  Planets.serpulo.updateBaseCoverage()
  
  // FORCE SECTOR DIFFICULY
  // low
  Planets.serpulo.sectors.get(45).threat = 0.1 // meme
  // medium
  Planets.serpulo.sectors.get(182).threat = 0.26
  // high
  Planets.serpulo.sectors.get(24).threat = 0.746
  Planets.serpulo.sectors.get(65).threat = 0.746
  Planets.serpulo.sectors.get(226).threat = 0.746
  // extreme
  Planets.serpulo.sectors.get(7).threat = 0.9 // its strictly personal
  Planets.serpulo.sectors.get(117).threat = 0.85
  Planets.serpulo.sectors.get(127).threat = 0.85 // on the way to sector 7
  Planets.serpulo.sectors.get(144).threat = 0.85
  Planets.serpulo.sectors.get(145).threat = 0.85
  Planets.serpulo.sectors.get(194).threat = 0.85
  Planets.serpulo.sectors.get(229).threat = 0.85
  Planets.serpulo.sectors.get(235).threat = 0.85
  Planets.serpulo.sectors.get(258).threat = 0.85
  // erad
  Planets.serpulo.sectors.get(5).threat = 1
  Planets.serpulo.sectors.get(57).threat = 1
  Planets.serpulo.sectors.get(61).threat = 1.15
  Planets.serpulo.sectors.get(84).threat = 1.2
  Planets.serpulo.sectors.get(228).threat = 1.1
  Planets.serpulo.sectors.get(255).threat = 1.22
  Planets.serpulo.sectors.get(262).threat = 1.1
})