const SwarmerT2 = extend(UnitType, "bee-ship", {});
SwarmerT2.constructor = () => extend(UnitEntity, {});

Blocks.additiveReconstructor.addUpgrade(
  Vars.content.getByName(ContentType.unit, "md3-swarmer-ship"),
  Vars.content.getByName(ContentType.unit, "md3-bee-ship")
)