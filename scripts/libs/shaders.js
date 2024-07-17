let dmmShader
let dmmShaderCache
Events.on(ClientLoadEvent, e => {
  let environment = require("md3/blocks/environment")
  dmmShader = new Shaders.SurfaceShader(Vars.tree.get("shaders/screenspace.vert").readString(), Vars.tree.get("shaders/md3-dmm.frag").readString())
  dmmShaderCache = new CacheLayer.ShaderLayer(dmmShader)
  CacheLayer.add(0, dmmShaderCache);
  environment.dimethyl.cacheLayer = dmmShaderCache
})

module.exports = {
  dmmShader: dmmShader,
  dmmShaderCache: dmmShaderCache
};