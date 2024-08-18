// priority: 110
if(Platform.isLoaded('mekanism')) {
    let $SlurryDeferredRegister = java('mekanism.common.registration.impl.SlurryDeferredRegister')
    global.SLURRY = new $SlurryDeferredRegister('unification')
}