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
        add_item_tooltip: (event, id_item) => {
            event.addAdvanced(id_item, (item, advanced, text) => {
                if (event.shift) {
                    text.add(Text.gray('This Item is using a Texture from Emendatus Enigmatica'))
                }
            })
        },
        add_block: (event, id_name, type_material, texture_path, type_material_extra, display_name) => {
            event.create(`unification:${id_name}_${type_material}`)
                .textureAll(texture_path)
                .material(type_material_extra)
                .displayName(display_name)
                .hardness(5.0)
                .resistance(6.0)
                .harvestTool('pickaxe', 2)
                .requiresTool(true)
        },
        add_item: (event, id_name, type_material, texture_path, display_name) => {
            event.create(`unification:${id_name}_${type_material}`)
                .texture(texture_path)
                .displayName(display_name)
        },
        add_coin: (event, id_name, display_name) => {
            event.create(`unification:${id_name}_coin`)
                .displayName(display_name)
        },
        add_fluid: (event, id_name, color, display_name) => {
            event.create(`unification:molten_${id_name}`)
                .textureStill('unification:fluid/molten_still')
                .textureFlowing('unification:fluid/molten_flow')
                .color(color)
                .bucketColor(color)
                .displayName(display_name)
        },
        register_item_property: (item) => {
            if (!Platform.isClientEnvironment) return;

            $ItemModelProperties.func_239418_a_(Item.of(item), new ResourceLocation('count'), (stack, world, living) => {
                return stack.func_190916_E() / stack.func_77976_d()
            })
        }
    }
})