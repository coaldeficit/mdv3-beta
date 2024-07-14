const ShotT3 = extend(UnitType, "slugger-mech", {});
ShotT3.constructor = () => extend(LegsUnit, {});
ShotT3.immunities.add(StatusEffects.corroded);

Blocks.multiplicativeReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-pounder-mech"),
  Vars.content.getByName(ContentType.unit, "md3-slugger-mech")
)