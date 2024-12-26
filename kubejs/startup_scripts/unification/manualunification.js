// priority: 140

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



function verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, id, removeId){
    for(let i = 0; i < inputsNeeded.length; i++) {
        if(!checkTag(inputsNeeded[i])) return
        inputsNeeded[i] = arrConvert(inputsNeeded[i])
        arrConvert(inputsOptional[i]).forEach(inputOptional => {
            if(checkTag(inputOptional)) inputsNeeded[i].push(inputOptional)
        })
    }
    if(removeId) event.remove({id: removeId})
    event.recipes.create.mixing(output, inputs).heated().id(id)
}

function verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, id, removeId, removeId2){
    for(let i = 0; i < inputsNeeded.length; i++) {
        if(!checkTag(inputsNeeded[i])) return
        inputsNeeded[i] = arrConvert(inputsNeeded[i])
        arrConvert(inputsOptional[i]).forEach(inputOptional => {
            if(checkTag(inputOptional)) inputsNeeded[i].push(inputOptional)
        })
    }
    if(removeId) event.remove({id: removeId})
    if(removeId2) event.remove({id: removeId2})
    if(inputsNeeded.length == 2){
        event.recipes.immersiveengineeringAlloy(output, inputsNeeded[0], inputsNeeded[1])
    }
    event.recipes.immersiveengineeringArcFurnace(output, inputsNeeded[0], inputsNeeded.slice(1)).id(id)
}

function verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, id, removeId){
    for(let i = 0; i < inputsNeeded.length; i++) {
        if(!checkTag(inputsNeeded[i])) return
        inputsNeeded[i] = arrConvert(inputsNeeded[i])
        arrConvert(inputsOptional[i]).forEach(inputOptional => {
            if(checkTag(inputOptional)) inputsNeeded[i].push(inputOptional)
        })
        inputsNeeded[i] = Ingredient.of(inputsNeeded[i]).withCount(Ingredient.of(inputsNeeded[i][0]).count)
    }
    if(removeId) event.remove({id: removeId})
    global.mrt.betterendforge.alloying(event, output, inputsNeeded, 0, 200, id)
}

function verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, id, removeId){
    for(let i = 0; i < inputsNeeded.length; i++) {
        if(!checkTag(inputsNeeded[i])) return
        inputsNeeded[i] = arrConvert(inputsNeeded[i])
        arrConvert(inputsOptional[i]).forEach(inputOptional => {
            if(checkTag(inputOptional)) inputsNeeded[i].push(inputOptional)
        })
    }
    if(removeId) event.remove({id: removeId})
    global.mrt.silent_mechanisms.alloy_smelting(event, output, inputsNeeded, 200, id)
}

function verifyAndAddThermalSmelter(event, output, inputsNeeded, inputsOptional, id, removeId){
    for(let i = 0; i < inputsNeeded.length; i++) {
        if(!checkTag(inputsNeeded[i])) return
        inputsNeeded[i] = arrConvert(inputsNeeded[i])
        arrConvert(inputsOptional[i]).forEach(inputOptional => {
            if(checkTag(inputOptional)) inputsNeeded[i].push(inputOptional)
        })
    }
    if(removeId) event.remove({id: removeId})
    event.recipes.thermal.smelter(output, inputsNeeded, id)
}

