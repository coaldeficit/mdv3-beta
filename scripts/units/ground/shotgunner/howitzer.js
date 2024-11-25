const ShotT5 = extend(UnitType, "howitzer-mech", {});
ShotT5.constructor = () => extend(LegsUnit, {});
ShotT5.immunities.add(StatusEffects.corroded);
ShotT5.immunities.add(StatusEffects.freezing);
ShotT5.immunities.add(StatusEffects.wet);

Blocks.tetrativeReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-rocketeer-mech"),
  Vars.content.getByName(ContentType.unit, "md3-howitzer-mech")
)