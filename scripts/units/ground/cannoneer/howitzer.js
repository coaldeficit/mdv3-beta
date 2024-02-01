const CannonT5 = extend(UnitType, "howitzer-mech", {});
CannonT5.constructor = () => extend(LegsUnit, {});
CannonT5.immunities.add(StatusEffects.corroded);
CannonT5.immunities.add(StatusEffects.freezing);
CannonT5.immunities.add(StatusEffects.wet);

Blocks.tetrativeReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-mortar-mech"),
  Vars.content.getByName(ContentType.unit, "md3-howitzer-mech")
)