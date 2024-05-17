// priority: 140

if(Platform.isLoaded('ftbic')) {
    if(disable_ftbic_recipe_gen){
        const FTBICConfig = java("dev.ftb.mods.ftbic.FTBICConfig")

        FTBICConfig.ADD_DUST_FROM_ORE_RECIPES = false
        FTBICConfig.ADD_DUST_FROM_MATERIAL_RECIPES = false
        FTBICConfig.ADD_GEM_FROM_ORE_RECIPES = false
        FTBICConfig.ADD_ROD_RECIPES = false
        FTBICConfig.ADD_PLATE_RECIPES = false
        FTBICConfig.ADD_GEAR_RECIPES = false
    }
}