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
// Ultimate Unification Copyright (C) 2023 under MIT License by:                   
//         - MundM2007          (https://github.com/MundM2007)

onEvent("loaded", event => {
    let $ItemModelProperties = java('net.minecraft.item.ItemModelsProperties')
    global.scripts = {
        add_block: (event, id_name, type_material, type_material_extra, texture_path) => {
            event.create(`unification:${id_name}_${type_material}`)
                .textureAll(texture_path)
                .material(type_material_extra)
                .translationKey("block.unification." + id_name + "_" + type_material)
                .hardness(5.0)
                .resistance(6.0)
                .harvestTool('pickaxe', 2)
                .requiresTool(true)
        },
        add_item: (event, id_name, type_material, texture_path) => {
            event.create(`unification:${id_name}_${type_material}`)
                .texture(texture_path)
                .translationKey("item.unification." + id_name + "_" + type_material)
        },
        add_coin: (event, id_name) => {
            event.create(`unification:${id_name}_coin`)
                .translationKey("item.unification." + id_name + "_coin")
        },
        add_molten: (event, id_name, color) => {
            event.create(`unification:${id_name}_molten`)
                .textureStill('unification:fluid/molten_still')
                .textureFlowing('unification:fluid/molten_flow')
                .color(color)
                .bucketColor(color)
                .translationKey("fluid.unification." + id_name + "_molten")
        },
        register_item_property: (item) => {
            if (!Platform.isClientEnvironment) return;

            $ItemModelProperties.func_239418_a_(Item.of(item), new ResourceLocation('count'), (stack, world, living) => {
                return stack.func_190916_E() / stack.func_77976_d()
            })
        }
    }
})