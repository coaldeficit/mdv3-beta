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

function getMDUnit(unit) {return Vars.content.getByName(ContentType.unit, "md3-" + unit)}

// NUMBERED WAVEGEN
function numberedWaves(sector,enemyBase,airOnly,navalWaves) {
  rng.setIndex(sector.id)
  let groundenemies = [
    [UnitTypes.dagger,UnitTypes.mace,UnitTypes.fortress,UnitTypes.scepter,UnitTypes.reign],
    [UnitTypes.crawler,UnitTypes.atrax,UnitTypes.spiroct,UnitTypes.arkyid,UnitTypes.toxopid],
    [UnitTypes.nova,UnitTypes.pulsar,UnitTypes.quasar,UnitTypes.vela,UnitTypes.corvus]
  ]
  if (Planets.serpulo.sectors.get(212).info.wasCaptured) groundenemies.push([getMDUnit("shotgunner-mech"),getMDUnit("pounder-mech"),getMDUnit("slugger-mech"),getMDUnit("rocketeer-mech"),getMDUnit("howitzer-mech")])
  let airenemies = [
    [UnitTypes.flare,UnitTypes.horizon,UnitTypes.zenith,UnitTypes.antumbra,UnitTypes.eclipse],
    [UnitTypes.flare,UnitTypes.poly,UnitTypes.mega,UnitTypes.quad,UnitTypes.oct]
  ]
  if (Planets.serpulo.sectors.get(268).info.wasCaptured) airenemies.push([getMDUnit("flocker-ship"),getMDUnit("bee-ship"),getMDUnit("hornet-ship"),getMDUnit("messenger-ship"),getMDUnit("tundra-ship")])
  if (enemyBase) {
    airenemies[1][4] = UnitTypes.eclipse
  }
  let navalenemies = [
    [UnitTypes.risso,UnitTypes.minke,UnitTypes.bryde,UnitTypes.sei,UnitTypes.omura],
    [UnitTypes.retusa,UnitTypes.oxynoe,UnitTypes.cyerce,UnitTypes.aegires,UnitTypes.navanax]
  ]
  if (Planets.serpulo.sectors.get(268).info.wasCaptured) navalenemies.push([getMDUnit("mycena-boat"),getMDUnit("panaeolus-boat"),getMDUnit("hornet-ship"),getMDUnit("messenger-ship"),getMDUnit("tundra-ship")])
  
  let picks = []
  picks = picks.concat(airenemies)
  if (!airOnly && Vars.spawner.firstSpawn != null) {
    picks = picks.concat(navalWaves?navalenemies:groundenemies)
  }
  rng.setIndex(sector.id*(22+picks.length))
  let mainLines = []
  for (let i=0;i<Math.min(picks.length,4);i++) {
    let line = -1
    do {
      line = Math.floor(picks.length*(rng.randomUnsynced()/1000))
    } while (mainLines.includes(line))
    mainLines.push(line)
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
    evolveInterval: (2.18-sector.threat)*4,
    tierOffset: sector.threat > 0.6 ? 1 : 0,
    maxTier: Math.min(Math.max(1,Math.ceil((sector.threat-0.33)*5)),4),
    unitScaling: 2.18 - sector.threat
  }
  let mainLineIndex = 0
  function generateUnitLine(index,startWave) {
    let wave = startWave
    let endWave = startWave + settings.evolveInterval + (settings.evolveInterval*(rng.randomUnsynced()/1000))
    let spawnPick = -1
    for (let i=settings.tierOffset;i<Math.min(settings.maxTier+1,3);i++) {
      if (!enemyBase && Vars.spawner.spawns.size > 1) spawnPick = Vars.spawner.spawns.get(Math.floor(Vars.spawner.spawns.size*(rng.randomUnsynced()/1000))).pos()
      waves.add(createSpawnGroup({
        type: picks[mainLines[index]][i],
        begin: wave,
        end: endWave,
        unitScaling: settings.unitScaling*(enemyBase?(picks[mainLines[index]][i].flying?Vars.spawner.countFlyerSpawns():Vars.spawner.countGroundSpawns()):1),
        unitAmount: 1,
        spacing: i-settings.tierOffset ? 2 : 1,
        spawn: spawnPick,
      }))
      waves.add(createSpawnGroup({
        type: picks[mainLines[index]][i],
        begin: endWave+1,
        unitScaling: settings.unitScaling*4*(picks[mainLines[index]][i].flying?Vars.spawner.countFlyerSpawns():Vars.spawner.countGroundSpawns()),
        unitAmount: Math.ceil(((((endWave-wave)/settings.unitScaling)/(i-settings.tierOffset ? 2 : 1))/2)/(enemyBase?(picks[mainLines[index]][i].flying?Vars.spawner.countFlyerSpawns():Vars.spawner.countGroundSpawns()):1)),
        spacing: 1,
      }))
      wave = endWave - 1
      endWave += settings.evolveInterval + (settings.evolveInterval*(rng.randomUnsynced()/1000))
    }
    if (!enemyBase && Vars.spawner.spawns.size > 1) spawnPick = Vars.spawner.spawns.get(Math.floor(Vars.spawner.spawns.size*(rng.randomUnsynced()/1000))).pos()
    if (settings.maxTier > 2) {
      wave = endWave + 6 + (settings.evolveInterval*(rng.randomUnsynced()/1000))
      waves.add(createSpawnGroup({ // non-guardian t4s
        type: picks[mainLines[index]][3],
        begin: wave,
        unitScaling: 1.5,
        unitAmount: 1,
        spacing: 3,
        spawn: spawnPick,
      }))
      wave += settings.evolveInterval + (settings.evolveInterval*(rng.randomUnsynced()/1000))
    }
    if (!enemyBase && Vars.spawner.spawns.size > 1) spawnPick = Vars.spawner.spawns.get(Math.floor(Vars.spawner.spawns.size*(rng.randomUnsynced()/1000))).pos()
    if (settings.maxTier > 3) {
      wave += 11 + (settings.evolveInterval*(rng.randomUnsynced()/1000))
      waves.add(createSpawnGroup({ // non-guardian t5s
        type: picks[mainLines[index]][4],
        begin: wave,
        unitScaling: 1.5,
        unitAmount: 1,
        spacing: 4,
        spawn: spawnPick,
      }))
      wave += settings.evolveInterval + (settings.evolveInterval*(rng.randomUnsynced()/1000))
    }
  }
  for (let i=0;i<mainLines.length;i++) {
    generateUnitLine(i, i * (settings.evolveInterval + (settings.evolveInterval*(rng.randomUnsynced()/1000))))
  }
  if (sector.threat > 0.25 && !enemyBase) {
    let spawnPick = -1
    if (settings.maxTier < 3) {
      if (!enemyBase && Vars.spawner.spawns.size > 1) spawnPick = Vars.spawner.spawns.get(Math.floor(Vars.spawner.spawns.size*(rng.randomUnsynced()/1000))).pos()
      waves.add(createSpawnGroup({
        type: picks[mainLines[0]][settings.maxTier+1],
        begin: Vars.state.rules.winWave-2,
        unitScaling: 1,
        unitAmount: 1,
        spacing: Math.max(Vars.state.rules.winWave/2,18),
        effect: StatusEffects.boss,
        spawn: spawnPick,
      }))
    } else {
      if (!enemyBase && Vars.spawner.spawns.size > 1) spawnPick = Vars.spawner.spawns.get(Math.floor(Vars.spawner.spawns.size*(rng.randomUnsynced()/1000))).pos()
      waves.add(createSpawnGroup({
        type: picks[mainLines[0]][settings.maxTier],
        begin: (Vars.state.rules.winWave/2)-2,
        unitScaling: 0.4,
        unitAmount: 1,
        spacing: Vars.state.rules.winWave,
        effect: StatusEffects.boss,
        spawn: spawnPick,
      }))
      if (!enemyBase && Vars.spawner.spawns.size > 1) spawnPick = Vars.spawner.spawns.get(Math.floor(Vars.spawner.spawns.size*(rng.randomUnsynced()/1000))).pos()
      if (settings.maxTier != 4) {
        waves.add(createSpawnGroup({
          type: picks[mainLines[0]][Math.min(settings.maxTier+1,4)],
          begin: Vars.state.rules.winWave-2,
          unitScaling: 0.7,
          unitAmount: 1,
          spacing: Vars.state.rules.winWave,
          effect: StatusEffects.boss,
          spawn: spawnPick,
        }))
      } else {
        let spawnOct = mainLines.includes(1)
        let offset = (mainLines[1] == 1)+1
        if (!enemyBase && Vars.spawner.spawns.size > 1) spawnPick = Vars.spawner.spawns.get(Math.floor(Vars.spawner.spawns.size*(rng.randomUnsynced()/1000))).pos()
        waves.add(createSpawnGroup({
          type: picks[mainLines[Math.min(offset,mainLines.length-1)]][settings.maxTier],
          begin: Vars.state.rules.winWave-2,
          unitScaling: 0.4/(1+spawnOct),
          unitAmount: 3-spawnOct,
          spacing: Vars.state.rules.winWave,
          effect: StatusEffects.boss,
          spawn: spawnPick,
        }))
        if (!enemyBase && Vars.spawner.spawns.size > 1) spawnPick = Vars.spawner.spawns.get(Math.floor(Vars.spawner.spawns.size*(rng.randomUnsynced()/1000))).pos()
        waves.add(createSpawnGroup({
          type: picks[mainLines[Math.min(1+offset,mainLines.length-1)]][settings.maxTier],
          begin: Vars.state.rules.winWave-2,
          unitScaling: 0.4,
          unitAmount: 2,
          spacing: Vars.state.rules.winWave,
          effect: StatusEffects.boss,
          spawn: spawnPick,
        }))
        if (spawnOct) {
          waves.add(createSpawnGroup({
            type: UnitTypes.oct,
            begin: Vars.state.rules.winWave-2,
            unitScaling: 0.6*Vars.spawner.countFlyerSpawns(),
            unitAmount: 1,
            spacing: Vars.state.rules.winWave,
            effect: StatusEffects.boss,
          }))
        }
      }
    }
  } else if (enemyBase) {
    let spacing = Math.min(Math.floor(50-(sector.threat*31)),30)
    let type = mainLines[0] == 1 && settings.maxTier >= 3 ? picks[mainLines[1]] : picks[mainLines[0]]
    waves.add(createSpawnGroup({
      type: type[Math.min(settings.maxTier+1,4)],
      begin: spacing-2,
      unitScaling: 1,
      unitAmount: 1,
      spacing: spacing,
      effect: StatusEffects.boss
    }))
    if (settings.maxTier == 4) {
      waves.add(createSpawnGroup({
        type: UnitTypes.oct,
        begin: spacing-2,
        unitScaling: 1,
        unitAmount: 1,
        spacing: spacing,
        effect: StatusEffects.boss
      }))
    }
  }
  return waves
}