onEvent("loaded", e => {
    global.rp.manual = {
        alloy: {
            arcane_gold: (event, ingot) => {
                event.custom({
                    type: "eidolon:crucible",
                    result: {item: ingot, count: 2},
                    steps: [
                        {ingredients: [{tag: "forge:dusts/redstone"}, {tag: "forge:dusts/redstone"}, {item: "eidolon:soul_shard"}]},
                        {ingredients: [{tag: "forge:ingots/gold"}, {tag: "forge:ingots/gold"}]}
                    ]
                }).id("unification:eidolon/crucible/component/arcane_gold")
                event.remove({id: "eidolon:arcane_gold"})
            },
            brass: (event, ingot) => {
                let inputsNeeded = ["#forge:ingots/copper", "#forge:ingots/zinc"]
                let inputsOptional = ["#forge:dusts/copper", "#forge:dusts/zinc"]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, output, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`, 
                        "thermal:compat/create/smelter_create_alloy_brass")
                    event.remove("thermal:compat/silents_mechanisms/smelter_silents_mechanisms_alloy_brass")
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`, 
                        "thermal:compat/silents_mechanisms/smelter_silents_mechanisms_alloy_brass")
                }
            },
            bronze: (event, ingot) => {
                let inputsNeeded = ["3x #forge:ingots/copper", "#forge:ingots/tin"]
                let inputsOptional = ["3x #forge:dusts/copper", "#forge:dusts/tin"]
                let output = Item.of(ingot, 4)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`, "create:mechanical_crafting/integrated_circuit")
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`, 
                        "silents_mechanisms:alloy_smelting/bronze_ingot")
                }
            },
            constantan: (event, ingot) => {
                let inputsNeeded = ["#forge:ingots/copper", "#forge:ingots/nickel"]
                let inputsOptional = ["#forge:dusts/copper", "#forge:dusts/nickel"]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silent_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            },
            electrum: (event, ingot) => {
                let inputsNeeded = ["#forge:ingots/gold", "#forge:ingots/silver"]
                let inputsOptional = ["#forge:dusts/gold", "#forge:dusts/silver"]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`, 
                        "silents_mechanisms:alloy_smelting/electrum_ingot")
                }
            },
            enderium: (event, ingot, molten) => {
                let inputsNeeded = ["3x #forge:ingots/lead", "#forge:dusts/diamond", "2x minecraft:ender_pearl"]
                let inputsOptional = ["#forge:dusts/lead", "", "2x #forge:dusts/ender_pearl"]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:ender_pearl_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 288), [Fluid.of("tconstruct:molten_lead", 432), Fluid.of("tconstruct:molten_diamond", 144),
                        Fluid.of("unification:ender_pearl_molten", 500)], 800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                    event.remove({id: "tconstruct:smeltery/alloys/molten_enderium"})
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`,
                        "silents_mechanisms:alloy_smelting/enderium_ingot")
                }
            },
            ender_pearl: (event, dust) => {
                if(checkTag("#forge:ender_pearls")){
                    if(Platform.isLoaded("betterend")){
                        global.mrt.betterend.anvil_smithing(event, dust, "#forge:ender_pearls", 4, 1, 5, 
                            `unification:betterend/anvil_smithing/component/${removeMod(dust)}/from_ender_pearl`)
                        global.mrt.betterend.anvil_smithing(event, dust, "betterendforge:ender_shard", 0, 1, 3,
                            `unification:betterend/anvil_smithing/component/${removeMod(dust)}/from_ender_shard`)
                        event.remove({id: "betterend:ender_pearl_to_dust"})
                        event.remove({id: "betterend:ender_shard_to_dust"})
                    }
                    if(Platform.isLoaded("lazierae2")){
                        global.mrt.lazierae2.centrifuge(event, dust, "#forge:ender_pearls", 80, 800, `unification:lazierae2/centrifuge/component/${removeMod(dust)}/from_ender_pearl`)
                        global.mrt.lazierae2.aggregator(event, "lazierae2:resonating_gem", ["appliedenergistics2:sky_dust", "#forge:gems/diamond", "forge:dusts/ender_pearl"],
                            120, 2000, `unification:lazierae2/aggregator/component/resonating_gem/from_sky_dust`)                        
                        event.remove({id: "appliedenergistics2:centrifuge/ender_dust"})
                        event.remove({id: "lazierae2:aggregator/resonating_gem"})
                    }
                }
                if(Platform.isLoaded("thermal") && !Fluid.of("unification:ender_pearl_molten").isEmpty()){
                    event.recipes.thermal.crucible(Fluid.of("unification:ender_pearl_molten", 250), "minecraft:ender_pearl").energy(8000)
                        .id(`unification:thermal/crucible/component/ender_pearL_molten/from_gem`)
                    event.remove("thermal:machine/crucible/crucible_ender_pearl")

                    event.recipes.thermal.chiller("minecraft:ender_pearl", [Fluid.of("unification:ender_pearl_molten", 144), "thermal:chiller_ball:blast"]).energy(72000)
                        .id(`unification:thermal/chiller/component/ender_pearl/from_molten`)
                    event.remove("thermal:machine/chiller/chiller_endere_to_ender_pearl")
                }
            },
            flour: (event, flour) => {
                if(checkTag("#forge:crops/wheat")){
                    if(Platform.isLoaded("lazierae2")){
                        global.mrt.lazierae2.centrifuge(event, flour, "#forge:crops/wheat", 30, 250, `unification:lazierae2/centrifuge/component/${removeMod(flour)}/from_wheat`)
                        event.remove({id: "appliedenergistics2:centrifuge/flour"})
                    }
                    if(Platform.isLoaded("pneumaticcraft")){
                        global.mrt.pneumaticcraft.explosion_crafting(event, flour, "#forge:crops/wheat", 50, `unification:pneumaticcraft/explosion_crafting/component/${removeMod(flour)}/from_wheat`)
                        global.mrt.pneumaticcraft.pressure_chamber(event, Item.of(flour, 3), "#forge:crops/wheat", 1.5, 
                            `unification:pneumaticcraft/pressure_chamber/component/${removeMod(flour)}/from_wheat`)
                        event.remove({id: "pneumaticcraft:explosion_crafting/wheat_flour"})
                        event.remove({id: "pneumaticcraft:pressure_chamber/wheat_flour"})
                    }
                    if(Platform.isLoaded("nuclearcraft")){
                        //todo: flour
                    }
                }
            },
            invar: (event, ingot) => {
                let inputsNeeded = ["2x #forge:ingots/iron", "#forge:ingots/nickel"]
                let inputsOptional = ["2x #forge:dusts/iron", "#forge:dusts/nickel"]
                let output = Item.of(ingot, 3)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`, 
                        "silents_mechanisms:alloy_smelting/invar_ingot")
                }
            },
            lumium: (event, ingot) => {
                let inputsNeeded = ["3x #forge:ingots/silver", "#forge:ingots/tin", "2x #forge:dusts/glowstone"]
                let inputsOptional = ["3x #forge:dusts/silver", "#forge:dusts/tin", ""]
                let output = Item.of(ingot, 4)
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, Item.of(ingot, 4), ["3x #forge:ingots/silver", "#forge:ingots/tin", "2x #forge:dusts/glowstone"],
                        ["3x #forge:dusts/silver", "#forge:dusts/tin", ""], `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`,
                        "silents_mechanisms:alloy_smelting/lumium_ingot")
                }
            },
            obsidian: (event, dust) => {
                if(Platform.isLoaded("exnihilosequentia")){
                    global.mrt.exnihilosequentia.hammer(event, Item.of(dust, 4), "#forge:obsidian", `unification:exnihilosequentia/hammer/component/${removeMod(dust)}/from_obsidian`)
                    event.remove({id: "exnihilothermal:hammer/ens_dust_obsidian"})
                }
                if(Platform.isLoaded("nuclearcraft")){
                    //todo: gem_dust_obsidian
                }
            },
            red_alloy: (event, ingot, molten) => {
                let inputsNeeded = ["#forge:ingots/iron", "4x #forge:dusts/redstone"]
                let inputsOptional = [["#forge:ingots/copper", "#forge:dusts/iron", "#forge:dusts/copper"], ""]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") &&!Fluid.of("unification:redstone_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 288), [Fluid.of("tconstruct:molten_iron", 144), Fluid.of("unification:redstone_molten", 576)], 
                        800, `unification:tconstruct/alloy/component/${removeMod(molten)}/from_iron`)
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 288), [Fluid.of("tconstruct:molten_copper", 144), Fluid.of("unification:redstone_molten", 576)], 
                        800, `unification:tconstruct/alloy/component/${removeMod(molten)}/from_copper`)
                }
                if(Platform.isLoaded("immersiveengineering")){  
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`, 
                        "silents_mechanisms:alloy_smelting/red_alloy_ingot")
                }
            },
            salt: (event, salt) => {
                if(Platform.isLoaded("exnihilosequentia")){
                    global.mrt.exnihilosequentia.sieve(event, salt, "minecraft:sand", [["flint", 0.01], ["iron", 0.02], ["diamond", 0.4]], false
                        `unification:exnihilosequentia/sieve/component/${removeMod(salt)}/from_sand`)
                    event.remove({id: "exnihilomekanism:sieve/ens_piece_osmium_3"})
                }
            },
            signalum: (event, ingot, molten) => {
                let inputsNeeded = ["#forge:ingots/copper", "3x #forge:ingots/silver", "4x minecraft:redstone"]
                let inputsOptional = ["#forge:dusts/copper", "3x #forge:dusts/silver", ""]
                let output = Item.of(ingot, 4)
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:redstone_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 576), [Fluid.of("tconstruct:molten_copper", 144), Fluid.of("tconstruct:molten_copper", 432),
                        Fluid.of("unification:redstone_molten", 576)], 800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                    event.remove({id: "tconstruct:smeltery/alloys/molten_signalum"})
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`,
                        "silents_mechanisms:alloy_smelting/signalum_ingot")
                }
            },
            silicon: (event) => {
                if(checkTag("#forge:gems/silicon")){
                    if(Platform.isLoaded("appliedenergistics2")){
                        event.remove({id: "appliedenergistics2:inscriber/silicon_print"})
                        global.mrt.appliedenergistics2.inscriber(event, "appliedenergistics2:printed_silicon", ["appliedenergistics2:silicon_press", "#forge:gems/silicon"], true, 
                            `unification:appliedenergistics2/inscriber/component/printed_silicon/from_gem`)
                    }
                    if(Platform.isLoaded("lazierae2")){
                        event.remove({id: "lazierae2:aggregator/carbonic_fluix_dust"})
                        global.mrt.lezierae2.aggregator(event, "lazierae2:carbonic_fluix_dust", ["#forge:dusts/coal", "#forge:dusts/fluix", "#forge:gems/silicon"], 30, 300,
                            `unification:lazierae2/aggregator/component/carbonic_fluix_dust`)
                        
                        event.remove({id: "appliedenergistics2:etcher/calculation_processor"})
                        global.mrt.lazierae2.etcher(event, "appliedenergistics2:calculation_processor", ["appliedenergistics2:purified_certus_quartz_crystal", "#forge:dusts/redstone", 
                            "#forge:gems/silicon"], 100, 1000, `unification:lazierae2/etcher/component/calculation_processor`)
                        event.remove({id: "appliedenergistics2:etcher/engineering_processor"})
                        global.mrt.lazierae2.etcher(event, "appliedenergistics2:engineering_processor", ["#forge:gems/diamond", "#forge:dusts/redstone", "#forge:gems/silicon"], 100, 1000,
                            `unification:lazierae2/etcher/component/engineering_processor`)
                        event.remove({id: "appliedenergistics2:etcher/logic_processor"})
                        global.mrt.lazierae2.etcher(event, "appliedenergistics2:logic_processor", ["#forge:ingots/gold", "#forge:dusts/redstone", "#forge:gems/silicon"], 100, 1000,
                            `unification:lazierae2/etcher/component/logic_processor`)
                        
                        event.remove({id: "lazierae2:etcher/parallel_processor"})
                        global.mrt.lazierae2.etcher(event, "lazierae2:parallel_processor", ["#forge:gems/resonating", "#forge:dusts/redstone", "#forge:gems/silicon"], 150, 1500,
                            `unification:lazierae2/etcher/component/parallel_processor`)
                        event.remove({id: "lazierae2:etcher/speculative_processor"})
                        global.mrt.lazierae2.etcher(event, "lazierae2:speculative_processor", ["lazierae2:speculation_core_64", "#forge:dusts/redstone", "#forge:gems/silicon"], 150, 1500,
                            `unification:lazierae2/etcher/component/speculative_processor`)
                    }
                    if(Platform.isLoaded("nuclearcraft")){
                        // todo: gem_silicon
                    }
                }
            },
            steel: (event, ingot) => {
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, Item.of(ingot, 2), ["2x #forge:ingots/iron", "2x #forge:dusts/coal"], ["2x #forge:dusts/iron", ""],
                        `unification:silent_mechanisms/alloy_smelting/component/${removeMod(ingot)}`, "silents_mechanisms:alloy_smelting/steel_ingot")
                }
            },
            wood: (event, dust, gear) => {
                event.shaped(gear, [" W ", "WWW", " W "], {W: "#minecraft:planks"}).id(`unification:minecraft/shaped/component/${removeMod(gear)}/from_wood`)
                if(Platform.isLoaded("thermal")){
                    event.recipes.thermal.pulverizer(["minecraft:diamond", dust], "#forge:tools/diamond").energy(4000)
                        .id(`unification:thermal/pulverizer/component/diamond/from_tools`)
                    event.remove({id: "thermal:machine/pulverizer/pulverizer_diamond_tools"})
                }
                if(Platform.isLoaded("excompressum")){
                    event.custom({
                        type: "excompressum:hammer",
                        input: {
                          tag:"minecraft:logs"
                        },
                        lootTable: {
                            type: "minecraft:block",
                            pools: [{
                                rolls: 1,
                                entries: [{
                                    type: "minecraft:item",
                                    name: dust,
                                    functions: [{
                                        function: "minecraft:set_count",
                                        count: {
                                            min: 2.0,
                                            max: 4.0,
                                            type: "minecraft:uniform"
                                        }
                                    },{
                                        function: "minecraft:apply_bonus",
                                        enchantment: "minecraft:fortune",
                                        formula: "minecraft:uniform_bonus_count",
                                        parameters: {
                                            bonusMultiplier: 1
                                        }
                                    }]
                                }],
                                conditions: []
                            }]
                        }
                    }).id(`unification:excompressum/hammer/component/${removeMod(dust)}/from_logs`)
                    event.remove({id: "excompressum:hammer/logs"})
                }
            }
        },
        appliedenergistics2: {
            fluix: (event, gem, molten) => {
                let inputsNeeded = ["#forge:gems/charged_certus_quartz", "#forge:gems/quartz", "#forge:dusts/redstone"]
                let inputsOptional = ["#forge:dusts/charged_certus_quartz", "#forge:gems/quartz", ""]
                let output = Item.of(gem, 2)
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(gem)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:charged_certus_quartz_molten").isEmpty() && !Fluid.of("unification:redstone_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 288), [Fluid.of("unification:charged_certus_quartz_molten", 144), Fluid.of("tconstruct:molten_quartz", 144), 
                        Fluid.of("unification:redstone_molten", 144)], 800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, output, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(gem)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silent_mechanisms/alloy_smelting/component/${removeMod(gem)}`)
                }
            }
        },
        astralsorcery: {
            aquamarine: (event) => {
                let output
                if(Item.of("unification:aquamarine_ore_minecraft_sand").isEmpty()){
                    output = Item.of("#forge:ores/aquamarine")
                }else{
                    output = Item.of("unification:aquamarine_ore_minecraft_sand")
                }
                global.mrt.astralsorcery.liquid_interaction(event, output, [Fluid.of("astralsorcery:liquid_starlight", 10), 0.5], [Fluid.of("minecraft:lava", 10), 0.5], 1
                    `unification:astralsorcery/liquid_interaction/component/aquamarine_ore/from_starlight_and_lava`)
                event.remove({id: "astralsorcery:liquid_interaction/liquidstarlight_lava_aquamarine"})
            },
            starmetal: (event) => {
                Ingredient.of("#forge:ores/iron").itemIds.forEach(iron => {
                    if(!Item.of(iron.replace("iron", "starmetal")).isEmpty()){
                        global.mrt.astralsorcery.block_transmutation(event, iron.replace("iron", "starmetal"), iron, 100,
                            `unification:astralsorcery/block_transmutation/component/${removeMod(iron.replace("iron", "starmetal"))}/from_iron`)
                    }
                })
                event.remove({id: "astralsorcery:block_transmutation/iron_starmetal"})
            }
        },
        atum: {
            nebu: (event, ingot, nugget, dust, molten, gravel, fragment, crushed_ore, dirty_dust, clump, shard, crystal, clean_slurry, dirty_slurry) => {
                event.remove({id: "atum:nebu_drop"})
                event.remove({id: "atum:nebu_drop_from_blasting"})
                ['#forge:ores/nebu', '#forge:raw_materials/nebu'].forEach((input, i) => {
                    if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                    if (checkTag(input) && checkItems(nugget)) {
                        event.smelting(Item.of(nugget, 3), input).xp(1).id(`unification:minecraft/smelting/ore_processing/${removeMod(nugget)}/from_${["ore", "raw_material"][i]}`)
                        event.blasting(Item.of(nugget, 3), input).xp(1).id(`unification:minecraft/blasting/ore_processing/${removeMod(nugget)}/from_${["ore", "raw_material"][i]}`)
                    }
                })
                if(Platform.isLoaded("astralsorcery")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                        if (checkTag(input) && checkItems(nugget) && checkItems(ingot)) {
                            global.mrt.astralsorcery.infuser(event, Item.of(i===2 ? ingot : nugget, nUni ? 6 : 9 ), input, 100,  i===2 ? 0.7 : 0.1, [true], 
                                "astralsorcery:liquid_starlight", `unification:astralsorcery/infuser/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block"][i]}`)
                        }
                    })
                }
                if(Platform.isLoaded("betterendforge")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input) && checkItems(ingot) && checkItems(nugget)) {
                            let nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            global.mrt.betterendforge.alloying(event, Item.of(i===2 ? ingot : nugget, nUni ? 9 : 12), [input, input], i===2 ? 18 : 2, i===2 ? 1800 : 200, 
                                `unification:betterendforge/alloying/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block"][i]}`)
                        }
                    })
                }
                if(Platform.isLoaded("bloodmagic")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            if(checkItems(dust)){
                                countOut = [[[1, 0.5], [2, 0]], [[1, 0.5], [2, 0]], [[13, 0.5], [18, 0]]][i][nUni ? 0 : 1]
                                event.recipes.bloodmagic.arc(
                                    Item.of(dust, countOut[0]), Item.of(input, 3), "#bloodmagic:arc/cuttingfluid", 
                                    countOut[1]!==0 ? [Item.of(dust).withChance(countOut[1])] : []).consumeIngredient(false)
                                    .id(`unification:bloodmagic/arc/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
                            
                            if(checkItems([gravel, fragment])){
                                countOut = [[2, 3], [2, 3], [18, 27]][i][nUni ? 0 : 1]
                                event.recipes.bloodmagic.arc(Item.of(fragment, countOut), Item.of(input, 3), "#bloodmagic:arc/explosive")
                                    .consumeIngredient(false).id(`unification:bloodmagic/arc/ore_processing/${removeMod(fragment)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
    
                            if (checkItems(dust)) {
                                event.recipes.bloodmagic.alchemytable(Item.of(dust, (nUni ? 1 : 2) * (i===2 ? 9 : 1)), ["#bloodmagic:arc/cuttingfluid", input, input, input, input, input, input].slice(0, nUni ? 3 : 4))
                                    .syphon(i===2 ? 3600 : 400).ticks(200).upgradeLevel(1)
                                    .id(`unification:bloodmagic/alchemytable/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
                        }
                        if(checkItems([gravel, fragment])){
                            event.recipes.bloodmagic.arc(gravel, fragment, "#bloodmagic:arc/resonator", [Item.of("bloodmagic:corrupted_tinydust").withChance(0.05),
                                Item.of("bloodmagic:corrupted_tinydust").withChance(0.01)]).consumeIngredient(false)
                                .id(`unification:bloodmagic/arc/ore_processing/${removeMod(gravel)}/from_fragment`)
                            event.recipes.bloodmagic.arc(dust, gravel, "#bloodmagic:arc/cuttingfluid").consumeIngredient(false)
                                .id(`unification:bloodmagic/arc/ore_processing/${removeMod(dust)}/from_gravel`)
                        }
                    })
    
                }
                if(Platform.isLoaded("create")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input) && checkItems(crushed_ore)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune

                            countOut = [[[0, 0.4667], [0, 0.6667]], [[0, 0.4667], [0, 0.6667]], [[4, 0.2], [6, 0]], [[0, 0.1167], [0, 0.1667]]][i][nUni ? 0 : 1]
                            event.recipes.createCrushing(
                                [Item.of(crushed_ore, countOut[0]), Item.of(crushed_ore).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, countOut[1]===0 ? 1 : 2)
                                .concat([Item.of("minecraft:cobblestone").withChance(0.125)]), input)
                                .id(`unification:create/crushing/ore_processing/${removeMod(crushed_ore)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
    
                            countOut = [0.33, 0.33, 3, 0.0833][i]
                            event.recipes.createMilling(Number.isInteger(countOut) ? Item.of(crushed_ore, countOut) : Item.of(crushed_ore).withChance(countOut), input)
                                .id(`unification:create/milling/ore_processing/${removeMod(crushed_ore)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    })
                    if (checkTag('#forge:crushed_ores/nebu') && checkItems(nugget)) {
                        event.smelting(Item.of(nugget, 3), '#forge:crushed_ores/nebu').xp(0.1).id(`unification:minecraft/smelting/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                        event.blasting(Item.of(nugget, 3), '#forge:crushed_ores/nebu').xp(0.1).id(`unification:minecraft/blasting/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                        event.recipes.createSplashing([`3x ${nugget}`, Item.of(nugget, 2).withChance(0.6)], '#forge:crushed_ores/nebu')
                            .id(`unification:create/milling/ore_processing/${removeMod(nugget)}/from_crushed_ore`)
                    }
                }
                if(Platform.isLoaded("engineerstools")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input) && checkItems(dust)) {
                            if (!(input==='#forge:ores/nebu') && metal_ore_drops_fortune){
                                countOut = [1, 1, 9, 1][i]
                                event.shapeless(Item.of(dust, countOut), 
                                    [Item.of("engineerstools:crushing_hammer").ignoreNBT(), input, input, input, input, input, input, input, input].slice(0, i===3 ? 9 : 3))
                                    .damageIngredient(Item.of("engineerstools:crushing_hammer").ignoreNBT(), [10, 10, 90, 5][i])
                                    .id(`unification:minecraft/shapeless/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}/with_engineerstools_crushing_hammer`)
                            } else {
                                countOut = [2, 2, 18, 1][i]
                                countIn = [3, 3, 3, 6]
                                event.shapeless(Item.of(dust, countOut), [Item.of("engineerstools:crushing_hammer").ignoreNBT(), input, input, input, input, input, input].slice(0, countIn[i] + 1))
                                    .damageIngredient(Item.of("engineerstools:crushing_hammer").ignoreNBT(), [10, 10, 90, 5][i])
                                    .id(`unification:minecraft/shapeless/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}/with_engineerstools_crushing_hammer`)
                            }
                        }
                    })
                }
                if(Platform.isLoaded("ftbic")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input) && checkItems(dust)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            countOut = [[[0, 0.4667], [0, 0.6667]], [[0, 0.4667], [0, 0.6667]], [[4, 0.2], [6, 0]], [[0, 0.1167], [0, 0.1667]]][i][nUni ? 0 : 1]
                            global.mrt.ftbic.macerating(event, [Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, countOut[1]===0 ? 1 : 2), input, 
                                `unification:ftbic/macerating/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    })
                }
                if(Platform.isLoaded("immersiveengineering")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
    
                            if(checkItems(dust)){
                                event.shapeless(Item.of(dust, [1, 1, 9][i]), [Item.of("immersiveengineering:hammer").ignoreNBT(), input, input, input])
                                    .damageIngredient(Item.of("immersiveengineering:hammer").ignoreNBT(), [1, 1, 9, 1][i])
                                    .id(`unification:minecraft/shapeless/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}/with_immersiveengineering_hammer`)
                                countOut = [[[1, 0.5], [2, 0]], [[1, 0.5], [2, 0]], [[13, 0.5], [18, 0]]][i][nUni ? 0 : 1]
                                event.recipes.immersiveengineeringCrusher(Item.of(dust, countOut[0]), Item.of(input, 3), countOut[1]!=0 ? [Item.of(dust).withChance(countOut[1])] : [])
                                    .id(`unification:immersiveengineering/crusher/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
    
                            if(checkItems(ingot)){
                                countOut = [[2, 3], [2, 3], [18, 27]][i][nUni ? 0 : 1]
                                event.recipes.immersiveengineeringArcFurnace(Item.of(ingot, countOut), Item.of(input, 3))
                                    .id(`unification:immersiveengineering/arc_furnace/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
                        }
                    })
                }
                if(Platform.isLoaded("integrateddynamics")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input) && checkItems(dust)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            if (nUni) {
                                countOut = [[0, 0.5], [0, 0.5], [4, 0.5], [0, 0.125]][i]
                                global.mrt.integrateddynamics.squeezer(event, [Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), "", input,
                                    `unification:integrateddynamics/squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
    
                                countOut = [0.667, 0.667, 6, 0.1667][i]  
                                global.mrt.integrateddynamics.mechanical_squeezer(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut)], "", input, 40,
                                    `unification:integrateddynamics/mechanical_squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            } else {
                                countOut = [0.667, 0.667, 6, 0.1667][i]
                                global.mrt.integrateddynamics.squeezer(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut)], "", input,
                                    `unification:integrateddynamics/squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                                
                                countOut = [1, 1, 9, 0.2222][i]
                                global.mrt.integrateddynamics.mechanical_squeezer(event, Item.of(dust, countOut), "", input, 40,
                                    `unification:integrateddynamics/mechanical_squeezer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
                        }
                    })
                }
                if(Platform.isLoaded("mekanism")){
                    let names = [dirty_dust, clump, shard, crystal, clean_slurry, dirty_slurry];
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            if(checkItems(dust)){
                                countIn = [[9, 3], [9, 3], [1, 1], [9, 6]][i][nUni ? 0 : 1]
                                countOut = [[4, 2], [4, 2], [4, 6], [1, 1]][i][nUni ? 0 : 1]
                                global.mrt.mekanism.enriching(event, Item.of(dust, countOut), Ingredient.of(input, countIn), 
                                    `unification:mekanism/enriching/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
    
                            if(checkItems([dust].concat(names.slice(0, 2)))){
                                countIn = [[3, 1], [3, 1], [1, 1], [6, 4]][i][nUni ? 0 : 1]
                                countOut = [[2, 1], [2, 1], [6, 9], [1, 1]][i][nUni ? 0 : 1]
                                global.mrt.mekanism.purifying(event, Item.of(clump, countOut), Ingredient.of(input, countIn), ['mekanism:oxygen', [200, 200, nUni ? 600 : 1800, nUni ? 100 : 200][i][i]], 
                                    `unification:mekanism/purifying/ore_processing/${removeMod(clump)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
    
                            if(checkItems([dust].concat(names.slice(0, 3)))){
                                countIn = [[9, 3], [9, 3], [1, 1], [9, 3]][i][nUni ? 0 : 1]
                                countOut = [[8, 4], [8, 4], [8, 12], [2, 1]][i][nUni ? 0 : 1]
                                global.mrt.mekanism.injecting(event, Item.of(shard, countOut), Ingredient.of(input, countIn), ['mekanism:hydrogen_chloride', [600, 600, nUni ? 600 : 1800, 150][i]], 
                                    `unification:mekanism/injecting/ore_processing/${removeMod(shard)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
    
                            countIn = [[9, 3], [9, 3], [1, 1], [9, 3]][i][nUni ? 0 : 1]
                            countOut = [[2000, 1000], [2000, 1000], [2000, 3000], [500, 250]][i][nUni ? 0 : 1]
                            global.mrt.mekanism.dissolution(event, [dirty_slurry, countOut], Ingredient.of(input, countIn), ['mekanism:sulfuric_acid', [300, 300, nUni ? 300 : 900, 75][i]],
                                `unification:mekanism/dissolution/ore_processing/${removeMod(dirty_slurry)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    })
                    
                    if(checkTag('#forge:dirty_dusts/nebu') && checkItems(dust)){
                            global.mrt.mekanism.enriching(event, dust, '#forge:dirty_dusts/nebu', `unification:mekanism/enriching/ore_processing/${removeMod(dust)}/from_dirty_dust`)
                    }
                    if(checkTag('#forge:clumps/nebu') && checkItems([dust].concat(names.slice(0, 1)))){
                        global.mrt.mekanism.crushing(event, dirty_dust, '#forge:clumps/nebu', `unification:mekanism/crushing/ore_processing/${removeMod(dirty_dust)}/from_clump`)
                    }
                    if(checkTag('#forge:clumps/nebu') && checkItems([dust].concat(names.slice(0, 2)))){
                        global.mrt.mekanism.purifying(event, clump, '#forge:shards/nebu', 'mekanism:oxygen', `unification:mekanism/purifying/ore_processing/${removeMod(clump)}/from_shard`)
                    }
                    if(checkTag('#forge:clumps/nebu') && checkItems([dust].concat(names.slice(0, 3)))){
                        global.mrt.mekanism.injecting(event, shard, '#forge:crystals/nebu', 'mekanism:hydrogen_chloride',
                            `unification:mekanism/injecting/ore_processing/${removeMod(shard)}/from_crystal`)
                    }
                    global.mrt.mekanism.crystallizing(event, crystal, [clean_slurry, 200], `unification:mekanism/crystallizing/ore_processing/${removeMod(crystal)}/from_clean_slurry`)
                    global.mrt.mekanism.washing(event, clean_slurry, ["#minecraft:water", 5], dirty_slurry, `unification:mekanism/washing/ore_processing/${removeMod(clean_slurry)}/from_dirty_slurry`)
                }
                if(Platform.isLoaded("occultism")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input) && checkItems(dust)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            countOut = [[0.6667, 1], [0.6667, 1], [6, 9], [0.1667, 0.25]][i][nUni ? 0 : 1]
                            global.mrt.occultism.crushing(event, Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut), input, 
                                `unification:occultism/crushing/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    })
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input) && checkItems(dust)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            if (nUni){
                                countOut = [[0, 0.4667], [0, 0.4667], [4, 0.2], [0, 0.1167]][i]
                                global.mrt.silents_mechanisms.crushing(event, [Item.of(dust, countOut[0]), Item.of(dust).withChance(countOut[1])].slice(countOut[0]===0 ? 1 : 0, 2), input, 200, 
                                    `unification:silents_mechanisms/crushing/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            } else {
                                countOut = [0.667, 0.667, 3, 0.1667][i]
                                global.mrt.silents_mechanisms.crushing(event, [Number.isInteger(countOut) ? Item.of(dust, countOut) : Item.of(dust).withChance(countOut), 
                                    Item.of("minecraft:cobblestone").withChance(0.1)].slice(0, i === 0 ? 2 : 1), 
                                    input, 200, `unification:silents_mechanisms/crushing/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                            }
                        }
                    })
                }
                if(Platform.isLoaded("tconstruct")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input) && !Fluid.of(molten).equals(Fluid.empty)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            countOut = [[48, 64], [48, 64], [432, 576], [12, 16]][i][nUni ? 0 : 1]
                            global.mrt.tconstruct.ore_melting(event, Fluid.of(molten, countOut), [], input, 800, 100, 
                                `unification:tconstruct/melting/ore_processing/${removeMod(molten)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                        }
                    })
                }
                if(Platform.isLoaded("thermal")){
                    ['#forge:ores/nebu', '#forge:raw_materials/nebu', '#forge:raw_blocks/nebu', '#forge:pieces/nebu'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/nebu' || input == '#forge:raw_blocks/nebu')) return
                        if (checkTag(input)) {
                            nUni = !(input==='#forge:ores/nebu') && metal_ore_drops_fortune
                            if (nUni) {
                                if(checkItems(ingot)){
                                    countOut = [0.433333 , 0.433333, 3.900001, 0.108333][i]
                                    event.recipes.thermal.smelter(Item.of(ingot).withChance(countOut), input).energy(3200)
                                        .id(`unification:thermal/smelter/ore_processing/${removeMod(ingot)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                                }
    
                                if(checkItems(dust)){
                                    countOut = [0.500001, 0.500001, 4.500001, 0.125][i]
                                    event.recipes.thermal.pulverizer(Item.of(dust).withChance(countOut), input).energy(4000)
                                        .id(`unification:thermal/pulverizer/ore_processing/${removeMod(dust)}/from_${["ore", "raw_material", "raw_block", "piece"][i]}`)
                                }
                            } else {
                                if (input==='#forge:ores/nebu') {
                                    if(checkItems(ingot)){
                                        event.recipes.thermal.smelter([`6x ${nugget}`, Item.of('thermal:rich_slag').withChance(0.2)], input).energy(3200)
                                            .id(`unification:thermal/smelter/ore_processing/${removeMod(ingot)}/from_ore`)
                                    }
                                    if(checkItems(dust)){
                                        event.recipes.thermal.pulverizer([`6x ${nugget}`, Item.of('minecraft:gravel').withChance(0.2)], input).energy(4000)
                                            .id(`unification:thermal/pulverizer/ore_processing/${removeMod(dust)}/from_ore`)
                                    }
                                } else {
                                    countOut = [, 0.6667, 6, 0.1667][i]
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
                }
            }
        },
        betterendforge: {
            aeternium: (event, ingot, molten) => {
                let inputsNeeded = ["#forge:ingots/terminite", "#forge:ingots/netherite"]
                let inputsOptional = ["#forge:dusts/terminite", "#forge:dusts/netherite"]
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, ingot, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:terminite_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 144), [Fluid.of("unification:terminite_molten", 144), Fluid.of("tconstruct:molten_netherite", 144)], 800, 
                        `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, ingot, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`,
                        "thermal:compat/betterendforge/smelter_betterendforge_aeternium_ingot")
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            },
            amber: (event, raw_material) => {
                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "amber", raw_material, 1)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "amber", raw_material, 1)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "amber", raw_material, 1)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "amber", raw_material, 1)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "amber", raw_material, 1)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "amber", raw_material, 1)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "amber", raw_material, 1)
                global.rp.minecraft.ore_processing_gem(event, "amber", raw_material, 1)
            },
            terminite: (event, ingot, molten) => {
                let inputsNeeded = ["#forge:ingots/iron", "#forge:dusts/ender_pearl"]
                let inputsOptional = [["#forge:ingots/thallasium", "#forge:dusts/iron", "#forge:dusts/thallasium"], ""]
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, ingot, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct")){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 144), [Fluid.of("tconstruct:molten_iron", 144), Fluid.of("tconstruct:molten_ender", 144)], 800, 
                        `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                    if(!Fluid.of("unification:thallasium_molten").isEmpty()){
                        global.mrt.tconstruct.alloy(event, Fluid.of(molten, 144), [Fluid.of("unification:thallasium_molten", 144), Fluid.of("tconstruct:molten_ender", 144)], 800, 
                            `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                    }
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, ingot, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`,
                        "thermal:compat/betterendforge/smelter_betterendforge_terminite_ingot")
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            }
        },
        boss_tools: {
            desh: (event, wire, molten) => {
                if(Platform.isLoaded("tconstruct")){
                    if(checkTag('#forge:wires/desh')){
                        global.mrt.tconstruct.melting(event, Fluid.of(molten, 72), '#forge:wires/desh', 800, 43, 
                            `unification:tconstruct/melting/component/${removeMod(molten)}/from_wire`)
                    }
                    global.mrt.tconstruct.casting(event, wire, [molten, 72], '#tconstruct:casts/multi_use/wire', false, false, 43, 
                        `unification:tconstruct/casting/component/${removeMod(wire)}/from_molten/multi_use`)
                    global.mrt.tconstruct.casting(event, wire, [molten, 72], '#tconstruct:casts/single_use/wire', false, true, 43, 
                        `unification:tconstruct/casting/component/${removeMod(wire)}/from_molten/single_use`)
                }
            },
            silicon: (event, wire, molten) => {
                if(Platform.isLoaded("tconstruct")){
                    if(checkTag('#forge:wires/silicon')){
                        global.mrt.tconstruct.melting(event, Fluid.of(molten, 72), '#forge:wires/silicon', 800, 43, 
                            `unification:tconstruct/melting/component/${removeMod(molten)}/from_wire`)
                    }
                    global.mrt.tconstruct.casting(event, wire, [molten, 72], '#tconstruct:casts/multi_use/wire', false, false, 43, 
                        `unification:tconstruct/casting/component/${removeMod(wire)}/from_molten/multi_use`)
                    global.mrt.tconstruct.casting(event, wire, [molten, 72], '#tconstruct:casts/single_use/wire', false, true, 43, 
                        `unification:tconstruct/casting/component/${removeMod(wire)}/from_molten/single_use`)
                }
            }
        },
        byg: {
            pendorite: (event, ingot) => {
                let inputsNeeded = ["4x #forge:parts/pendorite_scraps", "2x #forge:gems/diamond", "2x #forge:gems/emeraldite"]
                let inputsOptional = ["4x #forge:dusts/pendorite_scraps", "2x #forge:dusts/diamond", "2x #forge:dusts/emeraldite"]
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, ingot, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, ingot, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            },
            pendorite_scraps: (event, ingot, crushed_ore) => {
                if(Platform.isLoaded("create")){
                    ['#forge:ores/pendorite_scraps', '#forge:raw_materials/pendorite_scraps', '#forge:raw_blocks/pendorite_scraps', '#forge:pieces/pendorite_scraps'].forEach((input, i) => {
                        if(!enable_raw_recipes && (input == '#forge:raw_materials/pendorite_scraps' || input == '#forge:raw_blocks/pendorite_scraps')) return
                        if (checkTag(input) && checkItems(crushed_ore)) {
                            nUni = !(input==='#forge:ores/pendorite_scraps') && metal_ore_drops_fortune
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
                    
                    if (checkTag('#forge:crushed_ores/pendorite_scraps')) {
                        if(checkItems(ingot)){
                            event.smelting(ingot, '#forge:crushed_ores/pendorite_scraps').xp(0.1).id(`unification:minecraft/smelting/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                            event.blasting(ingot, '#forge:crushed_ores/pendorite_scraps').xp(0.1).id(`unification:minecraft/blasting/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                        }
                        if(checkItems(nugget)){
                            event.recipes.createSplashing([ingot, Item.of(ingot).withChance(0.4)], '#forge:crushed_ores/pendorite_scraps')
                                .id(`unification:create/milling/ore_processing/${removeMod(ingot)}/from_crushed_ore`)
                        }
                    }
                }
            }
        },
        create: {
            andesite_alloy: (event, ingot) => {
                let inputsNeeded = ["minecraft:andesite", "#forge:nuggets/iron"]
                let inputsOptional = ["", "#forge:nuggets/zinc"]
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, ingot, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            },
            chromatic_compound: (event, ingot) => {
                let inputsNeeded = ["3x #forge:dusts/glowstone", "3x #forge:dusts/obsidian  ", "create:polished_rose_quartz"]
                let inputsOptional = ["", "", ""]
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, ingot, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            }
        },
        divinerpg: {
            apalachia: (event, fragments) => {
                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "apalachia", fragments, 1)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "apalachia", fragments, 1)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "apalachia", fragments, 1)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "apalachia", fragments, 1)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "apalachia", fragments, 1)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "apalachia", fragments, 1)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "apalachia", fragments, 1)
                global.rp.minecraft.ore_processing_gem(event, "apalachia", fragments, 1)
            },
            eden: (event, fragments) => {
                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "eden", fragments, 1)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "eden", fragments, 1)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "eden", fragments, 1)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "eden", fragments, 1)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "eden", fragments, 1)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "eden", fragments, 1)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "eden", fragments, 1)
                global.rp.minecraft.ore_processing_gem(event, "eden", fragments, 1)
            },
            mortum: (event, fragments) => {
                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "mortum", fragments, 1)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "mortum", fragments, 1)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "mortum", fragments, 1)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "mortum", fragments, 1)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "mortum", fragments, 1)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "mortum", fragments, 1)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "mortum", fragments, 1)
                global.rp.minecraft.ore_processing_gem(event, "mortum", fragments, 1)
            },            
            skythern: (event, fragments) => {
                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "skythern", fragments, 1)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "skythern", fragments, 1)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "skythern", fragments, 1)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "skythern", fragments, 1)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "skythern", fragments, 1)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "skythern", fragments, 1)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "skythern", fragments, 1)
                global.rp.minecraft.ore_processing_gem(event, "skythern", fragments, 1)
            },
            wildwood: (event, fragments) => {
                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "wildwood", fragments, 1)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "wildwood", fragments, 1)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "wildwood", fragments, 1)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "wildwood", fragments, 1)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "wildwood", fragments, 1)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "wildwood", fragments, 1)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "wildwood", fragments, 1)
                global.rp.minecraft.ore_processing_gem(event, "wildwood", fragments, 1)
            }
        },
        extra: {
            hide: event => {
                if(Platform.isLoaded("exnihilosequentia")){
                    ["copper", "lead", "nickel", "silver", "tin", "aluminum", "uranium", "zinc", "iron", "gold", "platinum"].forEach(type => {
                        event.hide(`exnihilosequentia:chunk_${type}`)
                    })
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    ["iron", "gold", "copper", "tin", "silver", "lead", "nickel", "platinum", "zinc", "bismuth", "bauxite", "uranium"].forEach(type => {
                        event.hide(`silents_mechanisms:${type}_chunks`)
                    })
                }
            },
            recipes: event => {
                if(Platform.isLoaded("naturesaura")){
                    event.custom({
                        type: "naturesaura:tree_ritual",
                        ingredients: [
                            {item: "naturesaura:gold_powder"},
                            {item: "naturesaura:gold_powder"},
                            {tag: "forge:ores/diamond"},
                            {tag: "forge:ores/redstone"}
                        ],
                        sapling: {item: "minecraft:oak_sapling"},
                        output: {
                            nbt: {effect: "naturesaura:ore_spawn"},
                            item: "naturesaura:effect_powder",
                            count: 4
                        },
                        time: 400
                    }).id("unification:naturesaura/tree_ritual/component/ore_spawn_powder")
                    event.remove({id: "naturesaura:tree_ritual/ore_spawn_powder"})
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, "12x silents_mechanisms:solder", ["#forge:ingots/tin", "#forge:ingots/lead"], ["#forge:dusts/tin", "#forge:dusts/lead"], 
                        "unification:silents_mechanisms/alloy_smelting/component/solder", "silents_mechanisms:alloy_smelting/solder")
                }
            },
            tags: event => {
                if(Platform.isLoaded("aoa3")){
                    event.add("forge:raw_materials/skeletal", "#aoa3:precasian_bones")
                    event.add("forge:raw_materials", "#aoa3:precasian_bones")
                }
                if(Platform.isLoaded("appliedenergistics2")){
                    event.remove("forge:gems/certus_quartz", "appliedenergistics2:charged_certus_quartz_crystal")
                }
                if(Platform.isLoaded("chemlib")){
                    event.remove("forge:ingots/silicon", "chemlib:ingot_silicon")
                    event.remove("forge:ingots", "chemlib:ingot_silicon")
                }
                if(Platform.isLoaded("exnihilosequentia")){
                    ["copper", "lead", "nickel", "silver", "tin", "aluminum", "uranium", "zinc", "iron", "gold", "platinum"].forEach(type => {
                        event.remove(`forge:ores/${type}`, `exnihilosequentia:chunk_${type}`)
                        event.remove('forge:ores', `exnihilosequentia:ore_${type}`)
                    })
                }
                if(Platform.isLoaded("mekanism")){
                    event.remove("forge:dyes/yellow", "mekanism:dust_sulfur")
                    event.remove("forge:dyes", "mekanism:dust_sulfur")
                }
                event.removeAll("forge:silicon")
                event.add("forge:gems/coal", "minecraft:coal")
            }
        },
        ftbic: {
            advanced_alloy: (event, ingot) => {
                let inputsNeeded = ["#forge:ingots/iron", "#forge:ingots/bronze", "#forge:ingots/tin"]
                let inputsOptional = [
                    ["#forge:ingots/lead", "#forge:dusts/iron", "#forge:dusts/lead"],
                    ["#froge:ingots/constantan", "#forge:ingots/electrum", "#forge:dusts/bronze", "#forge:dusts/constantan", "#forge:dusts/electrum"],
                    ["#forge:ingots/aluminum", "#forge:dusts/tin", "#forge:dusts/aluminum"]
                ]
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, ingot, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, ingot, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            },
            iridium_alloy: (event, ingot, molten) => {
                let inputsNeeded = ["4x #forge:ingots/iridium", "4x #forge:ingots/advanced_alloy", "#forge:gems/diamond"]
                let inputsOptional = ["4x #forge:dusts/iridium", "4x #forge:dusts/advanced_alloy", "#forge:dusts/diamond"]
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, ingot, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:iridium_molten").isEmpty() && !Fluid.of("unification:advanced_alloy_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 144), [Fluid.of("unification:iridium_molten", 576), Fluid.of("unification:advanced_alloy_molten", 576),
                        Fluid.of("tconstruct:molten_diamond", 144)], 800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, ingot, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            }
        },
        gem: {
            bitumen: (event, bitumen) => {
                if(Platform.isLoaded("immersivepetroleum") && checkTag("#forge:gems/bitumen")){
                    global.mrt.immersivepetroleum.coker(event, ["#forge:diesel_sulfur", 27], "immersivepetroleum:petcoke", ["#minecraft:water", 125], "2x #forge:gems/bitumen", 30, 512,
                        `unification:immersivepetroleum/coker/component/petcoke/from_coking`)
                    event.remove({id: "immersivepetroleum:coking/petcoke"})
                    global.mrt.immersivepetroleum.distillation(event, [Fluid.of("immersivepetroleum:lubricant", 9), Fluid.of("immersivepetroleum:diesel_sulfur", 14),
                        Fluid.of("immersivepetroleum:gasoline", 39)], Item.of(bitumen).withChance(0.07), ["#forge:crude_oil", 75], 1, 2048,
                        `unification:immersivepetroleum/distillation/component/${removeMod(bitumen)}/from_oilcracking`)
                    event.remove({id: "immersivepetroleum:distillationtower/oilcracking"})
                    event.shaped('8x immersivepetroleum:asphalt', [
                        'SBS',
                        'GWG',
                        'SBS'
                    ], {
                        S: '#forge:sand',
                        B: '#forge:gems/bitumen',
                        W: 'minecraft:water_bucket',
                        G: '#forge:gravel'
                    }).id('unificatiom:minecraft/shaped/component/asphalt/from_sand').replaceIngredient('minecraft:water_bucket', 'minecraft:bucket')
                    event.remove({id: 'immersivepetroleum:asphalt'})
                    event.shaped('12x immersivepetroleum:asphalt', [
                        'SBS',
                        'GWG',
                        'SBS'
                    ], {
                        S: '#forge:slag',
                        B: '#forge:gems/bitumen',
                        W: 'minecraft:water_bucket',
                        G: '#forge:gravel'
                    }).id('unificatiom:minecraft/shaped/component/asphalt/from_slag').replaceIngredient('minecraft:water_bucket', 'minecraft:bucket')
                    event.remove({id: 'immersivepetroleum:asphalt2'})
                }
                if(Platform.isLoaded("thermal")){
                    event.recipes.thermal.centrifuge([bitumen, Item.of(bitumen).withChance(0.5), "thermal:tar", Fluid.of("thermal:crude_oil", 100)], "#forge:ores/bitumen")
                        .energy(20000).id(`unification:thermal/centrifuge/component/${removeMod(bitumen)}/from_ore`)
                    event.remove({id: "thermal:machine/centrifuge/centrifuge_oil_sand"})
                    event.remove({id: "thermal:machine/centrifuge/centrifuge_oil_red_sand"})
                }
            },
            sulfur: (event, sulfur, dust) => {
                if(Platform.isLoaded("exnihilosequentia")){
                    global.mrt.exnihilosequentia.sieve(event, sulfur, "#forge:gravel", [["flint", 0.05], ["iron", 0.1], ["diamond", 0.15]], false,
                        `unification:exnihilosequentia/sieve/component/${removeMod(sulfur)}/from_gravel`)
                    event.remove({id: "exnihilothermal:sieve/ens_sulfur"})
                }
                if(Platform.isLoaded("immersivepetroleum")){
                    global.mrt.immersivepetroleum.hydrotreater(event, Fluid.of("immersivepetroleum:diesel", 7), Item.of(dust).withChance(0.02) [["#forge:diesel_sulfur", 7]
                        ["#minecraft:water", 7]], 1, 512, `unification:immersivepetroleum/hydrotreater/component/${removeMod(dust)}/from_sulfur_recovery`)
                    event.remove({id: "immersivepetroleum:hydrotreater/sulfur_recovery"})
                }
                if(Platform.isLoaded("eidolon")){
                    event.custom({
                        type: "eidolon:crucible",
                        result: {item: sulfur, count: 2},
                        steps: [
                            {ingredients: [{tag: "minecraft:coals"}, {item: "eidolon:enchanted_ash"}]},
                        ]
                    }).id("unification:eidolon/crucible/component/sulfur")
                    event.remove({id: "eidolon:sulfur"})
                }
                if(Platform.isLoaded("nuclearcraft")){
                    //todo: gem_dust_sulfur
                }
            }
        },
        mekanism: {
            refined_obsidian: (event, ingot, nugget) => {
                let types = ["gear", "plate", "rod", "wire", "coin"]
                let output = [`4x ${ingot}`, ingot, `4x ${nugget}`, `4x ${nugget}`, `3x ${nugget}`]
                types.forEach((type, i) => {
                    if(checkTag(`#forge:${type}s/refined_obsidian`)){
                        if(checkItems(Item.of(output[i]).id)){
                            event.smelting(Item.of(output[i]), `#forge:${type}s/refined_obsidian`).id(`unification:minecraft/smelting/component/${removeMod(output[i])}/from_${type}`)
                            event.blasting(Item.of(output[i]), `#forge:${type}s/refined_obsidian`).id(`unification:minecraft/blasting/component/${removeMod(output[i])}/from_${type}`)
                        }
                    }
                })
            }
        },
        minecraft: {
            diamond: (event, molten, gem) => {
                if(Platform.isLoaded("createautomated")){
                    if(checkTag("#forge:gems/diamond")){
                        event.recipes.create.mixing(Fluid.of(molten, 144), ["#forge:gems/diamond"]).superheated()
                            .id("unification:create/mixing/ore_processing/molten_diamond/from_gem")
                        event.remove("createautomated:mixing/molten_diamond_from_ingot")
                        if(checkItems(gem)){
                            event.recipes.create.mixing(gem, ["#createautomated:bits/diamond", Fluid.of(molten, 116)])
                                .id("unification:create/mixing/ore_processing/diamond/from_bit")
                            event.remove("createautomated:mixing/diamond_from_bits")
                        }
                    }
                    event.recipes.create.mixing(Fluid.of(molten, 20), ["3x #createautomated:bits/diamond"]).superheated()
                            .id("unification:create/mixing/ore_processing/molten_diamond/from_bit")
                    event.remove("createautomated:mixing/molten_diamond")
                }
            },
            emerald: (event, molten, gem) => {
                if(Platform.isLoaded("createautomated")){
                    if(checkTag("#forge:gems/emerald")){
                        event.recipes.create.mixing(Fluid.of(molten, 144), ["#forge:gems/emerald"]).superheated()
                            .id("unification:create/mixing/ore_processing/molten_emerald/from_gem")
                        event.remove("createautomated:mixing/molten_emerald_from_ingot")
                        if(checkItems(gem)){
                            event.recipes.create.mixing(gem, ["#createautomated:bits/emerald", Fluid.of(molten, 116)])
                                .id("unification:create/mixing/ore_processing/emerald/from_bit")
                            event.remove("createautomated:mixing/emerald_from_bits")
                        }
                    }
                    event.recipes.create.mixing(Fluid.of(molten, 20), ["3x #createautomated:bits/emerald"]).superheated()
                            .id("unification:create/mixing/ore_processing/molten_emerald/from_bit")
                    event.remove("createautomated:mixing/molten_emerald")
                }
            },
            glowstone: (event) => {
                if(Platform.isLoaded("thermal") && Platform.isLoaded("tconstruct")){
                    global.rp.tconstruct.casting(event, "thermal:energized_glowstone", "minecraft:glowstone", "", "", "minecraft:glowstone:dust", "", "", "", "", "", 4)
                    global.rp.tconstruct.smelting(event, "glowstone", "thermal:energized_glowstone", 4)
                }
            },
            netherite: (event) => {
                if(Platform.isLoaded("bloodmagic")){
                    let remove_sand = 0
                    if(checkTag("#forge:gravels/netherite")){
                        event.recipes.bloodmagic.arc("minecraft:netherite_scrap", "#forge:gravels/netherite", "#bloodmagic:arc/cuttingfluid").consumeIngredient(false)
                            .id(`unification:bloodmagic/arc/ore_processing/netherite_scrap/from_gravel`)
                        event.remove({id: "bloodmagic:arc/dustsfrom_gravel_netherite_scrap"})
                        remove_sand += 1
                    }
                    if(checkTag("#forge:ores/netherite_scrap")){
                        event.recipes.bloodmagic.arc("2x minecraft:netherite_scrap", "#forge:ores/netherite_scrap", "#bloodmagic:arc/cuttingfluid").consumeIngredient(false)
                            .id(`unification:bloodmagic/arc/ore_processing/netherite_scrap/from_ore`)
                        event.remove({id: "bloodmagic:arc/dustsfrom_ore_netherite_scrap"})
                        remove_sand += 1
                    }
                    if(remove_sand == 2){
                        event.remove({id: "bloodmagic:arc/dustsfrom_ingot_netherite_scrap"})
                        event.remove({id: "bloodmagic:smelting/ingot_netherite_scrap"})
                    }
                }
            },
			redstone: (event) => {
				if(Platform.isLoaded("thermal") && !Fluid.of("unification:redstone_molten").isEmpty()){
                    event.recipes.thermal.crucible(Fluid.of("unification:redstone_molten", 144), "minecraft:redstone").energy(8000)
                        .id(`unification:thermal/crucible/component/redstone_molten/from_dust`)
                    event.remove("thermal:machine/crucible/crucible_redstone_dust")
                    event.recipes.thermal.crucible(Fluid.of("unification:redstone_molten", 1296), "minecraft:redstone_block").energy(72000)
                        .id(`unification:thermal/crucible/component/redstone_molten/from_block`)
                    event.remove("thermal:machine/crucible/crucible_redstone_block")

                    event.recipes.thermal.chiller("minecraft:redstone_block", Fluid.of("unification:redstone_molten", 1296)).energy(72000)
                        .id(`unification:thermal/chiller/component/redstone_block/from_molten`)
                    event.remove("thermal:machine/chiller/chiller_redstone_to_redstone_block")
				}
			}
        },
        mysticalagriculture: {
            prosperity: (event, raw_material, gem_multiplier) => {
                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "prosperity", raw_material, gem_multiplier)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "prosperity", raw_material, gem_multiplier)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "prosperity", raw_material, gem_multiplier)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "prosperity", raw_material, gem_multiplier)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "prosperity", raw_material, gem_multiplier)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "prosperity", raw_material, gem_multiplier)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "prosperity", raw_material, gem_multiplier)
                global.rp.minecraft.ore_processing_gem(event, "prosperity", raw_material, gem_multiplier)
            },
            soulium: (event, ingot, nugget, molten, raw_material, gem_multiplier) => {
                let types = ["gear", "plate", "rod", "wire", "coin"]
                let output = [`4x ${ingot}`, ingot, `4x ${nugget}`, `4x ${nugget}`, `3x ${nugget}`]
                types.forEach((type, i) => {
                    if(checkTag(`#forge:${type}s/soulium`)){
                        if(checkItems(Item.of(output[i]).id)){
                            event.smelting(Item.of(output[i]), `#forge:${type}s/soulium`).id(`unification:minecraft/smelting/component/${removeMod(output[i])}/from_${type}`)
                            event.blasting(Item.of(output[i]), `#forge:${type}s/soulium`).id(`unification:minecraft/blasting/component/${removeMod(output[i])}/from_${type}`)
                        }
                    }
                })
                if(Platform.isLoaded("tconstruct")){
                    let inputs = [
                        '#forge:storage_blocks/soulium','#forge:ingots/soulium', '#forge:nuggets/soulium', '#forge:plates/soulium', 
                        '#forge:gears/soulium', '#forge:rods/soulium', '#forge:wires/soulium', '#forge:coins/soulium'
                    ]
                    let amounts = [1296, 144, 16, 144, 576, 72, 72, 48]
                    let times = [180, 60, 20, 60, 120, 43, 43, 35]
                    let ids = ["block", "ingot", "nugget", "plate", "gear", "rod", "wire", "coin"]
                    if(!Fluid.of(molten).equals(Fluid.empty)){
                        inputs.forEach((input, i) => {
                            if (checkTag(input)) {
                                global.mrt.tconstruct.melting(event, Fluid.of(molten, amounts[i]), input, 800, times[i], 
                                    `unification:tconstruct/melting/component/${removeMod(molten)}/from_${ids[i]}`)
                            }
                        })
                    }
                }

                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "soulium", raw_material, gem_multiplier)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "soulium", raw_material, gem_multiplier)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "soulium", raw_material, gem_multiplier)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "soulium", raw_material, gem_multiplier)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "soulium", raw_material, gem_multiplier)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "soulium", raw_material, gem_multiplier)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "soulium", raw_material, gem_multiplier)
                global.rp.minecraft.ore_processing_gem(event, "soulium", raw_material, gem_multiplier)
            }
        },
        powah: {
            "overcharged": (event, essence, gem, gem_multiplier, mysticalagriculture_output_multiplier) => {
                if(Platform.isLoaded("mysticalagriculture") && checkItems([gem, essence])){
                    if(isNaN(gem_multiplier)) gem_multiplier = 1
                    if(isNaN(mysticalagriculture_output_multiplier)) mysticalagriculture_output_multiplier = 1

                    event.shaped(Item.of(gem, Math.floor(gem_multiplier * mysticalagriculture_output_multiplier)), ["ECE", "EHE", "ENE"], 
                        {E: essence, C: "minecraft:end_crystal", H: "minecraft:dragon_head", N: "powah:nitro_crystal_block"})
                        .id(`unification:minecraft/shaped/component/${removeMod(gem)}/from_essence`)
                }
            }
        },
        "projectred-core": {
            electrotine: (event, ingot, nugget, dust, molten, raw_material, gem_multiplier, essence, seed, tier, mysticalagriculture_craft_type, mysticalagriculture_output_multiplier) => {
                let types = ["gear", "plate", "rod", "wire", "coin"]
                let output = [`4x ${ingot}`, ingot, `4x ${nugget}`, `4x ${nugget}`, `3x ${nugget}`]
                types.forEach((type, i) => {
                    if(checkTag(`#forge:${type}s/electrotine`)){
                        if(checkItems(Item.of(output[i]).id)){
                            event.smelting(Item.of(output[i]), `#forge:${type}s/electrotine`).id(`unification:minecraft/smelting/component/${removeMod(output[i])}/from_${type}`)
                            event.blasting(Item.of(output[i]), `#forge:${type}s/electrotine`).id(`unification:minecraft/blasting/component/${removeMod(output[i])}/from_${type}`)
                        }
                    }
                })
                if(Platform.isLoaded("tconstruct")){
                    let inputs = [
                        '#forge:storage_blocks/electrotine','#forge:ingots/electrotine', '#forge:nuggets/electrotine', '#forge:plates/electrotine', 
                        '#forge:gears/electrotine', '#forge:rods/electrotine', '#forge:wires/electrotine', '#forge:coins/electrotine'
                    ]
                    let amounts = [1296, 144, 16, 144, 576, 72, 72, 48]
                    let times = [180, 60, 20, 60, 120, 43, 43, 35]
                    let ids = ["block", "ingot", "nugget", "plate", "gear", "rod", "wire", "coin"]
                    if(!Fluid.of(molten).equals(Fluid.empty)){
                        inputs.forEach((input, i) => {
                            if (checkTag(input)) {
                                global.mrt.tconstruct.melting(event, Fluid.of(molten, amounts[i]), input, 800, times[i], 
                                    `unification:tconstruct/melting/component/${removeMod(molten)}/from_${ids[i]}`)
                            }
                        })
                    }
                }

                if(Platform.isLoaded("astralsorcery")) global.rp.astralsorcery.ore_processing_gem(event, "electrotine", raw_material, gem_multiplier)
                if(Platform.isLoaded("betterendforge")) global.rp.betterendforge.ore_processing_gem(event, "electrotine", raw_material, gem_multiplier)
                if(Platform.isLoaded("create")) global.rp.create.ore_processing_gem(event, "electrotine", raw_material, gem_multiplier)
                if(Platform.isLoaded("immersiveengineering")) global.rp.immersiveengineering.ore_processing_gem(event, "electrotine", raw_material, gem_multiplier)
                if(Platform.isLoaded("mekanism")) global.rp.mekanism.ore_processing_gem(event, "electrotine", raw_material, gem_multiplier)
                if(Platform.isLoaded("silents_mechanisms")) global.rp.silent_mechanisms.ore_processing_gem(event, "electrotine", raw_material, gem_multiplier)
                if(Platform.isLoaded("thermal")) global.rp.thermal.ore_processing_gem(event, "electrotine", raw_material, gem_multiplier)
                global.rp.minecraft.ore_processing_gem(event, "electrotine", raw_material, gem_multiplier)

                if(Platform.isLoaded("mysticalagriculture")){
                    if(checkItems([dust, essence])){
                        if(isNaN(gem_multiplier)) gem_multiplier = 1
                        if(isNaN(mysticalagriculture_craft_type)) mysticalagriculture_craft_type = 8
                        if(isNaN(mysticalagriculture_output_multiplier)) mysticalagriculture_output_multiplier = 1

                        if(mysticalagriculture_craft_type == 9){
                            event.shaped(Item.of(dust, Math.floor(gem_multiplier * mysticalagriculture_output_multiplier)), ["EEE", "EEE", "EEE"], {E: essence})
                                .id(`unification:minecraft/shaped/component/${removeMod(dust)}/from_essence`)
                        }else if(mysticalagriculture_craft_type == 8){
                            event.shaped(Item.of(dust, Math.floor(gem_multiplier * mysticalagriculture_output_multiplier)), ["EEE", "E E", "EEE"], {E: essence})
                                .id(`unification:minecraft/shaped/component/${removeMod(dust)}/from_essence`)
                        }else if(mysticalagriculture_craft_type == 3){
                            event.shaped(Item.of(dust, Math.floor(gem_multiplier * mysticalagriculture_output_multiplier)), ["EEE"], {E: essence})
                                .id(`unification:minecraft/shaped/component/${removeMod(dust)}/from_essence`)
                        }
                    }
                    if(checkItems(seed) && checkTag("#forge:dusts/electrotine")){
                        let essence = essences[tier - 1]
                        global.mrt.mysticalagriculture.infusion(event, seed, "mysticalagriculture:prosperity_seed_base", ["#forge:dusts/electrotine", essence, 
                            "#forge:dusts/electrotine", essence, "#forge:dusts/electrotine", essence, "#forge:dusts/electrotine", essence], 
                            `unification:mysticalagriculture/infusion/component/${removeMod(seed)}/from_infusion`)
                    }
                }
            }
        },
        psi: {
            "psidust": (event, essence, mysticalagriculture_craft_type, dust, gem_multiplier, mysticalagriculture_output_multiplier, seed, tier) => {
                if(Platform.isLoaded("mysticalagriculture")){
                    if(checkItems([dust, essence])){
                        if(isNaN(gem_multiplier)) gem_multiplier = 1
                        if(isNaN(mysticalagriculture_craft_type)) mysticalagriculture_craft_type = 8
                        if(isNaN(mysticalagriculture_output_multiplier)) mysticalagriculture_output_multiplier = 1

                        if(mysticalagriculture_craft_type == 9){
                            event.shaped(Item.of(dust, Math.floor(gem_multiplier * mysticalagriculture_output_multiplier)), ["EEE", "EEE", "EEE"], {E: essence})
                                .id(`unification:minecraft/shaped/component/${removeMod(dust)}/from_essence`)
                        }else if(mysticalagriculture_craft_type == 8){
                            event.shaped(Item.of(dust, Math.floor(gem_multiplier * mysticalagriculture_output_multiplier)), ["EEE", "E E", "EEE"], {E: essence})
                                .id(`unification:minecraft/shaped/component/${removeMod(dust)}/from_essence`)
                        }else if(mysticalagriculture_craft_type == 3){
                            event.shaped(Item.of(dust, Math.floor(gem_multiplier * mysticalagriculture_output_multiplier)), ["EEE"], {E: essence})
                                .id(`unification:minecraft/shaped/component/${removeMod(dust)}/from_essence`)
                        }
                    }
                    if(checkItems(seed) && checkTag("#forge:dusts/psidust")){
                        let essence = essences[tier - 1]
                        global.mrt.mysticalagriculture.infusion(event, seed, "mysticalagriculture:prosperity_seed_base", ["#forge:dusts/psidust", essence, 
                            "#forge:dusts/psidust", essence, "#forge:dusts/psidust", essence, "#forge:dusts/psidust", essence], 
                            `unification:mysticalagriculture/infusion/component/${removeMod(seed)}/from_infusion`)
                    }
                }
            }
        },
        refinedstorage: {
            quartz_enriched_iron: (event, ingot, molten) => {
                let inputsNeeded = ["3x #forge:ingots/iron", "#forge:gems/quartz"]
                let inputsOptional = ["3x #forge:dusts/iron", "#forge:dusts/quartz"]
                let output = Item.of(ingot, 4)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct")){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 576), [Fluid.of("tconstruct:molten_iron", 432), Fluid.of("tconstruct:molten_quartz", 144)], 
                        800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            }
        },
        silentgear: {
            azure_electrum: (event, ingot, molten) => {
                let inputsNeeded = ["3x #forge:ingots/azure_silver", "minecraft:ender_pearl", "#forge:ingots/gold"]
                let inputsOptional = ["3x #forge:dusts/azure_silver", "#forge:dusts/ender_pearl", "#forge:dusts/gold"]
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, ingot, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:azure_silver_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 144), [Fluid.of("unification:azure_silver_molten", 432), Fluid.of("tconstruct:molten_ender", 250),
                        Fluid.of("tconstruct:molten_gold", 144)], 800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, ingot, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`,
                        "silents_mechanisms:alloy_smelter/azure_electrum_ingot")
                }
            },
            blaze_gold: (event, ingot) => {
                let inputsNeeded = ["#forge:ingots/gold", "3x #forge:dusts/blaze"]
                let inputsOptional = ["#forge:dusts/gold", ""]
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, ingot, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, ingot, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    event.recipes.thermal.smelter(ingot, inputsNeeded, inputsOptional).id(`unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`, 
                    "silents_mechanisms:alloy_smelter/blaze_gold_ingot")
                }
            },
            crimson_steel: (event, ingot, molten) => {
                let inputsNeeded = ["3x #forge:ingots/crimson_iron", "2x #forge:rods/blaze", "minecraft:magma_cream"]
                let inputsOptional = ["3x #forge:dusts/crimson_iron", "", ""]
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, ingot, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    event.recipes.thermal.smelter(ingot, inputsNeeded, inputsOptional).id(`unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            }
        },
        silents_mechanisms: {
            aluminum_steel: (event, ingot, molten) => {
                let inputsNeeded = ["2x #forge:ingots/iron", "3x #forge:dusts/coal", "#forge:ingots/aluminum"]
                let inputsOptional = ["2x #forge:dusts/iron", "", "#forge:dusts/aluminum"]
                let output = Item.of(ingot, 4)
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:coal_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 576), [Fluid.of("tconstruct:molten_iron", 288), Fluid.of("unification:coal_molten", 432), 
                        Fluid.of("tconstruct:molten_aluminum", 144)], 800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`,
                        "silents_mechanisms:alloy_smelter/aluminum_steel_ingot")
                }
            },
            bismuth_brass: (event, ingot, molten) => {
                let inputsNeeded = ["2x #forge:ingots/copper", "#forge:ingots/zinc", "#forge:ingots/bismuth"]
                let inputsOptional = ["2x #forge:dusts/copper", "#forge:dusts/zinc", "#forge:dusts/bismuth"]
                let output = Item.of(ingot, 4)
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:bismuth_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 576), [Fluid.of("tconstruct:molten_copper", 288), Fluid.of("tconstruct:molten_zinc", 144),
                        Fluid.of("unification:bismuth_molten", 144)], 800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`,
                        "silents_mechanisms:alloy_smelter/bismuth_brass_ingot")
                }
            },
            bismuth_steel: (event, ingot, molten) => {
                let inputsNeeded = ["2x #forge:ingots/iron", "3x #forge:dusts/coal", "#forge:ingots/bismuth"]
                let inputsOptional = ["2x #forge:dusts/iron", "", "#forge:dusts/bismuth"]
                let output = Item.of(ingot, 4)
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("tconstruct") && !Fluid.of("unification:coal_molten").isEmpty()){
                    global.mrt.tconstruct.alloy(event, Fluid.of(molten, 576), [Fluid.of("tconstruct:molten_iron", 288), Fluid.of("unification:coal_molten", 432),
                        Fluid.of("unification:bismuth_molten", 144)], 800, `unification:tconstruct/alloy/component/${removeMod(molten)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`,
                        "silents_mechanisms:alloy_smelter/bismuth_steel_ingot")
                }
            }
        },
        tconstruct: {
            hepatizon: (event, ingot) => {
                let inputsNeeded = ["2x #forge:ingots/copper", "#forge:ingots/cobalt", "4x #forge:gems/quartz"]
                let inputsOptional = ["2x #forge:dusts/copper", "#forge:dusts/cobalt", "4x #forge:dusts/quartz"]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, output, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
            },
            manyullyn: (event, ingot) => {
                let inputsNeeded = ["3x #forge:ingots/cobalt", "#forge:ingots/netherite_scrap"]
                let inputsOptional = ["3x #forge:dusts/cobalt", ""]
                let output = Item.of(ingot, 4)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, output, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
            },
            pig_iron: (event, ingot) => {
                let inputsNeeded = ["#forge:ingots/iron", "#forge:slimeball/blood", "#forge:clay"]
                let inputsOptional = ["#forge:dusts/iron", "", ""]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            },
            queens_slime: (event, ingot) => {
                let inputsNeeded = ["#forge:ingots/cobalt", "#forge:ingots/gold", "minecraft:magma_cream"]
                let inputsOptional = ["#forge:dusts/cobalt", "#forge:dusts/gold", ""]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, output, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`)
                }
            },
            slimesteel: (event, ingot) => {
                let inputsNeeded = ["#forge:ingots/iron", "#forge:slimeball/sky", "tconstruct:seared_brick"]
                let inputsOptional = ["#forge:dusts/iron", "", ""]
                let output = Item.of(ingot, 2)
                if(Platform.isLoaded("create")){
                    verifyAndAddCreateMixer(event, output, inputsNeeded, inputsOptional, `unification:create/mixing/component/${removeMod(ingot)}`,
                    "createaddition:compat/tconstruct/slimesteel")
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
            },
            tinkers_bronze: (event, ingot) => {
                let inputsNeeded = ["3x #forge:ingots/copper", "#forge:glass"]
                let inputsOptional = ["3x #forge:dusts/copper", ""]
                let output = Item.of(ingot, 3)
                if(Platform.isLoaded("betterendforge")){
                    verifyAndAddBEFAlloying(event, output, inputsNeeded, inputsOptional, `unification:betterendforge/alloying/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("immersiveengineering")){
                    verifyAndAddIEAlloy(event, output, inputsNeeded, inputsOptional, `unification:immersiveengineering/alloy/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("silents_mechanisms")){
                    verifyAndAddSMAlloy(event, ingot, output, inputsNeeded, inputsOptional, `unification:silents_mechanisms/alloy_smelting/component/${removeMod(ingot)}`)
                }
                if(Platform.isLoaded("thermal")){
                    verifyAndAddThermalSmelter(event, output, inputsNeeded, inputsOptional, `unification:thermal/smelter/component/${removeMod(ingot)}`,
                    "thermal:compat/tconstruct/smelter_alloy_tconstruct_tinkers_bronze_ingot")
                }
            }
        }
    }
})