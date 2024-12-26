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
// Ultimate Unification Copyright (C) 2023-2024 under MIT License by:              
//         - MundM2007          (https://github.com/MundM2007)

global.block_ids = []
onEvent('loaded', event => {
    let $ItemModelsProperties = java('net.minecraft.item.ItemModelsProperties')

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
        add_ore: (event, id_name, strata_name, material_type_extra, properties, harvest_tool, harvest_level, destroy_time, explosion_resistance, blockstate, model_path) => {
            let ore = event.create(`unification:${id_name}_ore_${strata_name}`)
                .material(material_type_extra)
                .translationKey('')
                .hardness(destroy_time)
                .resistance(explosion_resistance)
                .harvestTool(harvest_tool, harvest_level <= 0 ? 0 : harvest_level)
                .requiresTool(!harvest_level <= 0)
                .item(ctx => {
                    ctx.parentModel(model_path)
                })
                .blockstateJson = blockstate
            /*for (let i = 0; i < properties.length; i++) {
                ore.property(properties[i])
            }*/
            return `unification:${id_name}_ore_${strata_name}`
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