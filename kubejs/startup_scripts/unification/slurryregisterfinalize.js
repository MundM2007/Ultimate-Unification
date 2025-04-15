// priority: 90
if(Platform.isLoaded('mekanism')) {
    let $EventBuses = java('me.shedaniel.architectury.platform.forge.EventBuses')
    global.SLURRY['register(net.minecraftforge.eventbus.api.IEventBus)']($EventBuses.getModEventBus('kubejs').get())
}