const SwarmerT4 = extend(UnitType, "messenger-ship", {});
SwarmerT4.constructor = () => extend(UnitEntity, {});

Blocks.exponentialReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-hornet-ship"),
  Vars.content.getByName(ContentType.unit, "md3-messenger-ship")
)