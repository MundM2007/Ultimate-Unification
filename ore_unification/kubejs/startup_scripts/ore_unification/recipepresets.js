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
    return Ingredient.of(tag).stacks.length > 0
}
function checkItems(items){
    if (!Array.isArray(items)) items = [items]
    let failed = False
    items.forEach(item => {
        if (!Item.exists(item)) {failed = True; return}
    })
    return !failed
}

onEvent("loaded", e => {
    global.rp = {
        ore_processing: (event, material, ingot, dust, mekanism, bloodmagic, create, elementalcraft) => {
        },
        appliedenergistics2: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    global.mrt.appliedenergistics2.grinder(event, dust, `#forge:ingots/${material}`).id(`unification:appliedenergistics2/grinder/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.appliedenergistics2.dust(event, material, `unification:${material}_dust`)},
            ore_processing_gem: (event, material, gem) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    global.mrt.appliedenergistics2.grinder(event, Item.of(gem, 2), `forge:ores/${material}`, 8, `unification:appliedenergistics2/grinder/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.appliedenergistics2.ore_processing_gem(event, material, `unification:${material}_gem`)},
            ore_processing_metal: (event, material, dust) => {
                if (checkTag(`#forge:ores/${material}`) && checkItems(dust)) {
                    global.mrt.appliedenergistics2.grinder(event, `2x ${dust}`, `#forge:ores/${material}`, 4, `unification:appliedenergistics2/grinder/ore_processing/${removeMod(dust)}/from_ore`)
                }
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.appliedenergistics2.ore_processing_metal(event, material, `unification:${material}_dust`)}
        },
        astralsorcery: {
            ore_processing_gem: (event, material, gem) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    global.mrt.astralsorcery.infuser(event, Item.of(gem, 2), `forge:ores/${material}`, 100,  0.1, [true], "astralsorcery:liquid_starlight",
                        `unification:astralsorcery/infuser/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.astralsorcery.ore_processing_gem(event, material, `unification:${material}_gem`)},
            ore_processing_metal: (event, material, ingot) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`].forEach((input, i) => {
                    nUni = !(input===`#forge:ores/${material}`) && newUnification
                    if (checkTag(input) && checkItems(ingot)) {
                        global.mrt.astralsorcery.infuser(event, Item.of(ingot, nUni ? 2 : 3 * i===2 ? 9 : 1), input, 100,  i===2 ? 0.7 : 0.1, [true], "astralsorcery:liquid_starlight",
                            `unification:astralsorcery/infuser/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block"][i]}`)
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.astralsorcery.ore_processing_metal(event, material, `unification:${material}_ingot`)}
        },
        betterendforge: {
            ore_processing_gem: (event, material, gem) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    global.mrt.betterendforge.alloying(event, Item.of(gem, 4), [`forge:ores/${material}`, `forge:ores/${material}`], 200, 
                        `unification:betterendforge/alloying/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.betterendforge.ore_processing_gem(event, material, `unification:${material}_gem`)},
            ore_processing_metal: (event, material, ingot) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`].forEach((input, i) => {
                    if (checkTag(input) && checkItems(ingot)) {
                        let nUni = !(input===`#forge:ores/${material}`) && newUnification
                        global.mrt.betterendforge.alloying(event, Item.of(ingot, nUni ? 3 : 4 * i===2 ? 9 : 1), [input, input], i===2 ? 18 : 2, i===2 ? 1800 : 200, 
                            `unification:betterendforge/alloying/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block"][i]}`)
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {
                global.rp.betterendforge.ore_processing_metal(event, material, `unification:${material}_ingot`)
            }
        },
        bloodmagic: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    event.recipes.bloodmagic.arc(dust, `#forge:ingots/${material}`, "#bloodmagic:arc/explosive").consumeIngredient(false)
                        .id(`unification:bloodmagic/arc/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.bloodmagic.dust(event, material, `unification:${material}_dust`)},
            // names: gravel, fragment
            ore_processing_metal: (event, material, dust, names) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input)) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification
                        if(checkItems(dust)){
                            countOut = [[[1, 0.5], [2, 0]], [[1, 0.5], [2, 0]], [[13, 0.5], [18, 0]], [[0, 0.375], [0, 0.5]]][i][nUni ? 0 : 1]
                            event.recipes.bloodmagic.arc([Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, countOut[1]===0 ? 1 : 2), 
                                input, "#bloodmagic:arc/cuttingfluid").consumeIngredient(false)
                                .id(`unification:bloodmagic/arc/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                        
                        if(checkItems(names)){
                            countOut = [[2, 3], [2, 3], [18, 27], [0.5, 0.75]][i][nUni ? 0 : 1]
                            event.recipes.bloodmagic.arc(Number.isInteger(countOut) ? Item.of(names[1], countOut) : Item.of(names[1]).withChance(countOut), input, "#bloodmagic:arc/explosive")
                                .consumeIngredient(false).id(`unification:bloodmagic/arc/ore_processing/${removeMod(names[1])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        if (i!==3 && checkItems(dust)) {
                            event.recipes.bloodmagic.alchemytable(Item.of(dust, nUni ? 3 : 2 * i===2 ? 9 : 1), ["#bloodmagic:arc/cuttingfluid", input, input].slice(0, nUni ? 3 : 2))
                                .syphon(i===2 ? 3600 : 400).ticks(200).upgradeLevel(1)
                                .id(`unification:bloodmagic/alchemytable/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    }
                })
                
                if(checkItems(names)){
                event.recipes.bloodmagic.arc(names[0], names[1], "#bloodmagic:arc/resonator", [Item.of("bloodmagic:corrupted_tinydust").withChance(0.05),
                    Item.of("bloodmagic:corrupted_tinydust").withChance(0.01)]).consumeIngredient(false)
                    .id(`unification:bloodmagic/arc/ore_processing/${removeMod(names[0])}/from_fragment`)
                event.recipes.bloodmagic.arc(dust, names[0], "#bloodmagic:arc/cuttingfluid").consumeIngredient(false)
                    .id(`unification:bloodmagic/arc/ore_processing/${removeMod(dust)}/from_gravel`)
                }
            },
            ore_processing_metal_all_custom: (event, material) => {
                global.rp.bloodmagic.ore_processing_metal(event, material, `unification:${material}_dust`, [`unification:${material}_gravel`, `unification:${material}_fragment`])
            }
        },
        boss_tools: {
            plate: (event, material, plate) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(plate)) {
                    event.shapeless(plate, [`#forge:ingots/${material}`, Item.of("boss_tools:hammer").ignoreNBT()])
                        .damageIngredient(Item.of("boss_tools:hammer").ignoreNBT(), 1)
                        .id(`unification:minecraft/shaped/component/${removeMod(plate)}/from_ingot/with_boss_tools_hammer`)
                }
            },
            plate_all_custom: (event, material) => {global.rp.boss_tools.plate(event, material, `unification:${material}_plate`)},
        },
        boss_tools_giselle_addon: {
            coin: (event, material, coin) => {
                if (checkTag(`#forge:nuggets/${material}`) && checkItems(coin)) {
                    global.mrt.boss_tools_giselle_addon.rolling(event, coin, `3x #forge:nuggets/${material}`, 200, 
                        `unification:boss_tools_giselle_addon/rolling/component/${removeMod(coin)}/from_nuggets`)
                }
            },
            coin_all_custom: (event, material) => {global.rp.boss_tools_giselle_addon.coin(event, material, `unification:${material}_coin`)},
            gear: (event, material, gear) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(gear)) {
                    global.mrt.boss_tools_giselle_addon.rolling(event, gear, `4x #forge:plates/${material}`, 200, 
                        `unification:boss_tools_giselle_addon/rolling/component/${removeMod(gear)}/from_plates`)
                }
            },
            gear_all_custom: (event, material) => {global.rp.boss_tools_giselle_addon.gear(event, material, `unification:${material}_gear`)},
            plate: (event, material, plate) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(plate)) {
                    global.mrt.boss_tools_giselle_addon.rolling(event, plate, `#forge:ingots/${material}`, 200, 
                        `unification:boss_tools_giselle_addon/rolling/component/${removeMod(plate)}/from_ingot`)
                }
            },
            plate_all_custom: (event, material) => {global.rp.boss_tools_giselle_addon.plate(event, material, `unification:${material}_plate`)},
            rod: (event, material, rod) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(rod)) {
                    global.mrt.boss_tools_giselle_addon.extruding(event, `2x ${rod}`, `#forge:ingots/${material}`, 200, 
                        `unification:boss_tools_giselle_addon/extruding/component/${removeMod(rod)}/from_ingot`)
                }
            },
            rod_all_custom: (event, material) => {global.rp.boss_tools_giselle_addon.rod(event, material, `unification:${material}_rod`)},
            wire: (event, material, wire) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(wire)) {
                    global.mrt.boss_tools_giselle_addon.extruding(event, `2x ${wire}`, `#forge:plates/${material}`, 200, 
                        `unification:boss_tools_giselle_addon/extruding/component/${removeMod(wire)}/from_plate`)
                }
            },
            wire_all_custom: (event, material) => {global.rp.boss_tools_giselle_addon.wire(event, material, `unification:${material}_wire`)}
        },
        create: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    event.recipes.createCrushing(dust, `#forge:ingots/${material}`).id(`unification:create/crushing/component/${removeMod(dust)}/from_ingot`)
                    event.recipes.createMilling(dust, `#forge:ingots/${material}`).id(`unification:create/milling/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.create.dust(event, material, `unification:${material}_dust`)},
            ore_processing_gem: (event, material, gem) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    event.recipes.createCrushing([Item.of(gem, 2), Item.of(gem).withChance(0.25)], `forge:ores/${material}`).id(`unification:create/crushing/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.create.ore_processing_gem(event, material, `unification:${material}_gem`)},
            // names: nugget, crushed_ore
            ore_processing_metal: (event, material, ingot, names) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input) && checkItems(names[1])) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification
                        countOut = [[[1, 0.4], [2, 0]], [[1, 0.4], [2, 0]], [[12, 0.6], [18, 0]], [[0, 0.35], [0, 0.5]]][i][nuni ? 0 : 1]
                        event.recipes.createCrushing(
                            [Item.of(names[1], countOut[0]), Item.of(names[1]).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, countOut[1]===0 ? 1 : 2)
                            .concat([Item.of("minecraft:cobblestone").withChance(0.125)]), input)
                            .id(`unification:create/crushing/ore_processing/${removeMod(names[1])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)

                        countOut = [1, 1, 9, 0.25][i]
                        event.recipes.createMilling(Number.isInteger(countOut) ? Item.of(names[1], countOut) : Item.of(names[1]).withChance(countOut), input)
                            .id(`unification:create/milling/ore_processing/${removeMod(names[1])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
                
                if (checkTag(`#forge:crushed_ores/${material}`)) {
                    if(checkItems(ingot)){
                        event.smelting(ingot, `#forge:crushed_ores/${material}`).xp(0.1).id(`unification:minecraft/smelting/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                        event.blasting(ingot, `#forge:crushed_ores/${material}`).xp(0.1).id(`unification:minecraft/blasting/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                    }
                    if(checkItems(names[0])){
                    event.recipes.createSplashing([`10x ${names[0]}`, Item.of(`5x ${names[0]}`).withChance(0.5)], `#forge:crushed_ores/${material}`)
                        .id(`unification:create/milling/ore_processing/${removeMod(names[0])}/from_crushed_ore`)
                    }
                }
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.create.ore_processing_metal(event, material, [`unification:${material}_nugget`, `unification:${material}_crushed_ore`])},
            plate: (event, material, plate) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(plate)) {
                    event.recipes.createPressing(plate, `#forge:ingots/${material}`).id(`unification:create/pressing/component/${removeMod(plate)}/from_ingot`)
                }
            },
            plate_all_custom: (event, material) => {global.rp.create.plate(event, material, `unification:${material}_plate`)},
        },
        createaddition: {
            rod: (event, material, rod) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(rod)) {
                    global.mrt.createaddition.rolling(event, `2x ${rod}`, `#forge:ingots/${material}`, `unification:createaddition/rolling/component/${removeMod(rod)}/from_ingot`)
                }
            },
            rod_all_custom: (event, material) => {global.rp.createaddition.rod(event, material, `unification:${material}_rod`)},
            wire: (event, material, wire) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(wire)) {
                    global.mrt.createaddition.rolling(event, `2x ${wire}`, `#forge:plates/${material}`, `unification:createaddition/rolling/component/${removeMod(wire)}/from_plate`)
                }
            },
            wire_all_custom: (event, material) => {global.rp.createaddition.wire(event, material, `unification:${material}_wire`)}
        },
        engineerstools: {
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input) && checkItems(dust)) {
                        if (!(input===`#forge:ores/${material}`) && newUnification){
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
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.engineerstools.ore_processing_metal(event, material, `unification:${material}_dust`)}
        },
        exnihilo: {
            pieces_to_raw: (event, material, raw) => {
                if (checkTag(`#forge:pieces/${material}`) && checkItems(raw)) {
                    event.shaped(raw, ["PP", "PP"], {P: `#forge:pieces/${material}`}).id(`unification:minecraft/shaped/ore_processing/${removeMod(raw)}/from_pieces`)
                }
            }
        },
        ftbic: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    global.mrt.ftbic.macerating(event, dust, `#forge:ingots/${material}`, `unification:ftbic/macerating/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.ftbic.dust(event, material, `unification:${material}_dust`)},
            coin: (event, material, coin) => {
                if (checkTag(`#forge:nuggets/${material}`) && checkItems(coin)) {
                    global.mrt.ftbic.rolling(event, coin, `4x #forge:nuggets/${material}`, `unification:ftbic/rolling/component/${removeMod(coin)}/from_nuggets`)
                }
            },
            coin_all_custom: (event, material) => {global.rp.ftbic.coin(event, material, `unification:${material}_coin`)},
            gear: (event, material, gear) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(gear)) {
                    global.mrt.ftbic.rolling(event, gear, `4x #forge:plates/${material}`, `unification:ftbic/rolling/component/${removeMod(gear)}/from_plates`)
                }
            },
            gear_all_custom: (event, material) => {global.rp.ftbic.gear(event, material, `unification:${material}_gear`)},
            ore_processing_gem: (event, material, gem) => {
                let input = `forge:ores/${material}`
                if (checkTag(input) && checkItems(gem) && checkItems(gem)) {
                    global.mrt.ftbic.macerating(event, [Item.of(gem, 2)], input, `unification:ftbic/macerating/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.ftbic.ore_processing_gem(event, material, `unification:${material}_gem`)},
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input) && checkItems(dust)) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification
                        countOut = [[[1, 0.4], [2, 0]], [[1, 0.4], [2, 0]], [[12, 0.6], [18, 0]], [[0, 0.35], [0, 0.5]]][i][nuni ? 0 : 1]
                        global.mrt.ftbic.macerating(event, [Item.of(dust, countOut[0]), countOut[1]===0 ? "" : Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), input, 
                            `unification:ftbic/macerating/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.ftbic.ore_processing_metal(event, material, `unification:${material}_dust`)},
            plate: (event, material, plate) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(plate)) {
                    global.mrt.ftbic.rolling(event, plate, `#forge:ingots/${material}`, `unification:ftbic/rolling/component/${removeMod(plate)}/from_ingot`)
                }
            },
            plate_all_custom: (event, material) => {global.rp.ftbic.plate(event, material, `unification:${material}_plate`)},
            rod: (event, material, rod) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(rod)) {
                    global.mrt.ftbic.extruding(event, `2x ${rod}`, `#forge:ingots/${material}`, `unification:ftbic/extruding/component/${removeMod(rod)}/from_ingot`)
                }
            },
            rod_all_custom: (event, material) => {global.rp.ftbic.rod(event, material, `unification:${material}_rod`)},
            wire: (event, material, wire) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(wire)) {
                    global.mrt.ftbic.extruding(event, `2x ${wire}`, `#forge:plates/${material}`, `unification:ftbic/extruding/component/${removeMod(wire)}/from_plate`)
                    event.shaped(wire, ["III"], {I: `#forge:ingots/${material}`}).id(`unification:minecraft/shaped/component/${removeMod(wire)}/from_ingots`)
                }
            },
            wire_all_custom: (event, material) => {global.rp.ftbic.wire(event, material, `unification:${material}_wire`)}
        },
        industrialforegoing: {
            ore: (event, ore, catalyst, weight, max_depth) => {
                global.mrt.industrialforegoing.laser_drill(event, ore, catalyst, [[[], [0, max_depth], weight]], false, "", `unification:industrialforegoing/laser_drill/${removeMod(ore)}`)
            },
        },
        immersiveengineering: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    event.recipes.immersiveengineeringCrusher(dust, `#forge:ingots/${material}`).id(`unification:immersiveengineering/crusher/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.immersiveengineering.dust(event, material, `unification:${material}_dust`)},
            gear: (event, material, gear) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(gear)) {
                    event.recipes.immersiveengineeringMetalPress(gear, `4x #forge:ingots/${material}`, "immersiveengineering:mold_gear")
                        .id(`unification:immersiveengineering/metal_press/component/${removeMod(gear)}/from_ingots`)
                }
            },
            gear_all_custom: (event, material) => {global.rp.immersiveengineering.gear(event, material, `unification:${material}_gear`)},
            ore_processing_gem: (event, material, gem) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    event.recipes.immersiveengineeringCrusher([Item.of(gem, 2), Item.of(gem).withChance(0.25)], `forge:ores/${material}`)
                        .id(`unification:immersiveengineering/crusher/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.immersiveengineering.ore_processing_gem(event, material, `unification:${material}_gem`)},
            ore_processing_metal: (event, material, ingot, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input)) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification

                        if(checkItems(dust)){
                        countOut = [[[1, 0.5], [2, 0.2]], [[1, 0.5], [2, 0.2]], [[13, 0.5], [19, 0.8]], [[0, 0.375], [0, 0.55]]][i][nuni ? 0 : 1]
                        event.recipes.immersiveengineeringCrusher([Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), input)
                            .id(`unification:immersiveengineering/crusher/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        
                        event.shapeless(Item.of(dust, [1, 1, 9, 1][i]), [Item.of("immersiveengineering:hammer").ignoreNBT(), input, input, input, input].slice(0, i===3 ? 5 : 2))
                            .damageIngredient(Item.of("immersiveengineering:hammer").ignoreNBT(), [1, 1, 9, 1][i])
                            .id(`unification:minecraft/shapeless/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}/with_immersiveengineering_hammer`)
                        }

                        if(checkItems(ingot)){
                        countOut = [[[2, 0.2], [3, 0.3]], [[2, 0.2], [3, 0.3]], [[19, 0.8], [29, 0.7]], [[0, 0.55], [0, 0.825]]][i][nuni ? 0 : 1]
                        event.recipes.immersiveengineeringArcFurnace([Item.of(ingot, countOut[0]), Item.of(ingot).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), input)
                            .id(`unification:immersiveengineering/arc_furnace/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {
                global.rp.immersiveengineering.ore_processing_metal(event, material, `unification:${material}_ingot`, `unification:${material}_dust`)
            },
            plate: (event, material, plate) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(plate)) {
                    event.shapeless(plate, [`#forge:ingots/${material}`, Item.of("immersiveengineering:hammer").ignoreNBT()])
                        .damageIngredient(Item.of("immersiveengineering:hammer").ignoreNBT(), 1)
                        .id(`unification:minecraft/shaped/component/${removeMod(plate)}/from_ingot/with_immersiveengineering_hammer`)
                    event.recipes.immersiveengineeringMetalPress(plate, `#forge:ingots/${material}`, "immersiveengineering:mold_plate")
                        .id(`unification:immersiveengineering/metal_press/component/${removeMod(plate)}/from_ingot`)
                }
            },
            plate_all_custom: (event, material) => {global.rp.immersiveengineering.plate(event, material, `unification:${material}_plate`)},
            rod: (event, material, rod) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(rod)) {
                    event.recipes.immersiveengineeringMetalPress(`2x ${rod}`, `#forge:ingots/${material}`, "immersiveengineering:mold_rod")
                        .id(`unification:immersiveengineering/metal_press/component/${removeMod(rod)}/from_ingot`)
                }
            },
            rod_all_custom: (event, material) => {global.rp.immersiveengineering.rod(event, material, `unification:${material}_rod`)},
            wire: (event, material, wire) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(wire)) {
                    event.shapeless(wire, [`#forge:plates/${material}`, Item.of("immersiveengineering:wirecutter").ignoreNBT()])
                        .damageIngredient(Item.of("immersiveengineering:wirecutter").ignoreNBT(), 1)
                        .id(`unification:minecraft/shapeless/component/${removeMod(wire)}/from_plate/with_immersiveengineering_wirecutter`)
                }
                if (checkTag(`#forge:ingots/${material}`) && checkItems(wire)) {
                    event.recipes.immersiveengineeringMetalPress(`2x ${wire}`, `#forge:ingots/${material}`, "immersiveengineering:mold_wire")
                        .id(`unification:immersiveengineering/metal_press/component/${removeMod(wire)}/from_ingot`)
                }
            },
            wire_all_custom: (event, material) => {global.rp.immersiveengineering.wire(event, material, `unification:${material}_wire`)}
        },
        integrateddynamics: {
            ore_processing_gem: (event, material, dust) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(dust)) {
                    global.mrt.integrateddynamics.squeezer(event, [Item.of(dust, 1), Item.of(dust).withChance(0.5)], "", `forge:ores/${material}`,
                        `unification:integrateddynamics/squeezer/ore_processing/${removeMod(dust)}/from_ore`)
                    global.mrt.integrateddynamics.mechanical_squeezer(event, [Item.of(dust, 2)], "", `forge:ores/${material}`, 40
                        `unification:integrateddynamics/mechanical_squeezer/ore_processing/${removeMod(dust)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.integrateddynamics.ore_processing_gem(event, material, `unification:${material}_dust`)},
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input) && checkItems(dust)) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification
                        if (nUni) {
                            countOut = [[1, 0.5], [1, 0.5], [13, 0.5], [0, 0.375]][i]
                            global.mrt.integrateddynamics.squeezer(event, [Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), "", input,
                                `unification:integrateddynamics/squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)

                            countOut = [2, 2, 18, 0.5][i]  
                            global.mrt.integrateddynamics.mechanical_squeezer(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut)], "", input, 40
                                `unification:integrateddynamics/mechanical_squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        } else {
                            countOut = [2, 2, 18, 0.5][i]
                            global.mrt.integrateddynamics.squeezer(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut)], "", input,
                                `unification:integrateddynamics/squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            
                            countOut = [3, 3, 27, 3][i]
                            global.mrt.integrateddynamics.mechanical_squeezer(event, Item.of(dust, countOut), "", Item.of(input, i===3 ? 4 : 1), 40
                                `unification:integrateddynamics/mechanical_squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.integrateddynamics.ore_processing_metal(event, material, `unification:${material}_dust`)}
        },
        mekanism: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    global.mrt.mekanism.crushing(event, dust, `#forge:ingots/${material}`, `unification:mekanism/crushing/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.mekanism.dust(event, material, `unification:${material}_dust`)},
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
                        global.mrt.mekanism.combining(event, ore, [`8x #forge:raw_materials/${material}`, strata], `unification:mekanism/combining/${removeMod(ore)}/from_${strata}`)
                    })
                }
            },
            ore_processing_gem: (event, material, gem) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    global.mrt.mekanism.enriching(event, Item.of(gem, 2), `forge:ores/${material}`, `unification:mekanism/enriching/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.mekanism.ore_processing_gem(event, material, `unification:${material}_gem`)},
            // names: dirty dust, clump, shard, crystal, clean slurry, dirty slurry
            ore_processing_metal: (event, material, dust, names) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input)) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification
                        if(checkItems(dust)){
                            countIn = [[3, 1], [3, 1], [1, 1], [3, 2]][i][nUni ? 0 : 1]
                            countOut = [[4, 2], [4, 2], [12, 18], [1, 1]][i][nUni ? 0 : 1]
                            global.mrt.mekanism.enriching(event, Item.of(dust, countOut), Item.of(input, countIn), 
                                `unification:mekanism/enriching/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        if(checkItems([dust].concat(names.slice(0, 2)))){
                            countIn = [[1, 1], [1, 1], [1, 1], [2, 4]][i][nUni ? 0 : 1]
                            countOut = [[2, 3], [2, 3], [18, 27], [1, 3]][i][nUni ? 0 : 1]
                            global.mrt.mekanism.purifying(event, Item.of(names[1], countOut), Item.of(input, countIn), ['mekanism:oxygen', [200, 200, 1800, nUni ? 100 : 200][i]], 
                                `unification:mekanism/purifying/ore_processing/${removeMod(names[1])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        if(checkItems([dust].concat(names.slice(0, 3)))){
                            countIn = [[3, 1], [3, 1], [1, 1], [3, 1]][i][nUni ? 0 : 1]
                            countOut = [[8, 4], [8, 4], [24, 36], [2, 1]][i][nUni ? 0 : 1]
                            global.mrt.mekanism.injecting(event, Item.of(names[2], countOut), Item.of(input, countIn), ['mekanism:hydrogen_chloride', [200, 200, nUni ? 600 : 1800, 50][i]], 
                                `unification:mekanism/injecting/ore_processing/${removeMod(names[2])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }

                        countIn = [[3, 1], [3, 1], [1, 1], [3, 1]][i][nUni ? 0 : 1]
                        countOut = [[2000, 1000], [2000, 1000], [6000, 9000], [500, 250]][i][nUni ? 0 : 1]
                        global.mrt.mekanism.dissolution(event, [names[5], countOut], Item.of(input, countIn), ['mekanism:sulfuric_acid', [100, 100, nUni ? 300 : 900, 25][i]],
                            `unification:mekanism/dissolution/ore_processing/${removeMod(names[5])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
                
                if(checkTag(`#forge:dirty_dusts/${material}`) && checkItems(dust)){
                    global.mrt.mekanism.enriching(event, dust, `#forge:dirty_dusts/${material}`, `unification:mekanism/enriching/ore_processing/${removeMod(dust)}/from_dirty_dust`)
                }

                if(checkTag(`#forge:clumps/${material}`) && checkItems([dust].concat(names.slice(0, 1)))){
                    global.mrt.mekanism.crushing(event, names[0], `#forge:clumps/${material}`, `unification:mekanism/crushing/ore_processing/${removeMod(names[0])}/from_clump`)
                }
                if(checkTag(`#forge:clumps/${material}`) && checkItems([dust].concat(names.slice(0, 2)))){
                    global.mrt.mekanism.purifying(event, names[1], `#forge:shards/${material}`, 'mekanism:oxygen', `unification:mekanism/purifying/ore_processing/${removeMod(names[1])}/from_shard`)
                }
                if(checkTag(`#forge:clumps/${material}`) && checkItems([dust].concat(names.slice(0, 3)))){
                    global.mrt.mekanism.injecting(event, names[2], `#forge:crystals/${material}`, 'mekanism:hydrogen_chloride',
                        `unification:mekanism/injecting/ore_processing/${removeMod(names[2])}/from_crystal`)
                }
                global.mrt.mekanism.crystallizing(event, names[3], [names[4], 200], `unification:mekanism/crystallizing/ore_processing/${removeMod(names[3])}/from_clean_slurry`)
                global.mrt.mekanism.washing(event, names[4], ["#minecraft:water", 5], names[5], `unification:mekanism/washing/ore_processing/${removeMod(names[4])}/from_dirty_slurry`)
            },
            ore_processing_metal_all_custom: (event, material) => {
                global.rp.mekanism.ore_processing_metal(event, material, `unification:${material}_dust`, [`unification:${material}_dirty_dust`, `unification:${material}_clump`, 
                    `unification:${material}_shard`, `unification:${material}_crystal`, `unification:clean_${material}_slurry`, `unification:dirty_${material}_slurry`])
            }
        },
        occultism: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    global.mrt.occultism.crushing(event, dust, `#forge:ingots/${material}`, `unification:occultism/crushing/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.occultism.dust(event, material, `unification:${material}_dust`)},
            ore: (event, ore, weight) => {
                global.mrt.occultism.miner(event, ore, weight, true, `unification:occultism/miner/${removeMod(ore)}`)
            },
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input) && checkItems(dust)) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification
                        countOut = [[2, 3], [2, 3], [18, 27], [0.5, 0.75]][i][nUni ? 0 : 1]
                        global.mrt.occultism.crushing(event,  Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut), input, 
                            `unification:occultism/crushing/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.occultism.ore_processing_metal(event, material, `unification:${material}_dust`)}
        },
        potionsmaster: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    event.shapeless(dust, ["potionsmaster:pestle", `#forge:ingots/${material}`, "potionsmaster:tile_mortar"])
                        .id(`unification:minecraft/shapeless/component/${removeMod(dust)}/from_ingot/with_potionsmaster_pestle_and_mortar`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.potionsmaster.dust(event, material, `unification:${material}_dust`)},
        },
        silents_mechanisms: {
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    global.mrt.silents_mechanisms.crushing(event, dust, `#forge:ingots/${material}`, 200, 
                        `unification:silents_mechanisms/crushing/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.silents_mechanisms.dust(event, material, `unification:${material}_dust`)},
            ore_processing_gem: (event, material, gem) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    global.mrt.silents_mechanisms.crushing(event, [Item.of(gem, 2), Item.of("minecraft:cobblestone").withChance(0.1)], `forge:ores/${material}`, 200, 
                        `unification:silents_mechanisms/crushing/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.thermal.ore_processing_gem(event, material, `unification:${material}_gem`)},
            ore_processing_metal: (event, material, dust) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input) && checkItems(dust)) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification
                        if (nUni){
                            countOut = [[1, 0.4], [1, 0.4], [12, 0.6], [0, 0.35]][i]
                            global.mrt.silents_mechanisms.crushing(event, [Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), input, 200, 
                                `unification:silents_mechanisms/crushing/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        } else {
                            countOut = [2, 2, 9, 0.5][i]
                            global.mrt.silents_mechanisms.crushing(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut), 
                                Item.of("minecraft:cobblestone").withChance(0.1)].slice(0, i === 0 ? 2 : 1), 
                                input, 200, `unification:silents_mechanisms/crushing/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.silents_mechanisms.ore_processing_metal(event, material, `unification:${material}_dust`)}
        },
        tconstruct: {
            ore_processing_gem: (event, material, molten) => {
                if (checkTag(`forge:ores/${material}`) && !Fluid.of(molten).equals(Fluid.empty)) {
                    global.mrt.tconstruct.ore_melting(event, Fluid.of(molten, 144), Fluid.of(molten, 48), `forge:ores/${material}`, 800, 100, 
                        `unification:tconstruct/melting/ore_processing/${removeMod(molten)}/from_ore`)
                }
            },
            // names: ingot, dust
            ore_processing_metal: (event, material, molten) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input) && !Fluid.of(molten).equals(Fluid.empty)) {
                        nUni = !(input===`#forge:ores/${material}`) && newUnification
                        countOut = [[[108, 36], [144, 48]], [[108, 36], [144, 48]], [[972, 324], [1296, 432]], [[27, 9], [36, 12]]][i][nUni ? 0 : 1]
                        global.mrt.tconstruct.ore_melting(event, Fluid.of(molten, countOut[0]), Fluid.of(molten, countOut[1]), input, 800, 100, 
                            `unification:tconstruct/melting/ore_processing/${removeMod(names[0])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
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
            //names: storage_block, ingot, nugget, gem, plate, gear, rod, wire, "coin"
            casting: (event, molten, names) => {
                let casts = ["", "ingot", "nugget", "gem", "plate", "gear", "rod", "wire", "coin"]
                let amounts = [1296, 144, 16, 144, 144, 576, 72, 72, 48]
                let times = [180, 60, 20, 80, 60, 120, 43, 43, 35]
                if(!Fluid.of(molten).equals(Fluid.empty)){
                    names.forEach((output, i) => {
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
            dust: (event, material, dust) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(dust)) {
                    event.recipes.thermal.pulverizer(dust, `#forge:ingots/${material}`).id(`unification:thermal/pulverizer/component/${removeMod(dust)}/from_ingot`)
                }
            },
            dust_all_custom: (event, material) => {global.rp.thermal.dust(event, material, `unification:${material}_dust`)},
            coin: (event, material, coin) => {
                if (checkTag(`#forge:nuggets/${material}`) && checkItems(coin)) {
                    event.recipes.thermal.press(coin, [`3x #forge:nuggets/${material}`, "thermal:press_coin_die"])
                        .id(`unification:thermal/press/component/${removeMod(coin)}/from_nuggets`).energy(2400)
                }
                if (checkTag(`#forge:ingots/${material}`) && checkItems(coin)) {
                    event.recipes.thermal.press(`3x ${coin}`, [`#forge:ingots/${material}`, "thermal:press_coin_die"])
                        .id(`unification:thermal/press/component/${removeMod(coin)}/from_ingot`).energy(2400)
                }
            },
            coin_all_custom: (event, material) => {global.rp.thermal.coin(event, material, `unification:${material}_coin`)},
            gear: (event, material, gear) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(gear)) {
                    event.recipes.thermal.press(gear, [`4x #forge:ingots/${material}`, "thermal:press_gear_die"])
                        .id(`unification:thermal/press/component/${removeMod(gear)}/from_ingots`).energy(2400)
                }
            },
            gear_all_custom: (event, material) => {global.rp.thermal.gear(event, material, `unification:${material}_gear`)},
            ingot: (event, molten, ingot) => {
                if(!Fluid.of(molten).equals(Fluid.empty) && checkItems(ingot)){
                    event.recipes.thermal.chiller(ingot, [Fluid.of(molten, 144), 'thermal:chiller_ingot_cast']).id(`unification:thermal/chiller/component/${removeMod(ingot)}/from_molten`)
                }
            },
            ingot_all_custom: (event, material) => {global.rp.thermal.ingot(event, material, `unification:${material}_molten`, `unification:${material}_ingot`)},
            ore_processing_gem: (event, material, gem) => {
                input = `forge:ores/${material}`
                if (checkTag(input) && checkItems(gem)) {
                    event.recipes.thermal.pulverizer([Item.of(gem, 2), Item.of("minecraft:gravel").withChance(0.2)], input).energy(4000)
                        .id(`unification:thermal/pulverizer/ore_processing/${removeMod(gem)}/from_ore`)
                    event.recipes.thermal.smelter([Item.of(gem, 1), Item.of(gem).withChance(0.5), Item.of("thermal:rich_slag").withChance(0.15)], input).energy(3200)
                        .id(`unification:thermal/smelter/ore_processing/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.thermal.ore_processing_gem(event, material, `unification:${material}_gem`)},
            // names: ingot, dust
            ore_processing_metal: (event, material, names) => {
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`, `#forge:raw_blocks/${material}`, `#forge:pieces/${material}`].forEach((input, i) => {
                    if (checkTag(input)) {
                        nUni = input!==`#forge:ores/${material}` && newUnification
                        if (nUni) {
                            if(checkItems(names[0])){
                                countOut = [[1, 0.3], [1, 0.3], [11, 0.7], [0, 0.325]][i]
                                event.recipes.thermal.smelter([Item.of(names[0], countOut[0]), Item.of(names[0]).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), input).energy(3200)
                                    .id(`unification:thermal/smelter/ore_processing/${removeMod(names[0])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }

                            if(checkItems(names[1])){
                                countOut = [[1, 0.5], [1, 0.5], [13, 0.5], [0, 0.375]][i]
                                event.recipes.thermal.pulverizer([Item.of(names[1], countOut[0]), Item.of(names[1]).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), input).energy(4000)
                                    .id(`unification:thermal/pulverizer/ore_processing/${removeMod(names[1])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
                        } else {
                            if (input===`#forge:ores/${material}`) {
                                if(checkItems(names[0])){
                                    event.recipes.thermal.smelter([`2x ${names[0]}`, Item.of('thermal:rich_slag').withChance(0.2)], input).energy(3200)
                                        .id(`unification:thermal/smelter/ore_processing/${removeMod(names[0])}/from_ore`)
                                }
                                if(checkItems(names[1])){
                                    event.recipes.thermal.pulverizer([`2x ${names[1]}`, Item.of('minecraft:gravel').withChance(0.2)], input).energy(4000)
                                        .id(`unification:thermal/pulverizer/ore_processing/${removeMod(names[1])}/from_ore`)
                                }
                            } else {
                                countOut = [, 2, 18, 0.5][i]
                                if(checkItems(names[0])){
                                    event.recipes.thermal.smelter([Number.isInteger(countOut) ? Item.of(names[0], countOut) : Item.of(names[0]).withChance(countOut)], input).energy(3200)
                                        .id(`unification:thermal/smelter/ore_processing/${removeMod(names[0])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                                }
                                if(checkItems(names[1])){
                                    event.recipes.thermal.pulverizer([Number.isInteger(countOut) ? Item.of(names[1], countOut) : Item.of(names[1]).withChance(countOut)], input).energy(4000)
                                        .id(`unification:thermal/pulverizer/ore_processing/${removeMod(names[1])}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                                }
                            }
                        }
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.thermal.ore_processing_metal(event, material, [`unification:${material}_ingot`, `unification:${material}_dust`])},
            plate: (event, material, plate) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(plate)) {
                    event.recipes.thermal.press(plate, `#forge:ingots/${material}`).id(`unification:thermal/press/component/${removeMod(plate)}/from_ingot`).energy(2400)
                }
            },
            plate_all_custom: (event, material) => {global.rp.thermal.plate(event, material, `unification:${material}_plate`)},
            rod: (event, molten, rod) => {
                if(!Fluid.of(molten).equals(Fluid.empty) && checkItems(rod)){
                    event.recipes.thermal.chiller(rod, [Fluid.of(molten, 144), 'thermal:chiller_rod_cast']).id(`unification:thermal/chiller/component/${removeMod(rod)}/from_molten`)
                }
            },
            rod_all_custom: (event, material) => {global.rp.thermal.rod(event, material, `unification:${material}_molten`, `unification:${material}_rod`)}
        },
        minecraft: {   
            gear: (event, material, gear) => {
                if (checkTag(`#forge:plates/${material}`) && checkItems(gear)) {
                    event.shaped(gear, [" I ", "III", " I "], {I: `#forge:ingots/${material}`}).id(`unification:minecraft/shaped/component/${removeMod(gear)}/from_ingots`)
                }
            },
            gear_all_custom: (event, material) => {global.rp.minecraft.gear(event, material, `unification:${material}_gear`)},
            ore_processing_gem: (event, material, gem) => {
                if (checkTag(`forge:ores/${material}`) && checkItems(gem)) {
                    event.smelting(gem, `forge:ores/${material}`).xp(1).id(`unification:minecraft/smelting/${removeMod(gem)}/from_ore`)
                    event.blasting(gem, `forge:ores/${material}`).xp(1).id(`unification:minecraft/blasting/${removeMod(gem)}/from_ore`)
                }
            },
            ore_processing_gem_all_custom: (event, material) => {global.rp.minecraft.ore_processing_gem(event, material, `unification:${material}_gem`)},         
            ore_processing_metal: (event, material, ingot) => {
                // output - input
                [`#forge:ores/${material}`, `#forge:raw_materials/${material}`].forEach((input, i) => {
                    if (checkTag(input) && checkItems(gingot)) {
                        event.smelting(ingot, input).xp(1).id(`unification:minecraft/smelting/${removeMod(ingot)}/from_${["ore", "raw_material"][i]}`)
                        event.blasting(ingot, input).xp(1).id(`unification:minecraft/blasting/${removeMod(ingot)}/from_${["ore", "raw_material"][i]}`)
                    }
                })
            },
            ore_processing_metal_all_custom: (event, material) => {global.rp.minecraft.ore_processing_metal(event, material, `unification:${material}_ingot`)},
            rod: (event, material, rod) => {
                if (checkTag(`#forge:ingots/${material}`) && checkItems(rod)) {
                    event.shaped(`3x ${rod}`, ["  I", " I ", "I  "], {I: `#forge:ingots/${material}`}).id(`unification:minecraft/shaped/component/${removeMod(rod)}/from_ingot`)
                }
            },
            rod_all_custom: (event, material) => {global.rp.minecraft.rod(event, material, `unification:${material}_rod`)},
            storage_convert: (event, material, ingot, block, nugget) => {
                if(checkItems(ingot)){
                    let ingotTag = `#forge:ingots/${material}`
                    let blockTag = `#forge:storage_blocks/${material}`
                    let nuggetTag = `#forge:nuggets/${material}`
                    if (checkItems(block) && checkTag(ingotTag) && checkTag(blockTag)) {
                        event.shapeless(`9x ${ingot}`, [blockTag]).id(`unification:minecraft/shapeless/storage/${removeMod(ingot)}/from_block`)
                        event.shaped(block, ["III", "III", "III"], {I: ingotTag}).id(`unification:minecraft/shaped/storage/${removeMod(block)}/from_ingots`)
                    }
                    if (checkItems(nugget) && checkTag(ingotTag) && checkTag(nuggetTag)) {
                        event.shapeless(`9x ${nugget}`, [ingotTag]).id(`unification:minecraft/shapeless/storage/${removeMod(nuggetID)}/from_ingot`)
                        event.shaped(ingot, ["NNN", "NNN", "NNN"], {N: nuggetTag}).id(`unification:minecraft/shaped/storage/${removeMod(ingot)}/from_nuggets`)
                    }
                }
            },
            storage_convert_all_custom: (event, material, blockRecipes, nuggetRecipes) => {
                let ingot = `unification:${material}_ingot`
                let block = blockRecipes===true ? `unification:${material}_block` : ""
                let nugget = nuggetRecipes===true ? `unification:${material}_nugget` : ""
                global.rp.minecraft.storage_convert(event, material, ingot, block, nugget)
            },
            storage_raw_convert: (event, material, raw, block) => {
                let rawTag = `#forge:raws/${material}`
                let blockTag = `#forge:raw_blocks/${material}`
                if (checkTag(rawTag) && checkTag(blockTag) && checkItems(raw) && checkItems(block)) {
                    event.shapeless(`9x ${raw}`, [blockTag]).id(`unification:minecraft/shapeless/storage/${removeMod(raw)}/from_block`)
                    event.shaped(block, ["III", "III", "III"], {I: rawTag}).id(`unification:minecraft/shaped/storage/${removeMod(block)}/from_raw_materials`)
                }
            },
            storage_raw_convert_all_custom: (event, material) => {
                let raw = `unification:${material}_raw`
                let block = `unification:${material}_raw_block`
                global.rp.minecraft.storage_raw_convert(event, material, raw, block)
            },
            smelting_recipes: (event, material, ingot, nugget, fromDustOnly) => {
                let types = ["dust", "gear", "plate", "rod", "wire"]
                let output = [ingot, `4x ${ingot}`, ingot, `4x ${nugget}`, `4x ${nugget}`]
                let xp = [0.1, 0, 0, 0, 0]
                types.forEach((type, i) => {
                    if (checkTag(`#forge:${type}s/${material}`)){
                        if(checkItems(output[i])){
                            event.smelting(output[i], `#forge:${type}s/${material}`).xp(xp[i]).id(`unification:minecraft/smelting/${removeMod(output[i])}/from_${type}`)
                            event.blasting(output[i], `#forge:${type}s/${material}`).xp(xp[i]).id(`unification:minecraft/blasting/${removeMod(output[i])}/from_${type}`)
                        }
                        if(fromDustOnly === true) return
                    }
                })
            },
            smelting_recipes_all_custom: (event, material, fromDustOnly) => {
                global.rp.minecraft.smelting_recipes(event, material, `unification:${material}_ingot`, `unification:${material}_nugget`, fromDustOnly)
            }
        }
    }
})