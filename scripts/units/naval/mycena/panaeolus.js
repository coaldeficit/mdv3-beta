const SporeT2 = extend(UnitType, "panaeolus-boat", {});
SporeT2.constructor = () => extend(UnitWaterMove, {});
SporeT2.immunities.add(StatusEffects.sporeSlowed);
SporeT2.immunities.add(StatusEffects.sapped);
let heal = extend(RegenAbility, {
  amount: 28/60,
  getBundle() {return 'ability.regen'},
})
SporeT2.abilities.add(heal);

Blocks.additiveReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-mycena-boat"),
  Vars.content.getByName(ContentType.unit, "md3-panaeolus-boat")
)