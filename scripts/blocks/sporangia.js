const bulLib = require("md3/libs/bulletlib")
let sporangia = extend(PowerTurret, "panaeolus-subturret", {
  description: "Shoots Spores at enemies.",
  health: 100,
  size: 1,
  solid: false,
  destructible: true,
  update: true,
  rebuildable: false,
  destroySound: Sounds.plantBreak,
});
sporangia.buildType = () => extend(PowerTurret.PowerTurretBuild, sporangia, {
  update(){
    this.super$update();
    if (this.selfkaboomtimer == undefined) this.selfkaboomtimer = 360
    if (this.selfkaboomtimer > 0) {
      this.selfkaboomtimer--
    }
    if (this.selfkaboomtimer <= 0) {
      this.health = -69420
      this.damage(1)
      this.selfkaboomtimer = -1
    }
  }
});

module.exports = {
  sporangia: sporangia
};