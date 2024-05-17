// priority: 90
if(Platform.isLoaded('mekanism')) {
    SLURRY['register(net.minecraftforge.eventbus.api.IEventBus)']($EventBuses.getModEventBus('kubejs').get())
}