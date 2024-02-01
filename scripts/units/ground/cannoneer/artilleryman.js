const CannonT2 = extend(UnitType, "artilleryman-mech", {});
CannonT2.constructor = () => extend(MechUnit, {});
CannonT2.immunities.add(StatusEffects.corroded);

Blocks.additiveReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-cannoneer-mech"),
  Vars.content.getByName(ContentType.unit, "md3-artilleryman-mech")
)