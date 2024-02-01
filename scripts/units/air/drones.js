const SpiritDrone = extend(UnitType, "spirit-drone", {});
SpiritDrone.constructor = () => extend(UnitEntity, {});
SpiritDrone.defaultController = () => extend(RepairAI, {});