// SERPULO GENERATOR
let basegen = new BaseGenerator()
Planets.serpulo.generator = extend(SerpuloPlanetGenerator, {
  basegen: basegen,
  /*generate(tiles,sec,seed) { // yeah this aint happening
    this.super.super$generate(tiles,sec,seed)
    const removeTit = [
      63,170,171,175,180,218,219, // g0 area
      222,146, // ff area
      71,188,189,193,241, // craters area
      141,162, // bsf area
      176, // misc
    ]
    const removeThor = [
      124,125,180,218, // g0 area
      71,131,241,127, // craters area
      162, // bsf area
    ]
    let tlen = tiles.width * tiles.height
    for (let i=0;i<tlen;i++) {
      let tile = tiles.geti(i)
      if (removeTit.includes(Vars.state.rules.sector.id) && tile.overlay() == Blocks.oreTitanium) {
        tile.clearOverlay()
      }
      if (removeThor.includes(Vars.state.rules.sector.id) && tile.overlay() == Blocks.oreThorium) {
        tile.clearOverlay()
      }
    }
  },*/
  postGenerate(tiles) {
    let tlen = tiles.width * tiles.height
    let waters = 0
    let total = 0
    for (let i=0;i<tlen;i++) {
      let tile = tiles.geti(i)
      if (tile.block() == Blocks.air) {
        total++
        if (tile.floor().liquidDrop == Liquids.water) waters++
      }
    }
    if (waters/total < 0.4) {
      Vars.state.rules.spawns = numberedWaves(Vars.state.rules.sector,Vars.state.rules.sector.hasEnemyBase(),false,false)
    } else {
      Vars.state.rules.spawns = numberedWaves(Vars.state.rules.sector,Vars.state.rules.sector.hasEnemyBase(),false,true)
    }
    if (Vars.state.rules.sector.hasEnemyBase()) {
      basegen.postGenerate()
      if (!Vars.spawner.countGroundSpawns()) {
        Vars.state.rules.spawns = numberedWaves(Vars.state.rules.sector,true,true,false)
      }
    }
    if (Vars.state.rules.sector.threat >= 0.5) Vars.state.rules.airUseSpawns = true
  }
})

