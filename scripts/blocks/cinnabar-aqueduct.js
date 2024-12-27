const aqueduct = extend(Conduit, "cinnabar-aqueduct", {
  load(){
    this.super$load()
    this.iconRegion = Core.atlas.find(this.name + "-icon");
  },
  
  icons(){
    return [
      this.iconRegion
    ];
  }
});
/*coba.buildType = () => extend(GenericCrafter.GenericCrafterBuild, coba, {
  draw(){
    Draw.rect(coba.region, this.x, this.y);
    Draw.rect(coba.rotateRegion, this.x, this.y, this.totalProgress * 6);
    Draw.rect(coba.topRegion, this.x, this.y);
  }
});*/