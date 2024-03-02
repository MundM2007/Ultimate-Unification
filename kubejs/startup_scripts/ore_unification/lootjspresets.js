// priority: 105

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
// Ultimate Unification Copyright (C) 2023 By:									   
//         - MundM2007          (https://github.com/MundM2007)                              
// Licensed under GNU GPL v3: https://www.gnu.org/licenses/         			   

function calcFortuneDrops(level) {
	let chance = Math.random()
	// (c - 2 / (l + 2)) / (1 / (l + 2)) = c * (l + 2) - 2; only gives extra drops
	let drop_amount = Math.ceil(chance * (level + 2) - 1)
	if (drop_amount <= 0) drop_amount = 1
	return drop_amount
}

onEvent("loaded", e => {
	global.lootjs_presets = {
		fortune: {
			with_silk_touch: (event, block, drop, multiplyer) => {
				event
        			.addBlockLootModifier(block)
					.thenModify(Ingredient.getAll(), (itemStack) => {
						return Item.of("minecraft:air")
					})
					.randomChanceWithEnchantment("minecraft:silk_touch", [0, 1]) 
					.thenAdd(block)
					.randomChanceWithEnchantment("minecraft:silk_touch", [1, 0])
					.thenAdd(drop)
					.console.log("HI")
        			//.thenApply(ctx => {
						//ctx.addLoot(Item.of(drop, calcFortuneDrops(ctx.getLooting()) * multiplyer));
					//})
			}
		}
	}
})
