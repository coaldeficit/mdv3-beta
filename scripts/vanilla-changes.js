const vfx = require("md3/libs/vfx")
const rng = require("md3/libs/rng")

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

// i dont get this
UnitTypes.mega.isEnemy = true

// NUMBERED WAVEGEN
function numberedWaves(sector,enemyBase,airOnly) {
  rng.setIndex(sector.id)
  let groundenemies = [
    [UnitTypes.dagger,UnitTypes.mace,UnitTypes.fortress,UnitTypes.scepter,UnitTypes.reign],
    [UnitTypes.crawler,UnitTypes.atrax,UnitTypes.spiroct,UnitTypes.arkyid,UnitTypes.toxopid],
    [UnitTypes.nova,UnitTypes.pulsar,UnitTypes.quasar,UnitTypes.vela,UnitTypes.corvus]
  ]
  let airenemies = [
    [UnitTypes.flare,UnitTypes.horizon,UnitTypes.zenith,UnitTypes.antumbra,UnitTypes.eclipse],
    [UnitTypes.flare,UnitTypes.poly,UnitTypes.mega,UnitTypes.quad,UnitTypes.oct]
  ]
  if (enemyBase) {
    airenemies = [
      [UnitTypes.flare,UnitTypes.horizon,UnitTypes.zenith,rng.randomUnsynced()<500?UnitTypes.antumbra:UnitTypes.quad,rng.randomUnsynced()<500?UnitTypes.eclipse:UnitTypes.oct],
    ]
  }
  let navalenemies = [
    [UnitTypes.risso,UnitTypes.minke,UnitTypes.bryde,UnitTypes.sei,UnitTypes.omura],
    [UnitTypes.retusa,UnitTypes.oxynoe,UnitTypes.cyerce,UnitTypes.aegires,UnitTypes.navanax]
  ]
  
  let picks = []
  picks = picks.concat(airenemies)
  if (!airOnly && Vars.spawner.firstSpawn != null) {
    picks = picks.concat(Vars.spawner.firstSpawn.floor().liquidDrop!=Liquids.water?groundenemies:navalenemies)
  }
  rng.setIndex(sector.id*(22+picks.length))
  let mainLines = []
  for (let i=0;i<Math.min(picks.length,4);i++) {
    let line = -1
    while (mainLines.includes(line) && !airOnly) {
      line = Math.floor(picks.length*(rng.randomUnsynced()/1000))
    }
    mainLines.push([Math.floor(picks.length*(rng.randomUnsynced()/1000)),0,0])
  }
  function createSpawnGroup(pickunit) {
    let o = new SpawnGroup(pickunit.type)
    Object.keys(pickunit).forEach(function(prop){
      if (prop != 'type') o[prop] = pickunit[prop]
    })
    return o
  }
  let waves = new Seq()
  let settings = {
    evolveSpacing: (1.8-sector.threat)*5,
    evolveOffsetMax: 10-(sector.threat*5),
    evolveOffsetPerTier: 4-sector.threat,
    evolveNewTypeChance: 125*(mainLines.length-1)*sector.threat*5.56,
    tierOffset: sector.threat > 0.6 ? 1 : 0,
    maxTier: Math.min(Math.max(1,Math.ceil((sector.threat-0.33)*5)),4),
  }
  let mainLineIndex = 0
  function generateUnitLine(index,startWave) {
    if (mainLines[index] != null) {
      mainLines[index][1] += settings.tierOffset
      mainLines[index][2] += startWave
      do {
        let endWave = Math.ceil(mainLines[index][2] + settings.evolveSpacing + (settings.evolveOffsetMax*(rng.randomUnsynced()/1000)) + (settings.evolveOffsetPerTier*(mainLines[index][1]-settings.tierOffset)))
        if (rng.randomUnsynced() < settings.evolveNewTypeChance && mainLineIndex < mainLines.length) {
          settings.evolveNewTypeChance -= 125
          mainLineIndex++
          generateUnitLine(mainLineIndex,endWave)
          endWave = Math.ceil(endWave + settings.evolveSpacing + (settings.evolveOffsetMax*(rng.randomUnsynced()/1000)) + (settings.evolveOffsetPerTier*(mainLines[index][1]-settings.tierOffset)))
          waves.add(createSpawnGroup({
            type: picks[mainLines[index][0]][mainLines[index][1]],
            shieldScaling: 0,
            begin: mainLines[index][2],
            end: endWave+1,
            unitScaling: (mainLines[index][1]+2)-settings.tierOffset,
            spacing: (1+mainLines[index][1])-settings.tierOffset
          }))
          waves.add(createSpawnGroup({
            type: picks[mainLines[index][0]][mainLines[index][1]],
            shieldScaling: 0,
            begin: endWave+2,
            unitScaling: (mainLines[index][1]+2)*3.6,
            unitAmount: Math.ceil(((1/((mainLines[index][1]+2)-settings.tierOffset))*((endWave-mainLines[index][2])/((1+mainLines[index][1])-settings.tierOffset)))/2)
          }))
          mainLines[index][1] += 1
          mainLines[index][2] = endWave
        } else {
          waves.add(createSpawnGroup({
            type: picks[mainLines[index][0]][mainLines[index][1]],
            shieldScaling: 0,
            begin: mainLines[index][2],
            end: endWave+1,
            unitScaling: (mainLines[index][1]+2)-settings.tierOffset,
            spacing: (1+mainLines[index][1])-settings.tierOffset
          }))
          waves.add(createSpawnGroup({
            type: picks[mainLines[index][0]][mainLines[index][1]],
            shieldScaling: 0,
            begin: endWave+2,
            unitScaling: (mainLines[index][1]+2)*3.6,
            unitAmount: Math.ceil(((1/((mainLines[index][1]+2)-settings.tierOffset))*((endWave-mainLines[index][2])/((1+mainLines[index][1])-settings.tierOffset)))/2)
          }))
          mainLines[index][1] += 1
          mainLines[index][2] = endWave
        }
      } while (mainLines[index][1] <= settings.maxTier)
    }
  }
  generateUnitLine(0,0)
  if (sector.threat > 0.25 && !enemyBase) {
    waves.add(createSpawnGroup({
      type: picks[mainLines[0][0]][Math.min(mainLines[0][1],4)],
      begin: Vars.state.rules.winWave-2,
      unitScaling: 1,
      unitAmount: 1,
      spacing: Math.max(Vars.state.rules.winWave/2,18),
      effect: StatusEffects.boss
    }))
  }
  return waves
}

// SERPULO GENERATOR
let basegen = new BaseGenerator()
Planets.serpulo.generator = extend(SerpuloPlanetGenerator, {
  basegen: basegen,
  postGenerate(tiles) {
    Vars.state.rules.spawns = numberedWaves(Vars.state.rules.sector,Vars.state.rules.sector.hasEnemyBase(),false)
    if (Vars.state.rules.sector.hasEnemyBase()) {
      basegen.postGenerate()
      if (!Vars.spawner.countGroundSpawns()) {
        Vars.state.rules.spawns = numberedWaves(Vars.state.rules.sector,true,true)
      }
    }
  }
})

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
