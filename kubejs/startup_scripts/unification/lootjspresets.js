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
	if(mult == undefined) mult = [1]
	mult = chooseRandom(mult)
	let chance = Math.random()
	let drop_amount = Math.ceil((chance * (level + 2) - 1) * mult)
	if (drop_amount < mult) drop_amount = mult
	return drop_amount
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
			with_silk_touch: (event, block, drops, counts) => {
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
							context.addLoot(Item.of(chooseRandom(drops), calcFortuneDrops(level, counts)))
						}else{
							context.addLoot(Item.of(chooseRandom(drops), chooseRandom(counts)))
						}
					})
			},
			without_silk_touch: (event, block, drops, counts) => {
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
							console.log(Item.of(chooseRandom(drops), calcFortuneDrops(level, counts)))
							context.addLoot(Item.of(chooseRandom(drops), calcFortuneDrops(level, counts)))
						}else{
							context.addLoot(Item.of(chooseRandom(drops), chooseRandom(counts)))
						}
					})
			}
		},
		without_fortune: {
			with_silk_touch: (event, block, drops, counts) => {
				event
        			.addBlockLootModifier(block)
					//.randomChanceWithEnchantment("minecraft:silk_touch", [1, 0])
					.thenRemove(block)
					.thenApply((context) => {
						context.addLoot(Item.of(chooseRandom(drops), chooseRandom(counts)))
					})
			},
			without_silk_touch: (event, block, drops, counts) => {
				event
        			.addBlockLootModifier(block)
					.thenRemove(block)
					.thenApply((context) => {
						context.addLoot(Item.of(chooseRandom(drops), chooseRandom(counts)))
					})
			}
		}
	}
})