// FORCE SECTOR DIFFICULY
function forceSectorDifficulty() {
  // low
  Planets.serpulo.sectors.get(45).threat = 0.1 // meme
  // medium
  Planets.serpulo.sectors.get(180).threat = 0.38
  Planets.serpulo.sectors.get(182).threat = 0.25
  // high
  Planets.serpulo.sectors.get(36).threat = 0.54
  Planets.serpulo.sectors.get(65).threat = 0.74
  Planets.serpulo.sectors.get(141).threat = 0.7499
  Planets.serpulo.sectors.get(156).threat = 0.54
  Planets.serpulo.sectors.get(162).threat = 0.7499
  Planets.serpulo.sectors.get(178).threat = 0.54
  Planets.serpulo.sectors.get(226).threat = 0.74
  // extreme
  Planets.serpulo.sectors.get(7).threat = 0.97
  Planets.serpulo.sectors.get(24).threat = 0.92
  Planets.serpulo.sectors.get(84).threat = 0.92
  Planets.serpulo.sectors.get(117).threat = 0.92
  Planets.serpulo.sectors.get(127).threat = 0.97
  Planets.serpulo.sectors.get(140).threat = 0.97
  Planets.serpulo.sectors.get(163).threat = 0.97
  Planets.serpulo.sectors.get(235).threat = 0.92
  Planets.serpulo.sectors.get(258).threat = 0.92
  // erad
  Planets.serpulo.sectors.get(5).threat = 1.1
  Planets.serpulo.sectors.get(57).threat = 1.1
  Planets.serpulo.sectors.get(61).threat = 1.2
  Planets.serpulo.sectors.get(199).threat = 1.1
  Planets.serpulo.sectors.get(225).threat = 1.1
  Planets.serpulo.sectors.get(228).threat = 1.1
  Planets.serpulo.sectors.get(229).threat = 1.2
  Planets.serpulo.sectors.get(255).threat = 1.2
  Planets.serpulo.sectors.get(262).threat = 1.2
}

