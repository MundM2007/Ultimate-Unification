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
# Ultimate Unification Copyright (C) 2024 under MIT License by:                   
#         - MundM2007 (https://github.com/MundM2007)

import os

class KJSFileUtilities:
    def __init__(self, UT):
        self.LM = UT.LM
        self.IOM = UT.IOM
        self.FM = UT.FM
        self.UT = UT
        
    # adds a tag to an item
    def add_tag(self, id_item, id_file, id_name, material_type, license_notice):
        path_script_file_item = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "add_tag", "item", f"{id_file}.js")
        is_block = material_type in ["raw_block", "storage_block"]
        for tag in [f"forge:{material_type}s/{id_name}", f"forge:{material_type}s"]:
            self.FM.add_kjs(path_script_file_item, f"    event.add('{tag}', '{id_item}')\n", license_notice, 90, "onEvent('item.tags', event => {\n")
            if is_block:
                path_script_file_block = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "add_tag", "block", f"{id_file}.js")
                self.FM.add_kjs(path_script_file_block, f"    event.add('{tag}', '{id_item}')\n", license_notice, 90, "onEvent('block.tags', event => {\n")
    

    def add_element(self, id_file, id_name, material_type, color, harvest_level, destroy_time, explosion_resistance, add_element, license_notice):
        if material_type in ["raw_block", "storage_block"]:
            return self.add_block(id_file, id_name, material_type, harvest_level, destroy_time, explosion_resistance, add_element, license_notice)
    
        elif material_type.startswith("molten"):
            if add_element: return self.add_molten(id_file, id_name, color, license_notice)
            return False

        elif material_type.startswith("slurry"):
            if add_element: return self.add_slurry(id_file, id_name, color, license_notice)
            return False
    
        elif material_type == "coin": 
            return self.add_coin(id_file, id_name, add_element, license_notice)

        else:
            return self.add_item(id_file, id_name, material_type, add_element, license_notice)
    

    def add_item(self, id_file, id_name, material_type, add_element, license_notice):
        texture_path = f"unification:{id_file}/{id_name}/item/{id_name}_{material_type}"
        if self.FM.handle_texture(self.UT.get_texture_path(id_file, id_name, material_type), self.UT.resource_location_to_path(texture_path), add_element, True):
            path_script_file = os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_item", f"{id_file}.js")
            self.FM.add_kjs(path_script_file, f"    global.scripts.add_item(event, '{id_name}', '{material_type}', '{texture_path}')\n", 
                           license_notice, 100, "onEvent('item.registry', event => {\n")
            self.UT.gen_lang_entry(id_file, id_name, material_type)
            return True
        return False
    

    def add_block(self, id_file, id_name, material_type, harvest_level, destroy_time, explosion_resistance, add_element, license_notice):
        texture_path = f"unification:{id_file}/{id_name}/block/{id_name}_{material_type}"
        if self.FM.handle_texture(self.UT.get_texture_path(id_file, id_name, material_type), self.UT.resource_location_to_path(texture_path), add_element, True):
            path_script_file = os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_block", f"{id_file}.js")
            material_type_extra = "stone" if material_type == "raw_block" else "metal"
            self.FM.add_kjs(path_script_file, (f"    global.scripts.add_block(event, '{id_name}', '{material_type}', '{material_type_extra}', '{texture_path}', "
                           f"{harvest_level}, {destroy_time}, {explosion_resistance})\n"), license_notice, 100, "onEvent('block.registry', event => {\n")
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
        self.FM.add_kjs(path_script_file, f"SLURRY.register('{id_name}_slurry', builder => builder.color({color}))\n", license_notice, 100, "", "")
        self.UT.gen_lang_entry(id_file, id_name, "slurry")
        return True
    

    def add_coin(self, id_file, id_name, add_element, license_notice):
        texture_path_new = f"unification:{id_file}/{id_name}/item/{id_name}_coin"
        for i in range(5):
            if not self.FM.handle_texture(self.UT.get_texture_path(id_file, id_name, f"coin{i}"), self.UT.resource_location_to_path(texture_path_new + str(i)), add_element, True):
                for j in range(5):
                    if i != j:
                        self.FM.handle_texture("", self.UT.resource_location_to_path(texture_path_new + str(j)), False, True)
                    self.FM.remove_json(os.path.join(self.UT.pack_path, "resources", "unification", "models", id_file, id_name, "item", f"{id_name}_coin{i}.json"))
                self.FM.remove_json(os.path.join(self.UT.pack_path, "kubejs", "assets", "unification", "models", "item", f"{id_name}_coin.json"))
                return False
            
            path_model_file = os.path.join(self.UT.pack_path, "resources", "unification", "models", id_file, id_name, "item", f"{id_name}_coin{i}.json")
            model_json = '{"parent": "item/generated", "textures": {"layer0": "' + texture_path_new + str(i) + '"}}'
            self.FM.add_json(path_model_file, model_json)
        
        self.FM.add_kjs(os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_coin", f"{id_file}.js"), 
                       f"    global.scripts.add_coin(event, '{id_name}')\n", license_notice, 100, "onEvent('item.registry', event => {\n")
        self.FM.add_kjs(os.path.join(self.UT.pack_path, "kubejs", "startup_scripts", "unification", "add_coin", f"{id_file}_register_item_property.js"),
                       f"    global.scripts.register_item_property('unification:{id_name}_coin')\n", license_notice, 100, "onEvent('postinit', event => {\n")
        self.UT.gen_lang_entry(id_file, id_name, "coin")

        main_model = (f'{{"parent": "item/generated", '
                      f'"textures": {{"layer0": "{texture_path_new + "0"}"}}, '
                        f'"overrides": ['
                          f'{{"predicate": {{"count": 0.00000}}, "model": "{texture_path_new + "0"}"}}, '
                          f'{{"predicate": {{"count": 0.03125}}, "model": "{texture_path_new + "1"}"}}, '
                          f'{{"predicate": {{"count": 0.25000}}, "model": "{texture_path_new + "2"}"}}, '
                          f'{{"predicate": {{"count": 0.50000}}, "model": "{texture_path_new + "3"}"}}, '
                          f'{{"predicate": {{"count": 1.00000}}, "model": "{texture_path_new + "4"}"}}'
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
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "remove_tag", "items", f"{id_file}.js")
        for tag in [f"forge:{material_type}s/{id_name}", f"forge:{material_type}s"]:
            self.FM.add_kjs(path_script_file, f"    event.remove('{tag}', '{id_item}')\n", license_notice, 120, "onEvent('item.tags', event => {\n")
            if material_type in ["raw_block", "storage_block"]:
                self.FM.add_kjs(path_script_file.replace("items", "blocks"), f"    event.remove('{tag}', '{id_item}')\n", license_notice, 120, "onEvent('block.tags', event => {\n")

    
    def replace_input(self, id_item, new_tag, id_file, license_notice):
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "replace_input", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    event.replaceInput({{}}, '{id_item}', '{new_tag}')\n", license_notice, 100, "onEvent('recipes', event => {\n")

    
    def replace_output(self, id_item, new_id_item, id_file, license_notice):
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "replace_output", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    event.replaceOutput({{}}, '{id_item}', '{new_id_item}')\n", license_notice, 100, "onEvent('recipes', event => {\n")


    def replace_loot(self, id_item, new_id_item, id_file, license_notice):
        path_script_file = os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "replace_loot", f"{id_file}.js")
        self.FM.add_kjs(path_script_file, f"    global.lp.replace(event, '{id_item}', '{new_id_item}')\n", license_notice, 100, "onEvent('lootjs', event => {\n")