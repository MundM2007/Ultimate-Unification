// priority: 200

//          ██╗   ██╗██╗  ████████╗██╗███╗   ███╗ █████╗ ████████╗███████╗         
//          ██║   ██║██║  ╚══██╔══╝██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝         
//          ██║   ██║██║     ██║   ██║██╔████╔██║███████║   ██║   █████╗           
//          ██║   ██║██║     ██║   ██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝           
//          ╚██████╔╝███████╗██║   ██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗         
//           ╚═════╝ ╚══════╝╚═╝   ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝         
//                                                                                 
// ██╗   ██╗███╗   ██╗██╗███████╗██╗ ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
// ██║   ██║████╗  ██║██║██╔════╝██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║   ██║██╔██╗ ██║██║█████╗  ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
// ██║   ██║██║╚██╗██║██║██╔══╝  ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
// ╚██████╔╝██║ ╚████║██║██║     ██║╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
//  ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
// --------------------------------------------------------------------------------
// Ultimate Unification Copyright (C) 2023-2025 under MIT License by:              
//         - MundM2007          (https://github.com/MundM2007)

global.block_ids = []
onEvent('loaded', event => {
    const $ItemModelsProperties = java('net.minecraft.item.ItemModelsProperties')
    const $OverlayOreConfiguration = java('com.blackgear.platform.common.worldgen.feature.OverlayOreConfiguration')
    const $Placement = java('net.minecraft.world.gen.placement.Placement')
    const $TopSolidRangeConfig = java('net.minecraft.world.gen.placement.TopSolidRangeConfig')
    const $Registry = java('net.minecraft.util.registry.Registry')
    const $WorldGenRegistries = java('net.minecraft.util.registry.WorldGenRegistries')
    const $PlatformFeatures = java('com.blackgear.platform.common.registry.PlatformFeatures')
    const $GenerationStage = java('net.minecraft.world.gen.GenerationStage')
    const $RegistryKey = java('net.minecraft.util.RegistryKey')
    const $BiomeDictionary = java('net.minecraftforge.common.BiomeDictionary')

    global.scripts = {
        add_block: (event, id_name, material_type, material_type_extra, texture_path, harvest_level, destroy_time, explosion_resistance, burn_time) => {
            let block = event.create(`unification:${id_name}_${material_type}`)
                .textureAll(texture_path)
                .material(material_type_extra)
                .translationKey('')
                .hardness(destroy_time)
                .resistance(explosion_resistance)
                .harvestTool('pickaxe', harvest_level <= 0 ? 0 : harvest_level)
                .requiresTool(!harvest_level <= 0)
            if(burn_time > 0 && material_type == "storage_block") block.item(item => item.burnTime(burn_time * 10))
        },
        add_ore: (event, id_name, stratum_name, material_type_extra, properties, harvest_tool, harvest_level, destroy_time, explosion_resistance, blockstate, model_path) => {
            let ore = event.create(`unification:${id_name}_ore_${stratum_name}`)
                .material(material_type_extra)
                .translationKey('')
                .hardness(destroy_time)
                .resistance(explosion_resistance)
                .harvestTool(harvest_tool, harvest_level <= 0 ? 0 : harvest_level)
                .requiresTool(!(harvest_level < 0))
                .item(ctx => {
                    ctx.parentModel(model_path)
                })
                .blockstateJson = blockstate
            /*for (let i = 0; i < properties.length; i++) {
                ore.property(properties[i])
            }*/
            return `unification:${id_name}_ore_${stratum_name}`
        },
        add_item: (event, id_name, material_type, texture_path, burn_time) => {
            let item = event.create(`unification:${id_name}_${material_type}`)
                .texture(texture_path)
                .translationKey('')
            if(burn_time > 0){
                if(["ingot", "gem", "dust"].includes(material_type)) item.burnTime(burn_time)
                else if (material_type == "nugget") item.burnTime(Math.floor(burn_time / 10))
            }
        },
        add_coin: (event, id_name, model_path) => {
            event.create(`unification:${id_name}_coin`)
                .parentModel(model_path)
                .translationKey('')
        },
        add_molten: (event, id_name, color) => {
            event.create(`unification:${id_name}_molten`)
                .textureStill('unification:fluid/molten_still')
                .textureFlowing('unification:fluid/molten_flow')
                .color(color)
                .bucketColor(color)
                .translationKey('')
        },
        register_item_property: (item) => {
            if (!Platform.isClientEnvironment) return;

            $ItemModelsProperties.register(Item.of(item), new ResourceLocation('count'), (stack, world, living) => {
                return stack.getCount() / stack.getMaxStackSize()
            })
        },
        add_ore_gen: (event, feature_name, biomes, blacklist, targets, min_height, max_height, max_vein_size, cluster_count, chance, no_surface, squared) => {
            biome_types = $BiomeDictionary.getTypes($RegistryKey.create($Registry.BIOME_REGISTRY, event.getName()))
            let valid = blacklist
            for (let i = 0; i < biomes.length; i++) {
                if(biomes[i][0] == "#"){
                    if(biome_types.contains($BiomeDictionary.Type[biomes[i].substring(1).toUpperCase()])){
                        valid = !blacklist
                        break
                    }
                }else{
                    if(event.getName().toString() == biomes[i]){
                        valid = !blacklist
                        break
                    }
                }
            }
            if(!valid) return

            if(typeof min_height != "number") min_height = 0
            for (let i = 0; i < targets.length; i++){
                if(!Array.isArray(targets[i]) || targets[i].length != 2) continue
                targets[i] = $OverlayOreConfiguration.target(targets[i][0], targets[i][1])
            }
            let oreConfig = new $OverlayOreConfiguration(targets, typeof max_vein_size=="number" ? max_vein_size : 8, typeof no_surface=="number" ? no_surface : 0)
            let configuredPlacement = $Placement.RANGE.configured(new $TopSolidRangeConfig(min_height, min_height, typeof max_height=="number" ? max_height : 64))
            let platformOreFeature = $PlatformFeatures.OVERLAY_ORE.get().configured(oreConfig).decorated(configuredPlacement)
            if(squared || squared === undefined) platformOreFeature = platformOreFeature.squared()
            if(typeof cluster_count == "number") platformOreFeature = platformOreFeature.count(cluster_count)
            else if(typeof chance == "number") platformOreFeature = platformOreFeature.chance(chance)
            else platformOreFeature = platformOreFeature.count(8)
            let oreFeature = $Registry.register($WorldGenRegistries.CONFIGURED_FEATURE, feature_name, platformOreFeature)

            event.getGeneration().addFeature($GenerationStage.Decoration.UNDERGROUND_DECORATION, oreFeature)
        }
    }
})

onEvent('postinit', event => {
    if (!Platform.isClientEnvironment()) return;
    const $RenderTypeLookup = java('net.minecraft.client.renderer.RenderTypeLookup')
    const $RenderType = java('net.minecraft.client.renderer.RenderType')

    for (let i = 0; i < global.block_ids.length; i++) {
        $RenderTypeLookup['setRenderLayer(net.minecraft.block.Block,java.util.function.Predicate)'](Block.getBlock(global.block_ids[i]), renderType => {
            return (renderType == $RenderType.solid() || renderType == $RenderType.translucent())
        })
    }
})