// ON CLIENT LOAD
Events.on(ClientLoadEvent, e => {
  // LOCK NUMBERED SECTORS EARLY
  //if (!Items.titanium.unlocked()) Planets.serpulo.allowLaunchToNumbered = false
  
  // NUMBERED ENEMY BASES
  const convertToBase = [
    85,223, // its strictly personal
    95,178, // plt area
    79,140,263, // south pole
    66,128,232,235, // north pole
    41,45,156,179, // misc sectors
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
  forceSectorDifficulty()
  
  // RESEARCH
  // allow hail in craters
  TechTree.all.find(t => t.content == Blocks.hail).objectives.remove(2) // todo: find way to do this without hardcoded index
  TechTree.all.find(t => t.content == Blocks.hail).objectives.add(new Objectives.OnSector(SectorPresets.craters))
  // restrict early titanium
  let stainORwind = extend(Objectives.Objective,{
    complete() {
      return SectorPresets.stainedMountains.sector.hasBase() || SectorPresets.windsweptIslands.sector.hasBase()
    },
    display() {
      return Core.bundle.format("requirement.md3-stain-or-wind");
    }
  })
  TechTree.all.find(t => t.content == Blocks.lancer).objectives.add(stainORwind)
  TechTree.all.find(t => t.content == Blocks.parallax).objectives.add(stainORwind)
  TechTree.all.find(t => t.content == Blocks.salvo).objectives.add(stainORwind)
  TechTree.all.find(t => t.content == Vars.content.getByName(ContentType.block, "md3-tearer")).objectives.add(stainORwind)
  // restrict early thorium
  let tarORover = extend(Objectives.Objective,{
    complete() {
      return SectorPresets.tarFields.sector.hasBase() || SectorPresets.overgrowth.sector.hasBase()
    },
    display() {
      return Core.bundle.format("requirement.md3-tar-or-over");
    }
  })
  TechTree.all.find(t => t.content == Blocks.fuse).objectives.add(tarORover)
  TechTree.all.find(t => t.content == Blocks.tsunami).objectives.add(tarORover)
  TechTree.all.find(t => t.content == Blocks.meltdown).objectives.add(tarORover)
  TechTree.all.find(t => t.content == Blocks.surgeSmelter).objectives.add(tarORover)
  TechTree.all.find(t => t.content == Blocks.thoriumReactor).objectives.add(tarORover)
  // linearize post-thorium
  TechTree.all.find(t => t.content == SectorPresets.impact0078).objectives.add(new Objectives.Research(Blocks.spectre))
  TechTree.all.find(t => t.content == SectorPresets.impact0078).objectives.add(new Objectives.Research(Vars.content.getByName(ContentType.block, "md3-firenado")))
  TechTree.all.find(t => t.content == SectorPresets.impact0078).objectives.add(new Objectives.Research(Vars.content.getByName(ContentType.sector, "md3-reentry")))
})

// CAPTURE TOAST
Events.on(SectorCaptureEvent, e => {
  if (Core.settings.getBool("md3-forcecapturetoast", true) && e.sector.isBeingPlayed()) {
    Vars.ui.hudfrag.showToast(Core.bundle.format("sector.capture", ""))
  }
  if (!Vars.net.client() && Vars.state.isCampaign()) {
    Vars.state.getSector().planet.updateBaseCoverage()
    Time.runTask(7, () => forceSectorDifficulty())
  }
})

// GUARDIAN WARNINGS
const shittyalarm = Vars.tree.loadSound("weak-boss-warning")
const mediumalarm = Vars.tree.loadSound("medium-boss-warning")
const shittingyourselfalarm = Vars.tree.loadSound("strong-boss-warning")
function playAlarm(sound,loop,time) {
  for (let i=0;i<loop;i++) Time.run(time*i, () => sound.play(Core.settings.getInt("sfxvol")/100,1,0,false,true))
}
Events.on(WaveEvent, e => {
  if (Core.settings.getBool("md3-guardianwarn", true)) {
    let bosses = []
    let diff = 69420
    let health = 0
    let healthDiv = 70 // serpulo and mixtech default
    let alarmCubedHPDivs = [231798,11941690]
    switch (Vars.state.planet) {
      case Planets.erekir:
        healthDiv = 600
        alarmCubedHPDivs = [1000,8000]
        break
      // TODO: no data for fieros rn
      // mod compat, listed by order of addition to this list
      case Vars.content.getByName(ContentType.planet, "asthosus-asthosus"): // asthosus
        healthDiv = 170
        alarmCubedHPDivs = [62598,963397]
        break
      case Vars.content.getByName(ContentType.planet, "meld-ikaru"): // meld
        healthDiv = 60
        alarmCubedHPDivs = [27000,2744000]
        break
      case Vars.content.getByName(ContentType.planet, "moon-mod-Zilo"): // frozen farlands
        healthDiv = 120
        alarmCubedHPDivs = [72337,1953125]
        break
      // PLANNED MOD COMPAT: biotech (once thats done lmao)
      // if you're a mod dev and want compat with this, ping me on discord and i'll try to see what i can do
      // do note to atleast provide me a reference of what units can be considered what tier if your mod doesnt follow typical unit line conventions
      // alternatively make a PR if you dont want to bother me. healthDiv should be the lowest health value any unit that can show up as an enemy has
      // and the 2 alarmCubedHPDivs values should be the lowest health of any enemy-usable t4 unit on your planet
      // and lowest health of any enemy-usable t5 unit on your planet both divided by healthDiv, raised to the 3rd power, and rounded down
    }
    let winWave = Vars.state.rules.winWave > 0 ? Vars.state.rules.winWave-2 : Vars.state.wave+11
    let stop = false
    for (let i=Math.max(0,Vars.state.wave-2);i<=Math.min(Vars.state.wave+5,winWave);i++) {
      if (!stop) {
        let bruh = []
        for (let j=0;j<Vars.state.rules.spawns.size;j++) {
          bruh.push(Vars.state.rules.spawns.get(j))
        }
        for (let group of bruh) {
          if (group.effect == StatusEffects.boss && group.getSpawned(i) > 0) {
            diff = (i+2)-Vars.state.wave
            if (diff <= 5) {
              if (group.spawn > -0.5) {
                for (let j=0;j<group.getSpawned(i);j++) {
                  bosses.push(group.type.localizedName)
                }
                health += Math.pow(group.type.health/healthDiv,3)
              } else {
                health += Math.pow(group.type.health/healthDiv,3) * Vars.spawner.spawns.size
                for (let j=0;j<Vars.spawner.spawns.size*group.getSpawned(i);j++) {
                  bosses.push(group.type.localizedName)
                }
              }
              stop = true
            }
          }
        }
      }
    }
    if (diff <= 5) {
      bosses.sort()
      let format = ""
      let a = []
      let b = []
      for (let i=0;i<bosses.length;i++) {
        if (!a.includes(bosses[i])) {
          a.push(bosses[i])
          b.push(1)
        } else {
          b[b.length-1]++
        }
      }
      for (let i=0;i<a.length;i++) {
        if (i != 0) format += "\n"
        format += a[i]
        if (b[i] > 1) format += " " + b[i] + "x"
      }
      switch (diff) {
        case 5:
          if (health < alarmCubedHPDivs[0]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-weakguardianwarn5", format), 5)
            playAlarm(shittyalarm,3,60)
          } else if (health < alarmCubedHPDivs[1]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-mediumguardianwarn5", format), 5)
            playAlarm(mediumalarm,3,90)
          } else if (alarmCubedHPDivs[2] == null || health < alarmCubedHPDivs[2]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-strongguardianwarn5" + (bosses.length > 1 ? "b" : "a"), format), 5)
            playAlarm(shittingyourselfalarm,3,90)
          } else {
            Vars.ui.announce(Core.bundle.format("wave.md3-strongguardianwarn5" + (bosses.length > 1 ? "b" : "a"), format), 5)
            playAlarm(shittingyourselfalarm,3,90)
          }
          break
        case 1:
          if (health < alarmCubedHPDivs[0]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-weakguardianwarn1", format), 5)
            playAlarm(shittyalarm,3,60)
          } else if (health < alarmCubedHPDivs[1]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-mediumguardianwarn1", format), 5)
            playAlarm(mediumalarm,3,90)
          } else if (alarmCubedHPDivs[2] == null || health < alarmCubedHPDivs[2]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-strongguardianwarn1" + (bosses.length > 1 ? "b" : "a"), format), 5)
            playAlarm(shittingyourselfalarm,3,90)
          } else {
            Vars.ui.announce(Core.bundle.format("wave.md3-strongguardianwarn1" + (bosses.length > 1 ? "b" : "a"), format), 5)
            playAlarm(shittingyourselfalarm,3,90)
          }
          break
        case 0:
          if (health < alarmCubedHPDivs[0]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-weakguardianwarn0" + (bosses.length > 1 ? "b" : "a"), format), 5)
          } else if (health < alarmCubedHPDivs[1]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-mediumguardianwarn0", format), 5)
          } else if (alarmCubedHPDivs[2] == null || health < alarmCubedHPDivs[2]) {
            Vars.ui.announce(Core.bundle.format("wave.md3-strongguardianwarn0", format), 5)
          } else {
            Vars.ui.announce(Core.bundle.format("wave.md3-strongguardianwarn0", format), 5)
          }
          break
      }
    }
  }
})