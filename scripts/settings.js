Events.on(ClientLoadEvent, () => {
  Vars.ui.settings.addCategory(Core.bundle.get("setting.md3-config-title"), Icon.turret, cons((t) => {
    t.checkPref("md3-autoupdate", true);
  }));
})