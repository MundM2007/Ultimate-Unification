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
// Ultimate Unification Copyright (C) 2023-2025 under MIT License by:              
//         - MundM2007          (https://github.com/MundM2007)                              

function chooseRandom(array) {
	if (array.length == 1) return array[0]
	return array[Math.floor(Math.random() * array.length)]
}
function calcFortuneDrops(level, mult) {
	return Math.max(Math.ceil((Math.random() * (level + 2) - 1) * mult), mult)
}
function applyStratumMultiplier(stratum_multiplier, mult_array) {
	if(mult_array == undefined) mult_array = [1]
	let scaled = chooseRandom(mult_array) * stratum_multiplier
	let floorValue = Math.floor(scaled)
	let ceilValue = Math.ceil(scaled)

	if (floorValue === ceilValue) return floorValue
	return Math.random() < scaled - floorValue ? ceilValue : floorValue
}

onEvent("loaded", e => {
	global.lp = {
		replace: (event, old_item, new_item) => {
			event
				.addLootTypeModifier(LootType.BLOCK, LootType.ENTITY, LootType.CHEST, LootType.FISHING, LootType.GIFT, LootType.UNKNOWN)
				.thenModify(old_item, (itemStack) => {
					return Item.of(new_item, itemStack.getCount())
				})
		},

		with_fortune: {
			with_silk_touch: (event, block, drops, counts, stratum_multiplier) => {
				event
        			.addBlockLootModifier(block)
					.randomChanceWithEnchantment("minecraft:silk_touch", [1, 0])
					.thenRemove(block)
					.thenApply((context) => {
						if(context.player){
							let main_item = context.tool
							let level = 0
							if(main_item.nbt && main_item.nbt.Enchantments){
								for(let i = 0; i < main_item.nbt.Enchantments.length; i++){
									if(main_item.nbt.Enchantments[i].id == "minecraft:fortune"){
										level = main_item.nbt.Enchantments[i].lvl
										break
									}
								}
							}
							context.addLoot(Item.of(chooseRandom(drops), calcFortuneDrops(level, applyStratumMultiplier(stratum_multiplier, counts))))
						}else{
							context.addLoot(Item.of(chooseRandom(drops), applyStratumMultiplier(stratum_multiplier, counts)))
						}
					})
			},
			without_silk_touch: (event, block, drops, counts, stratum_multiplier) => {
				event
        			.addBlockLootModifier(block)
					.thenRemove(block)
					.thenApply((context) => {
						if(context.player){
							let main_item = context.tool
							let level = 0
							if(main_item.nbt && main_item.nbt.Enchantments){
								for(let i = 0; i < main_item.nbt.Enchantments.length; i++){
									if(main_item.nbt.Enchantments[i].id == "minecraft:fortune"){
										level = main_item.nbt.Enchantments[i].lvl
										break
									}
								}
							}
							context.addLoot(Item.of(chooseRandom(drops), calcFortuneDrops(level, applyStratumMultiplier(stratum_multiplier, counts))))
						}else{
							context.addLoot(Item.of(chooseRandom(drops), applyStratumMultiplier(stratum_multiplier, counts)))
						}
					})
			}
		},
		without_fortune: {
			with_silk_touch: (event, block, drops, counts, stratum_multiplier) => {
				event
        			.addBlockLootModifier(block)
					.randomChanceWithEnchantment("minecraft:silk_touch", [1, 0])
					.thenRemove(block)
					.thenApply((context) => {
						context.addLoot(Item.of(chooseRandom(drops), applyStratumMultiplier(stratum_multiplier, counts)))
					})
			},
			without_silk_touch: (event, block, drops, counts, stratum_multiplier) => {
				event
        			.addBlockLootModifier(block)
					.thenRemove(block)
					.thenApply((context) => {
						context.addLoot(Item.of(chooseRandom(drops), applyStratumMultiplier(stratum_multiplier, counts)))
					})
			}
		}
	}
})