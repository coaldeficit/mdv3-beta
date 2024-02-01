const CannonT4 = extend(UnitType, "mortar-mech", {});
CannonT4.constructor = () => extend(LegsUnit, {});
CannonT4.immunities.add(StatusEffects.corroded);

Blocks.exponentialReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-ordnance-mech"),
  Vars.content.getByName(ContentType.unit, "md3-mortar-mech")
)