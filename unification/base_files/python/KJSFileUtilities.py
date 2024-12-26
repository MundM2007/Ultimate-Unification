#          ██╗   ██╗██╗  ████████╗██╗███╗   ███╗ █████╗ ████████╗███████╗         
#          ██║   ██║██║  ╚══██╔══╝██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝         
#          ██║   ██║██║     ██║   ██║██╔████╔██║███████║   ██║   █████╗           
#          ██║   ██║██║     ██║   ██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝           
#          ╚██████╔╝███████╗██║   ██║██║ ╚═╝ ██║██║  ██║   ██║   ███████╗         
#           ╚═════╝ ╚══════╝╚═╝   ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝         
#                                                                                 
# ██╗   ██╗███╗   ██╗██╗███████╗██╗ ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
# ██║   ██║████╗  ██║██║██╔════╝██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
# ██║   ██║██╔██╗ ██║██║█████╗  ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
# ██║   ██║██║╚██╗██║██║██╔══╝  ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
# ╚██████╔╝██║ ╚████║██║██║     ██║╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
#  ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
# --------------------------------------------------------------------------------
# Ultimate Unification Copyright (C) 2023-2024 under MIT License by:              
#         - MundM2007 (https://github.com/MundM2007)

import os

class KJSFileUtilities:
    def __init__(self, UT):
        self.LM = UT.LM
        self.IOM = UT.IOM
        self.FM = UT.FM
        self.UT = UT
        

    def register_material_property(self, base_file_registry, id_name, path, default_value):
        property_value = base_file_registry.get(id_name)
        property = path.split(".")[-1]
        for segment in path.split("."):
            property_value = property_value.get(segment)
            if property_value is None:
                if not path.startswith("mysticalagriculture."):
                    self.LM.log("value_missing", f"{path} not found for {id_name}, using default value of {default_value}")
                setattr(self, property, default_value)
                return
        setattr(self, property, property_value)


    # adds a tag to an item
    def add_tag(self, id_item, id_file, id_name, material_type, license_notice):
        if material_type in ["seed", "essence"]: mod_namespace = "mysticalagriculture"
        else: mod_namespace = "forge"
        path_script_file_item = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "add_tag", "item", f"{id_file}.js")
        is_block = material_type in ["ore"] + self.UT.get_main_config("advanced.block_material_types", "list_blocks")
        for tag in [f"{mod_namespace}:{material_type}s/{id_name}", f"{mod_namespace}:{material_type}s"]:
            self.FM.add_kjs(path_script_file_item, f"    event.add('{tag}', '{id_item}')\n", license_notice, 90, "onEvent('item.tags', event => {\n")
            if is_block:
                path_script_file_block = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "add_tag", "block", f"{id_file}.js")
                self.FM.add_kjs(path_script_file_block, f"    event.add('{tag}', '{id_item}')\n", license_notice, 90, "onEvent('block.tags', event => {\n")

    def add_tag_ore(self, id_file, id_name, id_file_strata, id_name_strata, license_notice):
        id_item = f"unification:{id_name}_ore_{id_file_strata}_{id_name_strata}"
        for type_tag in ["item", "block"]:
            path_script_file_tag = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "add_tag", type_tag, "ore", f"{id_file}.js")
            self.FM.add_kjs(path_script_file_tag, f"    event.add('forge:ores', '{id_item}')\n", license_notice, 90, f"onEvent('{type_tag}.tags', event => {{\n")
            self.FM.add_kjs(path_script_file_tag, f"    event.add('forge:ores/{id_name}', '{id_item}')\n", license_notice, 90, f"onEvent('{type_tag}.tags', event => {{\n")
            self.FM.add_kjs(path_script_file_tag, f"    event.add('forge:ores_in_ground/{id_name_strata}', '{id_item}')\n", license_notice, 90, f"onEvent('{type_tag}.tags', event => {{\n")
            self.FM.add_kjs(path_script_file_tag, f"    event.add('forge:ores_in_ground/{id_name_strata}/{id_file_strata}', '{id_item}')\n", 
                            license_notice, 90, f"onEvent('{type_tag}.tags', event => {{\n")


    def add_element(self, id_file, id_name, material_type, color, add_element, license_notice):
        if material_type in self.UT.get_main_config("advanced.block_material_types", "list_blocks"):
            return self.add_block(id_file, id_name, material_type, add_element, license_notice)
    
        elif material_type.startswith("molten"):
            if add_element: return self.add_molten(id_file, id_name, color, license_notice)
            return False

        elif material_type.startswith("slurry"):
            if add_element: return self.add_slurry(id_file, id_name, color, license_notice)
            return False
    
        elif material_type.startswith("mysticalagriculture"):
            if add_element: return self.add_mysticalagriculture(id_file, id_name, color)
            return False
            
        elif material_type == "coin": 
            return self.add_coin(id_file, id_name, add_element, license_notice)

        else:
            return self.add_item(id_file, id_name, material_type, add_element, license_notice)
    

    def add_item(self, id_file, id_name, material_type, add_element, license_notice):
        texture_path = f"unification:{id_file}/{id_name}/item/{id_name}_{material_type}"
        if self.FM.handle_texture(self.UT.get_texture_path(id_file, id_name, material_type), self.UT.resource_location_to_path(texture_path), add_element, True):
            path_script_file = os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_item", f"{id_file}.js")
            self.FM.add_kjs(path_script_file, f"    global.scripts.add_item(event, '{id_name}', '{material_type}', '{texture_path}', {self.burn_time})\n", 
                           license_notice, 100, "onEvent('item.registry', event => {\n")
            self.UT.gen_lang_entry(id_file, id_name, material_type)
            return True
        return False
    

    def add_block(self, id_file, id_name, material_type, add_element, license_notice):
        texture_path = f"unification:{id_file}/{id_name}/block/{id_name}_{material_type}"
        if self.FM.handle_texture(self.UT.get_texture_path(id_file, id_name, material_type), self.UT.resource_location_to_path(texture_path), add_element, True):
            path_script_file = os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_block", f"{id_file}.js")
            material_type_extra = "stone" if material_type == "raw_block" else "metal"
            self.FM.add_kjs(path_script_file, (f"    global.scripts.add_block(event, '{id_name}', '{material_type}', '{material_type_extra}', '{texture_path}', "
                           f"{self.harvest_level}, {self.destroy_time}, {self.explosion_resistance}, {self.burn_time})\n"), license_notice, 100, "onEvent('block.registry', event => {\n")
            self.UT.gen_lang_entry(id_file, id_name, material_type)
            return True
        return False
    

    def add_molten(self, id_file, id_name, color, license_notice):
        color = "0xffffff" if color == "" else color
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_fluid", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    global.scripts.add_molten(event, '{id_name}', {color})\n",
                       license_notice, 100, "onEvent('fluid.registry', event => {\n")
        self.UT.gen_lang_entry(id_file, id_name, "molten")
        return True


    def add_slurry(self, id_file, id_name, color, license_notice):
        color = "0xffffff" if color == "" else color
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_slurry", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    global.SLURRY.register('{id_name}_slurry', builder => builder.color({color}))\n", license_notice, 100, "if(Platform.isLoaded('mekanism')){\n", "}")
        self.UT.gen_lang_entry(id_file, id_name, "slurry")
        return True
    

    def add_mysticalagriculture(self, id_file, id_name, color):
        if not self.UT.check_mod("mysticalagriculture"):
            if not self.UT.check_mod_written("mysticalagriculture"):
                self.LM.log_same_message_once("mod_not_found", f"Mod (mysticalagriculture) not found in the mod list")
            return False
        if not self.UT.check_mod("mysticalagradditions") and self.tier == 6:
            if not self.UT.check_mod_written("mysticalagradditions"):
                self.LM.log_same_message_once("mod_not_found", f"Mod (mysticalagradditions) not found in the mod list")
            self.LM.log("tier_not_found", f"Mystical Agriculture Tier 6 crops only exist if Mystical Agradditions is installed. Skipping registry for {id_name}")
            return False
        
        color = "0xffffff" if color == "" else color
        tier = f"mysticalagriculture:{self.tier}" if self.tier != 6 else "mysticalagradditions:6"
        self.FM.add_json(os.path.join(self.UT.pack_path, "config", "mysticalcustomization", "crops", f"{id_name}.json"), (
            f'{{"type": "resource", "tier":"{tier}", "color": "{color.removeprefix("0x")}", "textures": {{'
            f'"flower": "mysticalagriculture:block/flower_{self.flower_type}", '
            f'"essence": "mysticalagriculture:item/essence_{self.essence_type}"}}}}')
        )
        self.UT.gen_lang_entry(id_file, id_name, "mysticalagriculture")
        return True
    

    def add_coin(self, id_file, id_name, add_element, license_notice):
        texture_path = f"unification:{id_file}/{id_name}/item/{id_name}_coin"
        for i in range(5):
            if not self.FM.handle_texture(self.UT.get_texture_path(id_file, id_name, f"coin{i}"), self.UT.resource_location_to_path(texture_path + str(i)), add_element, True):
                for j in range(5):
                    if i != j:
                        self.FM.handle_texture("", self.UT.resource_location_to_path(texture_path + str(j)), False, True)
                    self.FM.remove_json(os.path.join(self.UT.pack_path, "resources", "unification", "models", id_file, id_name, "item", f"{id_name}_coin{i}.json"))
                self.FM.remove_json(os.path.join(self.UT.pack_path, "kubejs", "assets", "unification", "models", "item", f"{id_name}_coin.json"))
                return False
            
            path_model_file = os.path.join(self.UT.pack_path, "resources", "unification", "models", id_file, id_name, "item", f"{id_name}_coin{i}.json")
            model_json = '{"parent": "item/generated", "textures": {"layer0": "' + texture_path + str(i) + '"}}'
            self.FM.add_json(path_model_file, model_json)
        
        self.FM.add_kjs(os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_coin", f"{id_file}.js"), 
                        f"    global.scripts.add_coin(event, '{id_name}', '{texture_path}')\n", license_notice, 100, "onEvent('item.registry', event => {\n")
        self.FM.add_kjs(os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_coin", f"{id_file}_register_item_property.js"),
                        f"    global.scripts.register_item_property('unification:{id_name}_coin')\n", license_notice, 100, "onEvent('postinit', event => {\n")
        self.UT.gen_lang_entry(id_file, id_name, "coin")

        main_model = (f'{{"parent": "item/generated", '
                      f'"textures": {{"layer0": "{texture_path + "0"}"}}, '
                      f'"overrides": ['
                        f'{{"predicate": {{"count": 0.00000}}, "model": "{texture_path + "0"}"}}, '
                        f'{{"predicate": {{"count": 0.03125}}, "model": "{texture_path + "1"}"}}, '
                        f'{{"predicate": {{"count": 0.25000}}, "model": "{texture_path + "2"}"}}, '
                        f'{{"predicate": {{"count": 0.50000}}, "model": "{texture_path + "3"}"}}, '
                        f'{{"predicate": {{"count": 1.00000}}, "model": "{texture_path + "4"}"}}'
                      f']'
                      f'}}')
        self.FM.add_json(os.path.join(self.UT.pack_path, "kubejs", "assets", "unification", "models", "item", f"{id_name}_coin.json"), main_model)
        return True
    

    def jei_hide(self, id_item, id_file, is_block, license_notice):
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "client_scripts", "unification", "jei_hide", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    event.hide('{id_item}')\n", license_notice, 50, "onEvent('jei.hide.items', event => {\n")
        if is_block:
            if self.UT.check_mod("appliedenergistics2"):
                self.FM.add_kjs(path_script_file, f"    event.hide(Item.of('appliedenergistics2:facade', '{{item:\"{id_item}\"}}'))\n", 
                    license_notice, 50, "onEvent('jei.hide.fluids', event => {\n")
            elif not self.UT.check_mod_written("appliedenergistics2"):
                self.LM.log_same_message_once("mod_not_found", f"Mod (appliedenergistics2) not found in the mod list")


    def remove_tag(self, id_item, id_file, id_name, material_type, license_notice):
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "remove_tag", "item", f"{id_file}.js")
        for tag in [f"forge:{material_type}s/{id_name}", f"forge:{material_type}s"]:
            self.FM.add_kjs(path_script_file, f"    event.remove('{tag}', '{id_item}')\n", license_notice, 120, "onEvent('item.tags', event => {\n")
            if material_type in self.UT.get_main_config("advanced.block_material_types", "list_blocks"):
                self.FM.add_kjs(path_script_file.replace("item", "block"), f"    event.remove('{tag}', '{id_item}')\n", license_notice, 120, "onEvent('block.tags', event => {\n")

    def remove_tag_ore(self, id_file, id_name, license_notice):
        for type_tag in ["item", "block"]:
            for tag in [f"forge:ores/{id_name}", f"forge:ores"]:
                path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "remove_tag", type_tag, "ore", f"{id_file}.js")
                self.FM.add_kjs(path_script_file, f"    event.removeAll('{tag}')\n", license_notice, 120, f"onEvent('{type_tag}.tags', event => {{\n")

    
    def replace_input(self, id_item, new_tag, id_file, license_notice):
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "replace_input", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    event.replaceInput({{}}, '{id_item}', '{new_tag}')\n", license_notice, 100, "onEvent('recipes', event => {\n")

    
    def replace_output(self, id_item, new_id_item, id_file, license_notice):
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "replace_output", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    event.replaceOutput({{}}, '{id_item}', '{new_id_item}')\n", license_notice, 100, "onEvent('recipes', event => {\n")


    def replace_loot(self, id_item, new_id_item, id_file, license_notice):
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "replace_loot", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    global.lp.replace(event, '{id_item}', '{new_id_item}')\n", license_notice, 100, "onEvent('lootjs', event => {\n")


    def add_ore(self, id_file, id_name, stratas, drop_info, gem_multiplier, license_notice):
        texture_path = f"unification:{id_file}/{id_name}/block/{id_name}_ore"
        if self.FM.handle_texture(self.UT.get_texture_path(id_file, id_name, "ore"), self.UT.resource_location_to_path(texture_path), True, True):
            drop_function = ""
            if drop_info and not self.UT.get_main_config(f"{drop_info["type"]}_ore_drop_itself", False):
                fortune_part = "with_fortune" if self.UT.get_main_config(f"{drop_info["type"]}_fortune_affected", True) else "without_fortune"
                silk_touch_part = "with_silk_touch" if self.UT.get_main_config(f"{drop_info["type"]}_silk_touch_affected", True) else "without_silk_touch"
                drop_function = f"global.lp.{fortune_part}.{silk_touch_part}"
            path_script_file = os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_ore", f"{id_file}.js")
            path_script_file_drops = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "add_loot", f"{id_file}.js")
            path_recipe_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "add_recipe", "ore", id_file)
            
            for strata in stratas:
                if not self.UT.strata_exists(strata):
                    continue
                id_file_strata = strata[:strata.find(".")]
                id_name_strata = strata[strata.find(".") + 1:]

                resource_location_item_model = f'unification:item/{id_name}_ore_{id_file_strata}_{id_name_strata}'
                resource_location_block_model = f'unification:{id_file}/{id_name}/block/{id_name}_ore/{id_file_strata}/{id_name_strata}/'

                model_path = os.path.join(self.LM.path_program, "base_files", "assets", "models", id_file_strata, id_name_strata)
                if not os.path.isdir(model_path): self.LM.log("asset_folder_missing", f"Missing Strata asset folder: {model_path}"); continue
                for model_file in os.listdir(model_path):
                    model = (self.IOM.read(os.path.join(model_path, model_file)) % (id_file, id_name, id_name, id_file, id_name, id_name)).replace("\n", "").replace("\t", "").replace(" ", "")
                    self.FM.add_json(self.UT.resource_location_to_path(resource_location_block_model + model_file.removesuffix(".json"), "model"), model)

                blockstate_path = os.path.join(self.LM.path_program, "base_files", "assets", "blockstates", id_file_strata, f"{id_name_strata}.json")
                if not os.path.isfile(blockstate_path): self.LM.log("asset_file_missing", f"Missing Strata asset file: {blockstate_path}"); continue
                blockstate = self.IOM.read(blockstate_path)
                blockstate = blockstate % (blockstate.count("model") * (id_file, id_name, id_name))
                blockstate = blockstate.replace("\n", "").replace("\t", "").replace(" ", "")

                self.FM.add_json(self.UT.resource_location_to_path(resource_location_item_model, "model", True), {"parent": resource_location_block_model + "x_0_y_0"})

                strata_object = self.UT.get_strata(strata)
                properties = str([f"BlockProperties.{property_}" for property_ in strata_object["properties"]])#.replace("'", "")
                harvest_level = max(self.harvest_level, strata_object["harvest_level"]) if strata_object["harvest_level"] != -1 else -1
                destroy_time = max(self.destroy_time, strata_object["destroy_time"])
                explosion_resistance = max(self.explosion_resistance, strata_object["explosion_resistance"])

                self.FM.add_kjs(path_script_file, (f"    global.block_ids.push(global.scripts.add_ore(event, '{id_name}', '{id_file_strata}_{id_name_strata}', '{strata_object['material']}', "
                                f"{properties}, '{strata_object['harvest_tool']}', {harvest_level}, {destroy_time}, {explosion_resistance}, {blockstate}, "
                                f"'{resource_location_item_model}'))\n"), license_notice, 95, "onEvent('block.registry', event => {\n")
                self.UT.gen_lang_entry(id_file, id_name, "ore", id_file_strata, id_name_strata)

                ore_id = f"unification:{id_name}_ore_{id_file_strata}_{id_name_strata}"
                if drop_function:
                    self.FM.add_kjs(path_script_file_drops, (f"    {drop_function}(event, '{ore_id}', {drop_info['drops']}, {drop_info['counts']})\n"), 
                                    license_notice, 90, "onEvent('lootjs', event => {\n")
                self.add_tag_ore(id_file, id_name, id_file_strata, id_name_strata, license_notice)
                
                if(self.UT.check_mod("mekanism")):
                    self.FM.add_kjs(os.path.join(path_recipe_file, f"{id_name}.js"), 
                                    f"    global.rp.mekanism.ore(event, '{ore_id}', {drop_info['drops']}, '{strata_object['block']}', {gem_multiplier})\n", 
                                    license_notice, 50, "onEvent('recipes', event => {\n")

            return True
        return False