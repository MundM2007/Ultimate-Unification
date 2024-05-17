// priority: 110

if(Platform.isLoaded('mekanism')) {
    let $EventBuses = java('me.shedaniel.architectury.platform.forge.EventBuses')
    let $SlurryDeferredRegister = java('mekanism.common.registration.impl.SlurryDeferredRegister')
    let SLURRY = new $SlurryDeferredRegister('unification')
}