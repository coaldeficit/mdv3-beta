const ShotT4 = extend(UnitType, "mortar-mech", {});
ShotT4.constructor = () => extend(LegsUnit, {});
ShotT4.immunities.add(StatusEffects.corroded);

Blocks.exponentialReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-slugger-mech"),
  Vars.content.getByName(ContentType.unit, "md3-mortar-mech")
)