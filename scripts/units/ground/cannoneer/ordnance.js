const CannonT3 = extend(UnitType, "ordnance-mech", {});
CannonT3.constructor = () => extend(LegsUnit, {});
CannonT3.immunities.add(StatusEffects.corroded);

Blocks.multiplicativeReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-artilleryman-mech"),
  Vars.content.getByName(ContentType.unit, "md3-ordnance-mech")
)