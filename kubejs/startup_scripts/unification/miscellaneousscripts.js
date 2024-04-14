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

onEvent('loaded', event => {
    let $ItemModelProperties = java('net.minecraft.item.ItemModelsProperties')
    global.scripts = {
        add_block: (event, id_name, material_type, material_type_extra, texture_path) => {
            event.create(`unification:${id_name}_${material_type}`)
                .textureAll(texture_path)
                .material(material_type_extra)
                .translationKey('')
                .hardness(5.0)
                .resistance(6.0)
                .harvestTool('pickaxe', 2)
                .requiresTool(true)
        },
        add_item: (event, id_name, material_type, texture_path) => {
            event.create(`unification:${id_name}_${material_type}`)
                .texture(texture_path)
                .translationKey('')
        },
        add_coin: (event, id_name) => {
            event.create(`unification:${id_name}_coin`)
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

            $ItemModelProperties.func_239418_a_(Item.of(item), new ResourceLocation('count'), (stack, world, living) => {
                return stack.func_190916_E() / stack.func_77976_d()
            })
        }
    }
})
