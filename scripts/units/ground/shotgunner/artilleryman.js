const ShotT2 = extend(UnitType, "artilleryman-mech", {});
ShotT2.constructor = () => extend(MechUnit, {});
ShotT2.immunities.add(StatusEffects.corroded);

Blocks.additiveReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-shotgunner-mech"),
  Vars.content.getByName(ContentType.unit, "md3-artilleryman-mech")
)