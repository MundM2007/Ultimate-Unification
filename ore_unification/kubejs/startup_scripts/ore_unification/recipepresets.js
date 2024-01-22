// priority: 150

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

let countOut
let countIn
let nUni

function removeMod(item) {
    return item.slice(item.indexOf(":") + 1)
}
function checkTag(tag) {
    return !Ingredient.of(tag).itemIds.isEmpty()
}
function checkItems(items){
    if (!Array.isArray(items)) items = [items]
    let failed = false
    items.forEach(item => {
        if (!Item.exists(item)) {failed = true; return}
    })
    return !failed
}

onEvent("loaded", e => {
    global.rp = {
        appliedenergistics2: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.appliedenergistics2.grinder(event, dust, `#forge:ingots/${material}`, `unification:appliedenergistics2/grinder/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.appliedenergistics2.grinder(event, dust, `#forge:gems/${material}`, `unification:appliedenergistics2/grinder/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            ore_processing: (event, material, dust, gem_multiplyer) => {
                if (checkTag(`#forge:ores/${material}`) && checkItems(dust)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    global.mrt.appliedenergistics2.grinder(event, Item.of(dust, Math.round(2 * gem_multiplyer)), `#forge:ores/${material}`, 8, 
                        `unification:appliedenergistics2/grinder/ore_processing/${removeMod(dust)}/from_ore`)
                }
            },
        },
        astralsorcery: {
            ore_processing_gem: (event, material, gem, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    global.mrt.astralsorcery.infuser(event, Item.of(gem, Math.round(2 * gem_multiplyer)), `forge:ores/${material}`, 100,  0.1, [true], "astralsorcery:liquid_starlight",
                        `unification:astralsorcery/infuser/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_metal: (event, material, ingot) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                    if (checkTag(input) && checkItems(ingot)) {
                        global.mrt.astralsorcery.infuser(event, Item.of(ingot, nUni ? 2 * (i===2 ? 9 : 1) : 3 * (i===2 ? 9 : 1)), input, 100,  i===2 ? 0.7 : 0.1, [true], 
                            "astralsorcery:liquid_starlight", `unification:astralsorcery/infuser/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block"][i]}`)
                    }
                })
            },
        },
        betterendforge: {
            ore_processing_gem: (event, material, gem, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    global.mrt.betterendforge.alloying(event, Item.of(gem, Math.round(4 * gem_multiplyer)), [`forge:ores/${material}`, `forge:ores/${material}`], 200, 
                        `unification:betterendforge/alloying/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_metal: (event, material, ingot) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && checkItems(ingot)) {
                        let nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        global.mrt.betterendforge.alloying(event, Item.of(ingot, nUni ? 3 * (i===2 ? 9 : 1) : 4 * (i===2 ? 9 : 1)), [input, input], i===2 ? 18 : 2, i===2 ? 1800 : 200, 
                            `unification:betterendforge/alloying/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block"][i]}`)
                    }
                })
            },
        },
        bloodmagic: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.bloodmagic.arc(dust, `#forge:ingots/${material}`, "#bloodmagic:arc/explosive").consumeIngredient(false)
                            .id(`unification:bloodmagic/arc/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.bloodmagic.arc(dust, `#forge:gems/${material}`, "#bloodmagic:arc/explosive").consumeIngredient(false)
                            .id(`unification:bloodmagic/arc/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            ore_processing_metal: (event, material, dust, gravel, fragment) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        if(checkItems(dust)){
                            countOut = [[[1, 0.5], [2, 0]], [[1, 0.5], [2, 0]], [[13, 0.5], [18, 0]]][i][nUni ? 0 : 1]
                            event.recipes.bloodmagic.arc(
                                Item.of(dust, countOut[0]), input, "#bloodmagic:arc/cuttingfluid", 
                                countOut[1]!==0 ? [Item.of(dust).withChance(countOut[1])] : []).consumeIngredient(false)
                                .id(`unification:bloodmagic/arc/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                        
                        if(checkItems([gravel, fragment])){
                            countOut = [[2, 3], [2, 3], [18, 27]][i][nUni ? 0 : 1]
                            event.recipes.bloodmagic.arc(Item.of(fragment, countOut), input, "#bloodmagic:arc/explosive")
                                .consumeIngredient(false).id(`unification:bloodmagic/arc/ore_processing/${removeMod(fragment)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        if (checkItems(dust)) {
                            event.recipes.bloodmagic.alchemytable(Item.of(dust, nUni ? 3 : 2 * (i===2 ? 9 : 1)), ["#bloodmagic:arc/cuttingfluid", input, input].slice(0, nUni ? 3 : 2))
                                .syphon(i===2 ? 3600 : 400).ticks(200).upgradeLevel(1)
                                .id(`unification:bloodmagic/alchemytable/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    }
                })
                
                if(checkItems([gravel, fragment])){
                    event.recipes.bloodmagic.arc(gravel, fragment, "#bloodmagic:arc/resonator", [Item.of("bloodmagic:corrupted_tinydust").withChance(0.05),
                        Item.of("bloodmagic:corrupted_tinydust").withChance(0.01)]).consumeIngredient(false)
                        .id(`unification:bloodmagic/arc/ore_processing/${removeMod(gravel)}/from_fragment`)
                    event.recipes.bloodmagic.arc(dust, gravel, "#bloodmagic:arc/cuttingfluid").consumeIngredient(false)
                        .id(`unification:bloodmagic/arc/ore_processing/${removeMod(dust)}/from_gravel`)
                }
            },
        },
        boss_tools: {
            plate: (event, material, plate) => {
                if (checkItems(plate)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.shapeless(plate, [`#forge:ingots/${material}`, Item.of("boss_tools:hammer").ignoreNBT()])
                            .damageIngredient(Item.of("boss_tools:hammer").ignoreNBT(), 1)
                            .id(`unification:minecraft/shaped/component/${removeMod(plate)}/from_ingot/with_boss_tools_hammer`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.shapeless(plate, [`#forge:gems/${material}`, Item.of("boss_tools:hammer").ignoreNBT()])
                            .damageIngredient(Item.of("boss_tools:hammer").ignoreNBT(), 1)
                            .id(`unification:minecraft/shaped/component/${removeMod(plate)}/from_gem/with_boss_tools_hammer`)
                    }
                }
            },
        },
        boss_tools_giselle_addon: {
            coin: (event, material, coin) => {
                if (checkTag(`#forge:nuggets/${material}`) && checkItems(coin)) {
                    global.mrt.boss_tools_giselle_addon.rolling(event, coin, `3x #forge:nuggets/${material}`, 200, 
                        `unification:boss_tools_giselle_addon/rolling/component/${removeMod(coin)}/from_nuggets`)
                }
            },
            gear: (event, material, gear) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(gear)) {
                    global.mrt.boss_tools_giselle_addon.rolling(event, gear, `4x #forge:plates/${material}`, 200, 
                        `unification:boss_tools_giselle_addon/rolling/component/${removeMod(gear)}/from_plates`)
                }
            },
            plate: (event, material, plate) => {
                if (checkItems(plate)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.boss_tools_giselle_addon.rolling(event, plate, `#forge:ingots/${material}`, 200, 
                            `unification:boss_tools_giselle_addon/rolling/component/${removeMod(plate)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.boss_tools_giselle_addon.rolling(event, plate, `#forge:gems/${material}`, 200, 
                            `unification:boss_tools_giselle_addon/rolling/component/${removeMod(plate)}/from_gem`)
                    }
                }
            },
            rod: (event, material, rod) => {
                if (checkItems(rod)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.boss_tools_giselle_addon.extruding(event, Item.of(rod, 2), `#forge:ingots/${material}`, 200, 
                            `unification:boss_tools_giselle_addon/extruding/component/${removeMod(rod)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.boss_tools_giselle_addon.extruding(event, Item.of(rod, 2), `#forge:gems/${material}`, 200, 
                            `unification:boss_tools_giselle_addon/extruding/component/${removeMod(rod)}/from_gem`)
                    }
                }
            },
            wire: (event, material, wire) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(wire)) {
                    global.mrt.boss_tools_giselle_addon.extruding(event, Item.of(wire, 2), `#forge:plates/${material}`, 200, 
                        `unification:boss_tools_giselle_addon/extruding/component/${removeMod(wire)}/from_plate`)
                }
            },
        },
        create: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.createCrushing(dust, `#forge:ingots/${material}`).id(`unification:create/crushing/component/${removeMod(dust)}/from_ingot`)
                        event.recipes.createMilling(dust, `#forge:ingots/${material}`).id(`unification:create/milling/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.createCrushing(dust, `#forge:gems/${material}`).id(`unification:create/crushing/component/${removeMod(dust)}/from_gem`)
                        event.recipes.createMilling(dust, `#forge:gems/${material}`).id(`unification:create/milling/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            ore_processing_gem: (event, material, gem, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    event.recipes.createCrushing([Item.of(gem, Math.round(2 * gem_multiplyer)), Item.of(gem, Math.round(gem_multiplyer)).withChance(0.25)], `forge:ores/${material}`)
                        .id(`unification:create/crushing/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_metal: (event, material, ingot, nugget, crushed_ore) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && checkItems(crushed_ore)) {
                        
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        countOut = [[[1, 0.4], [2, 0]], [[1, 0.4], [2, 0]], [[12, 0.6], [18, 0]], [[0, 0.35], [0, 0.5]]][i][nUni ? 0 : 1]
                        event.recipes.createCrushing(
                            [Item.of(crushed_ore, countOut[0]), Item.of(crushed_ore).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, countOut[1]===0 ? 1 : 2)
                            .concat([Item.of("minecraft:cobblestone").withChance(0.125)]), input)
                            .id(`unification:create/crushing/ore_processing/${removeMod(crushed_ore)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)

                        countOut = [1, 1, 9, 0.25][i]
                        event.recipes.createMilling(Number.isInteger(countOut) ? Item.of(crushed_ore, countOut) : Item.of(crushed_ore).withChance(countOut), input)
                            .id(`unification:create/milling/ore_processing/${removeMod(crushed_ore)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
                
                if (checkTag(`#forge:crushed_ores/${material}`)) {
                    if(checkItems(ingot)){
                        event.smelting(ingot, `#forge:crushed_ores/${material}`).xp(0.1).id(`unification:minecraft/smelting/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                        event.blasting(ingot, `#forge:crushed_ores/${material}`).xp(0.1).id(`unification:minecraft/blasting/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                    }
                    if(checkItems(nugget)){
                        event.recipes.createSplashing([`10x ${nugget}`, Item.of(nugget, 5).withChance(0.5)], `#forge:crushed_ores/${material}`)
                            .id(`unification:create/milling/ore_processing/${removeMod(nugget)}/from_crushed_ore`)
                    }
                }
            },
            plate: (event, material, plate) => {
                if (checkItems(plate)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.createPressing(plate, `#forge:ingots/${material}`).id(`unification:create/pressing/component/${removeMod(plate)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.createPressing(plate, `#forge:gems/${material}`).id(`unification:create/pressing/component/${removeMod(plate)}/from_gem`)
                    }
                }
            },
        },
        createaddition: {
            rod: (event, material, rod) => {
                if (checkItems(rod)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.createaddition.rolling(event, Item.of(rod, 2), `#forge:ingots/${material}`, `unification:createaddition/rolling/component/${removeMod(rod)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.createaddition.rolling(event, Item.of(rod, 2), `#forge:gems/${material}`, `unification:createaddition/rolling/component/${removeMod(rod)}/from_gem`)
                    }
                }
            },
            wire: (event, material, wire) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(wire)) {
                    global.mrt.createaddition.rolling(event, Item.of(wire, 2), `#forge:plates/${material}`, `unification:createaddition/rolling/component/${removeMod(wire)}/from_plate`)
                }
            }
        },
        engineerstools: {
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && checkItems(dust)) {
                        if (!(input===`#forge:ores/${material}`) && ore_drops_fortune){
                            countOut = [3, 3, 27, 3][i]
                            event.shapeless(Item.of(dust, countOut), 
                                [Item.of("engineerstools:crushing_hammer").ignoreNBT(), input, input, input, input, input, input, input, input].slice(0, i===3 ? 9 : 3))
                                .damageIngredient(Item.of("engineerstools:crushing_hammer").ignoreNBT(), [10, 10, 90, 10][i])
                                .id(`unification:minecraft/shapeless/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}/with_engineerstools_crushing_hammer`)
                        } else {
                            countOut = [2, 2, 18, 1][i]
                            event.shapeless(Item.of(dust, countOut), [Item.of("engineerstools:crushing_hammer").ignoreNBT(), input, input].slice(0, i===3 ? 3 : 2))
                                .damageIngredient(Item.of("engineerstools:crushing_hammer").ignoreNBT(), [10, 10, 90, 5][i])
                                .id(`unification:minecraft/shapeless/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}/with_engineerstools_crushing_hammer`)
                        }
                    }
                })
            }
        },
        exnihilo: {
            pieces_to_raw: (event, material, raw) => {
                if(enable_raw_recipes){
                    if (checkTag(`#forge:pieces/${material}`) && checkItems(raw)) {
                        event.shaped(raw, ["PP", "PP"], {P: `#forge:pieces/${material}`}).id(`unification:minecraft/shaped/ore_processing/${removeMod(raw)}/from_pieces`)
                    }
                } else {
                    let ore = `kubejs:${material}_ore.minecraft.stone`
                    if (checkTag(`#forge:pieces/${material}`) && checkItems(ore)) {
                        event.shaped(ore, ["PP", "PP"], {P: `#forge:pieces/${material}`}).id(`unification:minecraft/shaped/ore_processing/${ore}/from_pieces`)
                    }
                }
            }
        },
        ftbic: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.ftbic.macerating(event, dust, `#forge:ingots/${material}`, `unification:ftbic/macerating/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.ftbic.macerating(event, dust, `#forge:gems/${material}`, `unification:ftbic/macerating/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            coin: (event, material, coin) => {
                if (checkTag(`#forge:nuggets/${material}`) && checkItems(coin)) {
                    global.mrt.ftbic.rolling(event, coin, `3x #forge:nuggets/${material}`, `unification:ftbic/rolling/component/${removeMod(coin)}/from_nuggets`)
                }
            },
            gear: (event, material, gear) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(gear)) {
                    global.mrt.ftbic.rolling(event, gear, `4x #forge:plates/${material}`, `unification:ftbic/rolling/component/${removeMod(gear)}/from_plates`)
                }
            },
            ore_processing_gem: (event, material, dust, gem_multiplyer) => {
                let input = `forge:ores/${material}`
                if (checkTag(input) && checkItems(dust)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    global.mrt.ftbic.macerating(event, [Item.of(dust, Math.round(2 * gem_multiplyer))], input, `unification:ftbic/macerating/ore_processing/${removeMod(dust)}/from_ore`)
                }
            },
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && checkItems(dust)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        countOut = [[[1, 0.4], [2, 0]], [[1, 0.4], [2, 0]], [[12, 0.6], [18, 0]], [[0, 0.35], [0, 0.5]]][i][nUni ? 0 : 1]
                        global.mrt.ftbic.macerating(event, [Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, countOut[1]===0 ? 1 : 2), input, 
                            `unification:ftbic/macerating/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
            },
            plate: (event, material, plate) => {
                if (checkItems(plate)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.ftbic.rolling(event, plate, `#forge:ingots/${material}`, `unification:ftbic/rolling/component/${removeMod(plate)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.ftbic.rolling(event, plate, `#forge:gems/${material}`, `unification:ftbic/rolling/component/${removeMod(plate)}/from_gem`)
                    }
                }
            },
            rod: (event, material, rod) => {
                if (checkItems(rod)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.ftbic.extruding(event, `2x ${rod}`, `#forge:ingots/${material}`, `unification:ftbic/extruding/component/${removeMod(rod)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.ftbic.extruding(event, `2x ${rod}`, `#forge:gems/${material}`, `unification:ftbic/extruding/component/${removeMod(rod)}/from_gem`)
                    }
                }
            },
            wire: (event, material, wire) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(wire)) {
                    global.mrt.ftbic.extruding(event, `2x ${wire}`, `#forge:plates/${material}`, `unification:ftbic/extruding/component/${removeMod(wire)}/from_plate`)
                }
            }
        },
        industrialforegoing: {
            ore: (event, ore, catalyst, weight, max_depth) => {
                global.mrt.industrialforegoing.laser_drill(event, ore, catalyst, [[[], [0, max_depth], weight]], false, "", `unification:industrialforegoing/laser_drill/component/${removeMod(ore)}`)
            },
        },
        immersiveengineering: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.immersiveengineeringCrusher(dust, `#forge:ingots/${material}`).id(`unification:immersiveengineering/crusher/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.immersiveengineeringCrusher(dust, `#forge:gems/${material}`).id(`unification:immersiveengineering/crusher/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            gear: (event, material, gear) => {
                if (checkItems(gear)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.immersiveengineeringMetalPress(gear, `4x #forge:ingots/${material}`, "immersiveengineering:mold_gear")
                            .id(`unification:immersiveengineering/metal_press/component/${removeMod(gear)}/from_ingots`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.immersiveengineeringMetalPress(gear, `4x #forge:gems/${material}`, "immersiveengineering:mold_gear")
                            .id(`unification:immersiveengineering/metal_press/component/${removeMod(gear)}/from_gems`)
                    }
                }
            },
            ore_processing_gem: (event, material, gem, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    event.recipes.immersiveengineeringCrusher([Item.of(gem, Math.round(2 * gem_multiplyer)), Item.of(gem, Math.round(gem_multiplyer)).withChance(0.25)], 
                        `forge:ores/${material}`).id(`unification:immersiveengineering/crusher/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_metal: (event, material, ingot, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune

                        if(checkItems(dust)){
                            event.shapeless(Item.of(dust, [1, 1, 9, 1][i]), [Item.of("immersiveengineering:hammer").ignoreNBT(), input, input, input, input].slice(0, i===3 ? 5 : 2))
                                .damageIngredient(Item.of("immersiveengineering:hammer").ignoreNBT(), [1, 1, 9, 1][i])
                                .id(`unification:minecraft/shapeless/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}/with_immersiveengineering_hammer`)
                            
                            if(i == 3) return

                            countOut = [[[1, 0.5], [2, 0]], [[1, 0.5], [2, 0]], [[13, 0.5], [18, 0]]][i][nUni ? 0 : 1]
                            event.recipes.immersiveengineeringCrusher(Item.of(dust, countOut[0]), input, countOut[1]!=0 ? [Item.of(dust).withChance(countOut[1])] : [])
                                .id(`unification:immersiveengineering/crusher/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        if(i == 3) return

                        if(checkItems(ingot)){
                            countOut = [[2, 3], [2, 3], [18, 27]][i][nUni ? 0 : 1]
                            event.recipes.immersiveengineeringArcFurnace(Item.of(ingot, countOut), input)
                                .id(`unification:immersiveengineering/arc_furnace/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    }
                })
            },
            plate: (event, material, plate)=> {
                if (checkItems(plate)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.shapeless(plate, [`#forge:ingots/${material}`, Item.of("immersiveengineering:hammer").ignoreNBT()])
                            .damageIngredient(Item.of("immersiveengineering:hammer").ignoreNBT(), 1)
                            .id(`unification:minecraft/shaped/component/${removeMod(plate)}/from_ingot/with_immersiveengineering_hammer`)
                        event.recipes.immersiveengineeringMetalPress(plate, `#forge:ingots/${material}`, "immersiveengineering:mold_plate")
                            .id(`unification:immersiveengineering/metal_press/component/${removeMod(plate)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.shapeless(plate, [`#forge:gems/${material}`, Item.of("immersiveengineering:hammer").ignoreNBT()])
                            .damageIngredient(Item.of("immersiveengineering:hammer").ignoreNBT(), 1)
                            .id(`unification:minecraft/shaped/component/${removeMod(plate)}/from_gem/with_immersiveengineering_hammer`)
                        event.recipes.immersiveengineeringMetalPress(plate, `#forge:gems/${material}`, "immersiveengineering:mold_plate")
                            .id(`unification:im mersiveengineering/metal_press/component/${removeMod(plate)}/from_gem`)
                    }
                }
            },
            rod: (event, material, rod) => {
                if (checkItems(rod)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.immersiveengineeringMetalPress(`2x ${rod}`, `#forge:ingots/${material}`, "immersiveengineering:mold_rod")
                            .id(`unification:immersiveengineering/metal_press/component/${removeMod(rod)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.immersiveengineeringMetalPress(`2x ${rod}`, `#forge:gems/${material}`, "immersiveengineering:mold_rod")
                            .id(`unification:immersiveengineering/metal_press/component/${removeMod(rod)}/from_gem`)
                    }
                }
            },
            wire: (event, material, wire) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(wire)) {
                    event.shapeless(Item.of(wire, 2), [`#forge:plates/${material}`, Item.of("immersiveengineering:wirecutter").ignoreNBT()])
                        .damageIngredient(Item.of("immersiveengineering:wirecutter").ignoreNBT(), 1)
                        .id(`unification:minecraft/shapeless/component/${removeMod(wire)}/from_plate/with_immersiveengineering_wirecutter`)
                }
                if (checkItems(wire)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.immersiveengineeringMetalPress(`2x ${wire}`, `#forge:ingots/${material}`, "immersiveengineering:mold_wire")
                            .id(`unification:immersiveengineering/metal_press/component/${removeMod(wire)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.immersiveengineeringMetalPress(`2x ${wire}`, `#forge:gems/${material}`, "immersiveengineering:mold_wire")
                            .id(`unification:immersiveengineering/metal_press/component/${removeMod(wire)}/from_gem`)
                    }
                }
            }
        },
        integrateddynamics: {
            ore_processing_gem: (event, material, dust, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(dust)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    global.mrt.integrateddynamics.squeezer(event, [Item.of(dust, Math.round(gem_multiplyer)), Item.of(dust, Math.round(gem_multiplyer)).withChance(0.5)], "", 
                        `forge:ores/${material}`, `unification:integrateddynamics/squeezer/ore_processing/${removeMod(dust)}/from_ore`)
                    global.mrt.integrateddynamics.mechanical_squeezer(event, [Item.of(dust, Math.round(2 * gem_multiplyer))], "", `forge:ores/${material}`, 40
                        `unification:integrateddynamics/mechanical_squeezer/ore_processing/${removeMod(dust)}/from_ore`)
                }
            },
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && checkItems(dust)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        if (nUni) {
                            countOut = [[1, 0.5], [1, 0.5], [13, 0.5], [0, 0.375]][i]
                            global.mrt.integrateddynamics.squeezer(event, [Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), "", input,
                                `unification:integrateddynamics/squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)

                            countOut = [2, 2, 18, 0.5][i]  
                            global.mrt.integrateddynamics.mechanical_squeezer(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut)], "", input, 40,
                                `unification:integrateddynamics/mechanical_squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        } else {
                            countOut = [2, 2, 18, 0.5][i]
                            global.mrt.integrateddynamics.squeezer(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut)], "", input,
                                `unification:integrateddynamics/squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            
                            countOut = [3, 3, 27, 2][i]
                            global.mrt.integrateddynamics.mechanical_squeezer(event, Item.of(dust, countOut), "", Ingredient.of(input, i===3 ? 3 : 1), 40,
                                `unification:integrateddynamics/mechanical_squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    }
                })
            }
        },
        mekanism: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.mekanism.crushing(event, dust, `#forge:ingots/${material}`, `unification:mekanism/crushing/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.mekanism.crushing(event, dust, `#forge:gems/${material}`, `unification:mekanism/crushing/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            ore: (event, material, stratas) => {
                if (checkTag(`#forge:raw_materials/${material}`)) {
                    stratas.forEach(strata => {
                        let ore = `osv:custom_${material}_ore`
                        if (!(strata === "minecraft:stone")) {
                            if (strata.startsWith("minecraft:")){
                                ore += removeMod(strata)
                            } else {
                                ore += strata.replace(":", "_")
                            }
                        }
                        global.mrt.mekanism.combining(event, ore, [`8x #forge:raw_materials/${material}`, strata], `unification:mekanism/combining/component/${removeMod(ore)}/from_${strata}`)
                    })
                }
            },
            ore_processing_gem: (event, material, gem, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    global.mrt.mekanism.enriching(event, Item.of(gem, Math.round(2 * gem_multiplyer)), `forge:ores/${material}`, 
                        `unification:mekanism/enriching/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_metal: (event, material, dust, dirty_dust, clump, shard, crystal, clean_slurry, dirty_slurry) => {
                let names = [dirty_dust, clump, shard, crystal, clean_slurry, dirty_slurry];
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        if(checkItems(dust)){
                            countIn = [[3, 1], [3, 1], [1, 1], [3, 2]][i][nUni ? 0 : 1]
                            countOut = [[4, 2], [4, 2], [12, 18], [1, 1]][i][nUni ? 0 : 1]
                            global.mrt.mekanism.enriching(event, Item.of(dust, countOut), Ingredient.of(input, countIn), 
                                `unification:mekanism/enriching/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        if(checkItems([dust].concat(names.slice(0, 2)))){
                            countIn = [[1, 1], [1, 1], [1, 1], [2, 4]][i][nUni ? 0 : 1]
                            countOut = [[2, 3], [2, 3], [18, 27], [1, 3]][i][nUni ? 0 : 1]
                            global.mrt.mekanism.purifying(event, Item.of(clump, countOut), Ingredient.of(input, countIn), ['mekanism:oxygen', [200, 200, 1800, nUni ? 100 : 200][i]], 
                                `unification:mekanism/purifying/ore_processing/${removeMod(clump)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        if(checkItems([dust].concat(names.slice(0, 3)))){
                            countIn = [[3, 1], [3, 1], [1, 1], [3, 1]][i][nUni ? 0 : 1]
                            countOut = [[8, 4], [8, 4], [24, 36], [2, 1]][i][nUni ? 0 : 1]
                            global.mrt.mekanism.injecting(event, Item.of(shard, countOut), Ingredient.of(input, countIn), ['mekanism:hydrogen_chloride', [200, 200, nUni ? 600 : 1800, 50][i]], 
                                `unification:mekanism/injecting/ore_processing/${removeMod(shard)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        countIn = [[3, 1], [3, 1], [1, 1], [3, 1]][i][nUni ? 0 : 1]
                        countOut = [[2000, 1000], [2000, 1000], [6000, 9000], [500, 250]][i][nUni ? 0 : 1]
                        global.mrt.mekanism.dissolution(event, [dirty_slurry, countOut], Ingredient.of(input, countIn), ['mekanism:sulfuric_acid', [100, 100, nUni ? 300 : 900, 25][i]],
                            `unification:mekanism/dissolution/ore_processing/${removeMod(dirty_slurry)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
                
                if(checkTag(`#forge:dirty_dusts/${material}`) && checkItems(dust)){
                        global.mrt.mekanism.enriching(event, dust, `#forge:dirty_dusts/${material}`, `unification:mekanism/enriching/ore_processing/${removeMod(dust)}/from_dirty_dust`)
                }

                if(checkTag(`#forge:clumps/${material}`) && checkItems([dust].concat(names.slice(0, 1)))){
                    global.mrt.mekanism.crushing(event, dirty_dust, `#forge:clumps/${material}`, `unification:mekanism/crushing/ore_processing/${removeMod(dirty_dust)}/from_clump`)
                }
                if(checkTag(`#forge:clumps/${material}`) && checkItems([dust].concat(names.slice(0, 2)))){
                    global.mrt.mekanism.purifying(event, clump, `#forge:shards/${material}`, 'mekanism:oxygen', `unification:mekanism/purifying/ore_processing/${removeMod(clump)}/from_shard`)
                }
                if(checkTag(`#forge:clumps/${material}`) && checkItems([dust].concat(names.slice(0, 3)))){
                    global.mrt.mekanism.injecting(event, shard, `#forge:crystals/${material}`, 'mekanism:hydrogen_chloride',
                        `unification:mekanism/injecting/ore_processing/${removeMod(shard)}/from_crystal`)
                }
                global.mrt.mekanism.crystallizing(event, crystal, [clean_slurry, 200], `unification:mekanism/crystallizing/ore_processing/${removeMod(crystal)}/from_clean_slurry`)
                global.mrt.mekanism.washing(event, clean_slurry, ["#minecraft:water", 5], dirty_slurry, `unification:mekanism/washing/ore_processing/${removeMod(clean_slurry)}/from_dirty_slurry`)
            }
        },
        occultism: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.mekanism.crushing(event, dust, `#forge:ingots/${material}`, `unification:mekanism/crushing/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.mekanism.crushing(event, dust, `#forge:gems/${material}`, `unification:mekanism/crushing/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            ore: (event, ore, weight) => {
                global.mrt.occultism.miner(event, ore, weight, true, `unification:occultism/miner/${removeMod(ore)}`)
            },
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && checkItems(dust)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        countOut = [[2, 3], [2, 3], [18, 27], [0.5, 0.75]][i][nUni ? 0 : 1]
                        global.mrt.occultism.crushing(event, Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut), input, 
                            `unification:occultism/crushing/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
            }
        },
        potionsmaster: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.shapeless(dust, ["potionsmaster:pestle", `#forge:ingots/${material}`, "potionsmaster:tile_mortar"])
                            .id(`unification:minecraft/shapeless/component/${removeMod(dust)}/from_ingot/with_potionsmaster_pestle_and_mortar`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.shapeless(dust, ["potionsmaster:pestle", `#forge:gems/${material}`, "potionsmaster:tile_mortar"])
                            .id(`unification:minecraft/shapeless/component/${removeMod(dust)}/from_gem/with_potionsmaster_pestle_and_mortar`)
                    }
                }
            }
        },
        silents_mechanisms: {
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        global.mrt.silents_mechanisms.crushing(event, dust, `#forge:ingots/${material}`, 200, `unification:silents_mechanisms/crushing/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        global.mrt.silents_mechanisms.crushing(event, dust, `#forge:gems/${material}`, 200, `unification:silents_mechanisms/crushing/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            ore_processing_gem: (event, material, gem, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    global.mrt.silents_mechanisms.crushing(event, [Item.of(gem, Math.round(2 * gem_multiplyer)), Item.of("minecraft:cobblestone").withChance(0.1)], `forge:ores/${material}`, 200, 
                        `unification:silents_mechanisms/crushing/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && checkItems(dust)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        if (nUni){
                            countOut = [[1, 0.4], [1, 0.4], [12, 0.6], [0, 0.35]][i]
                            global.mrt.silents_mechanisms.crushing(event, [Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), input, 200, 
                                `unification:silents_mechanisms/crushing/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        } else {
                            countOut = [2, 2, 9, 0.5][i]
                            global.mrt.silents_mechanisms.crushing(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut), 
                                Item.of("minecraft:cobblestone").withChance(0.1)].slice(0, i === 0 ? 2 : 1), 
                                input, 200, `unification:silents_mechanisms/crushing/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    }
                })
            }
        },
        tconstruct: {
            ore_processing_gem: (event, material, molten, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && !Fluid.of(molten).equals(Fluid.empty)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    global.mrt.tconstruct.ore_melting(event, Fluid.of(molten, Math.round(144 * gem_multiplyer)), Fluid.of(molten, Math.round(48 * gem_multiplyer)), 
                        `forge:ores/${material}`, 800, 100, `unification:tconstruct/melting/ore_processing/${removeMod(molten)}/from_ore`)
                }
            },
            // names: ingot, dust
            ore_processing_metal: (event, material, molten) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && !Fluid.of(molten).equals(Fluid.empty)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        countOut = [[[108, 36], [144, 48]], [[108, 36], [144, 48]], [[972, 324], [1296, 432]], [[27, 9], [36, 12]]][i][nUni ? 0 : 1]
                        global.mrt.tconstruct.ore_melting(event, Fluid.of(molten, countOut[0]), Fluid.of(molten, countOut[1]), input, 800, 100, 
                            `unification:tconstruct/melting/ore_processing/${removeMod(molten)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
            },
            smelting: (event, material, molten) => {
                let inputs = [
                    `#forge:storage_blocks/${material}`,`#forge:ingots/${material}`, `#forge:nuggets/${material}`, `#forge:gems/${material}`, `#forge:dusts/${material}`, 
                    `#forge:plates/${material}`, `#forge:gears/${material}`, `#forge:rods/${material}`, `#forge:wires/${material}`, `#forge:coins/${material}`
                ]
                let amounts = [1296, 144, 16, 144, 144, 144, 576, 72, 72, 48]
                let times = [180, 60, 20, 80, 60, 60, 120, 43, 43, 35]
                let ids = ["block", "ingot", "nugget", "gem", "dust", "plate", "gear", "rod", "wire", "coin"]
                if(!Fluid.of(molten).equals(Fluid.empty)){
                    inputs.forEach((input, i) => {
                        if (checkTag(input)) {
                            global.mrt.tconstruct.melting(event, Fluid.of(molten, amounts[i]), input, 800, times[i], 
                                `unification:tconstruct/melting/component/${removeMod(molten)}/from_${ids[i]}`)
                        }
                    })
                }
            },
            casting: (event, molten, storage_block, ingot, nugget, gem, plate, gear, rod, wire, coin) => {
                let casts = ["", "ingot", "nugget", "gem", "plate", "gear", "rod", "wire", "coin"]
                let amounts = [1296, 144, 16, 144, 144, 576, 72, 72, 48]
                let times = [180, 60, 20, 80, 60, 120, 43, 43, 35]
                if(!Fluid.of(molten).equals(Fluid.empty)){
                    [storage_block, ingot, nugget, gem, plate, gear, rod, wire, coin].forEach((output, i) => {
                        if (checkItems(output)) {
                            if (i === 0) {
                                global.mrt.tconstruct.casting(event, output, [molten, amounts[0]], "", true, false, times[0], 
                                    `unification:tconstruct/casting/component/${removeMod(output)}/from_molten`)
                            } else {
                                global.mrt.tconstruct.casting(event, output, [molten, amounts[i]], `#tconstruct:casts/multi_use/${casts[i]}`, true, false, times[i], 
                                    `unification:tconstruct/casting/component/${removeMod(output)}/from_molten/multi_use`)
                                global.mrt.tconstruct.casting(event, output, [molten, amounts[i]], `#tconstruct:casts/single_use/${casts[i]}`, true, true, times[i], 
                                    `unification:tconstruct/casting/component/${removeMod(output)}/from_molten/single_use`)
                            }
                        }
                    })
                }
            }
        },
        thermal: {
            coin: (event, material, coin) => {
                if (checkTag(`#forge:nuggets/${material}`) && checkItems(coin)) {
                    event.recipes.thermal.press(coin, [`3x #forge:nuggets/${material}`, "thermal:press_coin_die"])
                        .id(`unification:thermal/press/component/${removeMod(coin)}/from_nuggets`).energy(2400)
                }
                if (checkItems(coin)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.thermal.press(`3x ${coin}`, [`#forge:ingots/${material}`, "thermal:press_coin_die"])
                            .id(`unification:thermal/press/component/${removeMod(coin)}/from_ingot`).energy(2400)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.thermal.press(`3x ${coin}`, [`#forge:gems/${material}`, "thermal:press_coin_die"])
                            .id(`unification:thermal/press/component/${removeMod(coin)}/from_gem`).energy(2400)
                    }
                }
            },
            coin_to_energy: (event, material, energy_amount) => {
                if (checkTag(`#forge:coins/${material}`)) {
                    event.recipes.thermal.numismatic_fuel(`#forge:coins/${material}`).energy(energy_amount)
                }
            },
            dust: (event, material, dust) => {
                if (checkItems(dust)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.thermal.pulverizer(dust, `#forge:ingots/${material}`).id(`unification:thermal/pulverizer/component/${removeMod(dust)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.thermal.pulverizer(dust, `#forge:gems/${material}`).id(`unification:thermal/pulverizer/component/${removeMod(dust)}/from_gem`)
                    }
                }
            },
            gear: (event, material, gear) => {
                if (checkItems(gear)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.thermal.press(gear, [`4x #forge:ingots/${material}`, "thermal:press_gear_die"])
                            .id(`unification:thermal/press/component/${removeMod(gear)}/from_ingots`).energy(2400)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.thermal.press(gear, [`4x #forge:gems/${material}`, "thermal:press_gear_die"])
                            .id(`unification:thermal/press/component/${removeMod(gear)}/from_gems`).energy(2400)
                    }
                }
            },
            ingot_in_chiller: (event, molten, ingot) => {
                if(!Fluid.of(molten).equals(Fluid.empty) && checkItems(ingot)){
                    event.recipes.thermal.chiller(ingot, [Fluid.of(molten, 144), 'thermal:chiller_ingot_cast']).id(`unification:thermal/chiller/component/${removeMod(ingot)}/from_molten`)
                }
            },
            ingot_in_smelter: (event, material, ingot) => {
                if(checkTag(`#forge:dusts/${material}`) && checkItems(ingot)){
                    event.recipes.thermal.smelter(ingot, [`#forge:dusts/${material}`]).id(`unification:thermal/smelter/component/${removeMod(ingot)}/from_dust`)
                }
            },
            ore_processing_gem: (event, material, gem, gem_multiplyer) => {
                input = `forge:ores/${material}`
                if (checkTag(input) && checkItems(gem)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    event.recipes.thermal.pulverizer([Item.of(gem, Math.round(2 * gem_multiplyer)), Item.of("minecraft:gravel").withChance(0.2)], input).energy(4000)
                        .id(`unification:thermal/pulverizer/ore_processing/${removeMod(gem)}/from_ore`)
                    event.recipes.thermal.smelter([Item.of(gem, Math.round(gem_multiplyer)), Item.of(gem, Math.round(gem_multiplyer)).withChance(0.5), 
                        Item.of("thermal:rich_slag").withChance(0.15)], input).energy(3200).id(`unification:thermal/smelter/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            // names: ingot, dust
            ore_processing_metal: (event, material, ingot, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input)) {
                        nUni = !(input===`#forge:ores/${material}`) && ore_drops_fortune
                        if (nUni) {
                            if(checkItems(ingot)){
                                countOut = [1.300001 , 1.300001, 11.700001, 0.325][i]
                                event.recipes.thermal.smelter(Item.of(ingot).withChance(countOut), input).energy(3200)
                                    .id(`unification:thermal/smelter/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }

                            if(checkItems(dust)){
                                countOut = [1.500001, 1.500001, 13.500001, 0.375][i]
                                event.recipes.thermal.pulverizer(Item.of(dust).withChance(countOut), input).energy(4000)
                                    .id(`unification:thermal/pulverizer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
                        } else {
                            if (input===`#forge:ores/${material}`) {
                                if(checkItems(ingot)){
                                    event.recipes.thermal.smelter([`2x ${ingot}`, Item.of('thermal:rich_slag').withChance(0.2)], input).energy(3200)
                                        .id(`unification:thermal/smelter/ore_processing/${removeMod(ingot)}/from_ore`)
                                }
                                if(checkItems(dust)){
                                    event.recipes.thermal.pulverizer([`2x ${dust}`, Item.of('minecraft:gravel').withChance(0.2)], input).energy(4000)
                                        .id(`unification:thermal/pulverizer/ore_processing/${removeMod(dust)}/from_ore`)
                                }
                            } else {
                                countOut = [, 2, 18, 0.5][i]
                                if(checkItems(ingot)){
                                    event.recipes.thermal.smelter([Number.isInteger(countOut) ? Item.of(ingot, countOut) : Item.of(ingot).withChance(countOut)], input).energy(3200)
                                        .id(`unification:thermal/smelter/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                                }
                                if(checkItems(dust)){
                                    event.recipes.thermal.pulverizer([Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut)], input).energy(4000)
                                        .id(`unification:thermal/pulverizer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                                }
                            }
                        }
                    }
                })
            },
            plate: (event, material, plate) => {
                if (checkItems(plate)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.recipes.thermal.press(plate, `#forge:ingots/${material}`).id(`unification:thermal/press/component/${removeMod(plate)}/from_ingot`).energy(2400)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.recipes.thermal.press(plate, `#gems:ingots/${material}`).id(`unification:thermal/press/component/${removeMod(plate)}/from_gem`).energy(2400)
                    }
                }
            },
            rod: (event, molten, rod) => {
                if(!Fluid.of(molten).equals(Fluid.empty) && checkItems(rod)){
                    event.recipes.thermal.chiller(rod, [Fluid.of(molten, 72), 'thermal:chiller_rod_cast']).id(`unification:thermal/chiller/component/${removeMod(rod)}/from_molten`)
                }
            },
            storage_convert_gem: (event, material, gem, block) => {
                if(checkItems(block) && checkItems(gem)){
                    let gemTag = `#forge:gems/${material}`
                    let blockTag = `#forge:storage_blocks/${material}`
                    if (checkTag(gemTag) && checkTag(blockTag)) {
                        event.recipes.thermal.press(`9x ${gem}`, [blockTag, "thermal:press_unpacking_die"])
                            .id(`unification:thermal/press_unpacking/storage/${removeMod(gem)}/from_block`)
                        event.recipes.thermal.press(block, [`9x ${gemTag}`, "thermal:press_packing_3x3_die"])
                            .id(`unification:thermal/press_packing_3x3/storage/${removeMod(block)}/from_gems`)
                    }
                }
            },
            storage_convert_metal: (event, material, ingot, block, nugget) => {
                if(checkItems(ingot)){
                    let ingotTag = `#forge:ingots/${material}`
                    let blockTag = `#forge:storage_blocks/${material}`
                    let nuggetTag = `#forge:nuggets/${material}`
                    if (checkItems(block) && checkTag(ingotTag) && checkTag(blockTag)) {
                        event.recipes.thermal.press(`9x ${ingot}`, [blockTag, "thermal:press_unpacking_die"])
                            .id(`unification:thermal/press_unpacking/storage/${removeMod(ingot)}/from_block`)
                        event.recipes.thermal.press(block, [`9x ${ingotTag}`, "thermal:press_packing_3x3_die"])
                            .id(`unification:thermal/press_packing_3x3/storage/${removeMod(block)}/from_ingots`)
                    }
                    if (checkItems(nugget) && checkTag(ingotTag) && checkTag(nuggetTag)) {
                        event.recipes.thermal.press(`9x ${nugget}`, [ingotTag, "thermal:press_unpacking_die"])
                            .id(`unification:thermal/press_unpacking/storage/${removeMod(nugget)}/from_ingot`)
                        event.recipes.thermal.press(ingot, [`9x ${nuggetTag}`, "thermal:press_packing_3x3_die"])
                            .id(`unification:thermal/press_packing_3x3/storage/${removeMod(ingot)}/from_nuggets`)
                    }
                }
            },
        },
        minecraft: {   
            gear: (event, material, gear) => {
                if (checkItems(gear)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.shaped(gear, [" I ", "III", " I "], {I: `#forge:ingots/${material}`}).id(`unification:minecraft/shaped/component/${removeMod(gear)}/from_ingots`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.shaped(gear, [" I ", "III", " I "], {I: `#forge:gems/${material}`}).id(`unification:minecraft/shaped/component/${removeMod(gear)}/from_gems`)
                    }
                }
            },
            ore_processing_gem: (event, material, gem, gem_multiplyer) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    if(gem_multiplyer == null) gem_multiplyer = 1
                    event.smelting(gem, Ingredient.of(`#forge:ores/${material}`, Math.round(gem_multiplyer)))
                        .xp(1).id(`unification:minecraft/smelting/ore_processing/${removeMod(gem)}/from_ore`)
                    event.blasting(gem, Ingredient.of(`#forge:ores/${material}`, Math.round(gem_multiplyer)))
                        .xp(1).id(`unification:minecraft/blasting/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },     
            ore_processing_metal: (event, material, ingot) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == `#forge:raw_materials/${material}` || input == `#forge:raw_blocks/${material}`)) return
                    if (checkTag(input) && checkItems(ingot)) {
                        event.smelting(ingot, input).xp(1).id(`unification:minecraft/smelting/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material"][i]}`)
                        event.blasting(ingot, input).xp(1).id(`unification:minecraft/blasting/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material"][i]}`)
                    }
                })
            },
            rod: (event, material, rod) => {
                if (checkItems(rod)) {
                    if (checkTag(`#forge:ingots/${material}`)){
                        event.shaped(`3x ${rod}`, ["  I", " I ", "I  "], {I: `#forge:ingots/${material}`}).id(`unification:minecraft/shaped/component/${removeMod(rod)}/from_ingot`)
                    } else if (checkTag(`#forge:gems/${material}`)){
                        event.shaped(`3x ${rod}`, ["  I", " I ", "I  "], {I: `#forge:gems/${material}`}).id(`unification:minecraft/shaped/component/${removeMod(rod)}/from_gem`)
                    }
                }
            },
            storage_convert_gem: (event, material, gem, block) => {
                if(checkItems(block) && checkItems(gem)){
                    let gemTag = `#forge:gems/${material}`
                    let blockTag = `#forge:storage_blocks/${material}`
                    if (checkTag(gemTag) && checkTag(blockTag)) {
                        event.shapeless(`9x ${gem}`, [blockTag]).id(`unification:minecraft/shapeless/storage/${removeMod(gem)}/from_block`)
                        event.shaped(block, ["III", "III", "III"], {I: gemTag}).id(`unification:minecraft/shaped/storage/${removeMod(block)}/from_gems`)
                    }
                }
            },
            storage_convert_metal: (event, material, ingot, block, nugget) => {
                if(checkItems(ingot)){
                    let ingotTag = `#forge:ingots/${material}`
                    let blockTag = `#forge:storage_blocks/${material}`
                    let nuggetTag = `#forge:nuggets/${material}`
                    if (checkItems(block) && checkTag(ingotTag) && checkTag(blockTag)) {
                        event.shapeless(`9x ${ingot}`, [blockTag]).id(`unification:minecraft/shapeless/storage/${removeMod(ingot)}/from_block`)
                        event.shaped(block, ["III", "III", "III"], {I: ingotTag}).id(`unification:minecraft/shaped/storage/${removeMod(block)}/from_ingots`)
                    }
                    if (checkItems(nugget) && checkTag(ingotTag) && checkTag(nuggetTag)) {
                        event.shapeless(`9x ${nugget}`, [ingotTag]).id(`unification:minecraft/shapeless/storage/${removeMod(nugget)}/from_ingot`)
                        event.shaped(ingot, ["NNN", "NNN", "NNN"], {N: nuggetTag}).id(`unification:minecraft/shaped/storage/${removeMod(ingot)}/from_nuggets`)
                    }
                }
            },
            storage_convert_raw: (event, material, raw, block) => {
                let rawTag = `#forge:raws/${material}`
                let blockTag = `#forge:raw_blocks/${material}`
                if (checkTag(rawTag) && checkTag(blockTag) && checkItems(raw) && checkItems(block)) {
                    event.shapeless(`9x ${raw}`, [blockTag]).id(`unification:minecraft/shapeless/storage/${removeMod(raw)}/from_block`)
                    event.shaped(block, ["III", "III", "III"], {I: rawTag}).id(`unification:minecraft/shaped/storage/${removeMod(block)}/from_raw_materials`)
                }
            },
            smelting_recipes: (event, material, elements, nugget, fromDustOnly) => {
                if(checkItems(elements[0])) elements = elements[0]
                else if(checkItems(elements[1])) elements = elements[1]
                else return

                if(fromDustOnly === null) fromDustOnly = true

                let types = ["dust", "gear", "plate", "rod", "wire", "coin"]
                let output = [elements, `4x ${elements}`, elements, `4x ${nugget}`, `4x ${nugget}`, `3x ${nugget}`]
                let xp = [0.1, 0, 0, 0, 0, 0]
                types.forEach((type, i) => {
                    if (checkTag(`#forge:${type}s/${material}`)){
                        if(checkItems(Item.of(output[i]).id)){
                            event.smelting(Item.of(output[i]), `#forge:${type}s/${material}`).xp(xp[i]).id(`unification:minecraft/smelting/component/${removeMod(output[i])}/from_${type}`)
                            event.blasting(Item.of(output[i]), `#forge:${type}s/${material}`).xp(xp[i]).id(`unification:minecraft/blasting/component/${removeMod(output[i])}/from_${type}`)
                        }
                        if(fromDustOnly === true) return
                    }
                })
            },
            wire: (event, material, wire) => {
                console.log(Item.of(wire))
                console.log(wire)
                event.shaped(Item.of(wire, 3), ["III"], {I: `#forge:ingots/${material}`}).id(`unification:minecraft/shaped/component/${removeMod(wire)}/from_ingots`)
            }
        }
    }
})