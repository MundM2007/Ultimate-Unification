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
# Ultimate Unification Copyright (C) 2023-2025 under MIT License by:              
#         - MundM2007 (https://github.com/MundM2007)

import re
import os
import json
import copy

class MainExtended:
    def __init__(self, KFUT):
        self.LM = KFUT.LM
        self.IOM = KFUT.IOM
        self.FM = KFUT.FM
        self.UT = KFUT.UT
        self.KFUT = KFUT

        self.texture_replaced = 0
        self.type_added = 0
        self.element_removed = 0
        self.recipe_removed = 0
        self.recipe_added = 0



    # initializes important variables
    def init_actions(self):
        self.all_element_replaced = set()
        self.element_added = dict()
        self.element_replaced = dict()
        self.element_to_add_candidates = set()

    
    # transfers recipe types to ME
    def set_recipe_types(self, recipe_types):
        self.recipe_types = recipe_types


    # replaces elements listed in the replace section of the base file
    def replace_element(self, material_type, id_file, id_name, license_notice):
        anything_changed = 0
        if len(material_type) == 3:
            if self.UT.check_material(material_type[0]):
                mod_id = material_type[2][:material_type[2].find(":")]
                if self.UT.check_mod(mod_id):
                    if material_type[1] != "":
                        # gets the path of the texture from which it should be copied
                        path_texture = self.UT.get_texture_path(id_file, id_name, material_type[0], material_type[1])
                        
                        # replaces the texture 
                        gem_disabled = (material_type[0] != "gem" or self.UT.get_main_config("unification.replace_gem_textures", True) is True)
                        if self.UT.get_main_config("unification.replace_textures", True) is True and gem_disabled:
                            if self.FM.handle_texture(path_texture, self.UT.resource_location_to_path(material_type[1]), True, False):
                                self.texture_replaced += 1
                                anything_changed += 1
                        else:
                            # removes the texture if disabled
                            self.FM.handle_texture("", self.UT.resource_location_to_path(material_type[1]), False, False)
                    
                    # adds the tags
                    if material_type[0] not in self.all_element_replaced and "slurry" not in material_type[0] and "molten" not in material_type[0]:
                        self.KFUT.add_tag(material_type[2], id_file, id_name, material_type[0], license_notice)
                        anything_changed += 1
                        self.all_element_replaced.add(material_type[0])
                    
                    self.element_replaced[material_type[0]] = material_type[2]

                else:
                    if not self.UT.check_mod_written(mod_id):
                        self.LM.log_same_message_once("mod_not_found", f"Mod ({mod_id}) not found in the mod list")
                    # removes the texture if the mod doesn't exist
                    self.FM.handle_texture("", self.UT.resource_location_to_path(material_type[1]), False, False)
                        
                    # adds the element to the list of elements that can be added if enabled
                    if self.UT.get_main_config("unification.add_failed_replacements", True) is True:
                        if "slurry" not in material_type[0] and "molten" not in material_type[0]:
                            self.element_to_add_candidates.add(material_type[0])

            else:
                # removes the texture if the material type doesn't exist
                self.FM.handle_texture("", self.UT.resource_location_to_path(material_type[1]), False, False)
                self.KFUT.add_element(id_file, id_name, material_type[0], 0, 0, 0, 0, 0, False, license_notice)  
            
        return anything_changed
    

    def add_element(self, material_type, id_file, id_name, license_notice):
        # extract color and element name
        color = ""
        if material_type.startswith("slurry") or material_type.startswith("molten") or material_type.startswith("mysticalagriculture"):
            if re.search(r'^#[0-9a-fA-F]{6}$', material_type.replace("slurry", "").replace("molten", "").replace("mysticalagriculture", "")):
                color = "0x" + material_type.replace("slurry#", "").replace("molten#", "").replace("mysticalagriculture#", "")
                material_type = material_type[:-7]

        add_element = True
        if material_type in self.element_replaced or not self.UT.check_material(material_type):
            add_element = False

        # adds the element
        if self.KFUT.add_element(id_file, id_name, material_type, color, add_element, license_notice):
            # item id is added to a dictionary to be used later
            if material_type == "slurry":
                self.element_added["clean_slurry"] = f"unification:clean_{id_name}_slurry"
                self.element_added["dirty_slurry"] = f"unification:dirty_{id_name}_slurry"
            elif material_type == "mysticalagriculture":
                self.element_added["essence"] = f"mysticalagriculture:{id_name}_essence"
                self.element_added["seed"] = f"mysticalagriculture:{id_name}_seeds"
                self.element_added["crop"] = f"mysticalagriculture:{id_name}_crop"
                self.element_added["tier"] = self.KFUT.tier
            else:
                self.element_added[material_type] = f"unification:{id_name}_{material_type}"

            # adds the tags
            if material_type == "mysticalagriculture":
                self.KFUT.add_tag(f"mysticalagriculture:{id_name}_seeds", id_file, id_name, "seed", license_notice)
                self.KFUT.add_tag(f"mysticalagriculture:{id_name}_essence", id_file, id_name, "essence", license_notice)
            elif not material_type.startswith("slurry") and not material_type.startswith("molten"):
                self.KFUT.add_tag(f"unification:{id_name}_{material_type}", id_file, id_name, material_type, license_notice)
            
            self.type_added += 1
            return 1
        return 0
    

    def remove_element(self, removal_array, id_file, id_name, material_type, new_item, license_notice):
        # checks if the mod exists
        mod_id = removal_array[0][:removal_array[0].find(":")]
        if not self.UT.check_mod(mod_id):
            if not self.UT.check_mod_written(mod_id):
                self.LM.log_same_message_once("mod_not_found", f"Mod ({mod_id}) not found in the mod list")
            return 0

        # removes the element
        self.KFUT.jei_hide(removal_array[0], id_file, material_type in self.UT.get_main_config("advanced.block_material_types", "list_blocks"), license_notice)
        self.KFUT.remove_tag(removal_array[0], id_file, id_name, material_type, license_notice)
        self.KFUT.replace_input(removal_array[0], f"#forge:{material_type}s/{id_name}", id_file, license_notice)
        self.KFUT.replace_output(removal_array[0], new_item, id_file, license_notice)
        self.KFUT.replace_loot(removal_array[0], new_item, id_file, license_notice)

        self.element_removed += 1
        return 1
    

    def add_and_remove_elements(self, base_file_registry, id_file, id_name, license_notice):
        anything_changed = 0
        # adds materials types listed in add
        if base_file_registry[id_name].get("add") is not None:
            for material_type in base_file_registry[id_name]["add"]:
                anything_changed += self.add_element(material_type, id_file, id_name, license_notice)
        

        # removes items, for which a new item was added / another one was replaced
        if base_file_registry[id_name].get("remove") is not None:
            for material_type, new_item in {**self.element_replaced, **self.element_added}.items():
                if base_file_registry[id_name]["remove"].get(material_type) is not None:
                    for removal_array in base_file_registry[id_name]["remove"][material_type]:
                        anything_changed += self.remove_element(removal_array, id_file, id_name, material_type, new_item, license_notice)
        
        return anything_changed


    def remove_elements(self, base_file_registry, id_file, id_name, license_notice):
        # removes items, for which another one was replaced for that it loops over all elements that were replaced and checks if one of that material type is listed in the remove section
        anything_changed = 0
        if base_file_registry[id_name].get("remove") is not None:
            for material_type, new_item in self.element_replaced.items():
                if base_file_registry[id_name]["remove"].get(material_type) is not None:
                    for removal_array in base_file_registry[id_name]["remove"][material_type]:
                        anything_changed += self.remove_element(removal_array, id_file, id_name, material_type, new_item, license_notice)
        
        return anything_changed


    def remove_recipes(self, base_file_recipe, id_file, id_name, track_recipe_types, license_notice):
        recipe_types = set()
        # loops over all recipes ids set in remove, check if the mod for it exists, if so removes the recipe
        for recipe in base_file_recipe[id_name]["remove"]:
            mod_id = recipe[0][:recipe[0].find(":")]
            if self.UT.check_mod(mod_id):
                self.FM.add_kjs(os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "remove_recipe", f"{id_file}.js"), 
                    f"    event.remove({{id: '{recipe[0]}'}})\n", license_notice, 40, "onEvent('recipes', event => {\n")
                self.recipe_removed += 1
                # keeps track of the recipe types that were removed if replace recipes is enabled
                if track_recipe_types:
                    recipe_types.add(recipe[1])
            else:
                if not self.UT.check_mod_written(mod_id):
                    self.LM.log_same_message_once("mod_not_found", f"Mod ({mod_id}) not found in the mod list")
        return recipe_types
    

    def add_recipes(self, base_file_recipe, id_file, id_name, mns, recipe_types_active, license_notice):
        recipes = base_file_recipe[id_name]["add"]

        # used for correct manualunification recipe handling
        recipes.append(f"manual.{id_file}.{id_name}")

        mns["recipe_kept"] = f"manual.{id_file}.{id_name}" in self.UT.get_main_config("unification.recipe_types_to_keep", "list")
        
        for recipe in recipes:
            # checks if the mod exists
            mod_id = recipe[:recipe.find(".")]
            if mod_id != "manual":
                if not self.UT.check_mod(mod_id):
                    if not self.UT.check_mod_written(mod_id):
                        self.LM.log_same_message_once("mod_not_found", f"Mod ({mod_id}) not found in the mod list")
                    continue

            # makes sure that this recipe type is actually active
            if self.UT.get_main_config("unification.replace_recipes", False) is True and recipe not in recipe_types_active and mod_id != "manual":
                continue
            if self.recipe_types.get(recipe) is None or recipe in self.UT.get_main_config("unification.recipe_types_to_remove", "list"):
                continue
            
            # replaces id name with the material name
            arguments = self.recipe_types.get(recipe).replace("'id_name'", f"'{id_name}'")
            continue_recipe = False
            # checks if slurry is actually there for the specified material, cause this can't be checked in javascript code easily
            for slurry in ["clean_slurry", "dirty_slurry"]:
                if slurry in arguments and slurry not in mns:
                    continue_recipe = True
                    break
            if continue_recipe:
                continue

            # replaces the material names with the actual items
            for material in mns:
                if material in ["recipe_kept"]:
                    arguments = arguments.replace(f"'{material}'", f"{mns[material]}").replace("False", "false").replace("True", "true").replace("None", "null")
                if material in ["gem_multiplier", "energy_from_coin", "count_block", "mysticalagriculture_craft_type", "tier", "mysticalagriculture_output_multiplier"]:
                    arguments = arguments.replace(f"'{material}'", f"{mns[material]}")
                else:
                    arguments = arguments.replace(f"'{material}'", f"'{mns[material]}'")

            # if the recipe contains a hyphen, then use brackets to access the property
            parts = recipe.split(".")
            result_recipe = []
            for part in parts:
                if "-" in part: result_recipe.append(f"['{part}']")
                else: result_recipe.append(f".{part}")
            
            # adds to the file and keeps track of how many recipe presets will be run
            self.FM.add_kjs(os.path.join(self.UT.pack_path, "kubejs", "server_scripts", "unification", "add_recipe", id_file, f"{id_name}.js"), 
                    f"    global.rp{"".join(result_recipe)}(event, " + arguments + ")\n", license_notice, 50, "onEvent('recipes', event => {\n")
            self.recipe_added += 1

    
    # config overwriting
    def overwrite_config(self, config_path):
        config_overwrite_json = json.loads(self.IOM.read(config_path))
        # gets config type, which is specified by the file name
        type_config_file = config_path[config_path[:config_path.rfind(".")].rfind(".") + 1:].removesuffix(".json")
        config_paths = dict()

        # structures the config information in a useable way, where the path is the key and the config key aswell as new and default value are stored in a list
        for option in config_overwrite_json.get("replace"):
            if option[0] in config_paths:
                key_value_pairs = config_paths[option[0]]
                key_value_pairs[0].append(option[1])
                key_value_pairs[1].append(option[2])
                key_value_pairs[2].append(option[3])
            else:
                config_paths[option[0]] = [[option[1]], [option[2]], [option[3]]]
        

        current_path = ""
        # gets the file path where the actual config file is located
        if config_path.find("defaultconfig") != -1:
            file = os.path.join(self.UT.pack_path, "defaultconfigs", config_path.replace(os.path.join(self.LM.path_program, "base_files", "ore_generation_disabling", "mc_defaultconfig"), "")
                .removeprefix("\\").removesuffix(".json"))
        elif config_path.find("recipe") != -1:
            file = os.path.join(self.UT.pack_path, "config", config_path.replace(os.path.join(self.LM.path_program, "base_files", "recipe", "mc_config_recipe_disabling"), "")
                .removeprefix("\\").removesuffix(".json"))
        else:
            file = os.path.join(self.UT.pack_path, "config", config_path.replace(os.path.join(self.LM.path_program, "base_files", "ore_generation_disabling", "mc_config"), "")
                .removeprefix("\\").removesuffix(".json"))

        # error message if the file doesn't exist
        if not os.path.isfile(file):
            self.LM.log("config_file_missing", f"MC Config file missing: {file} skipping, make sure to run the game at least once and check if you have copied all folders from the download")
            return

        if type_config_file == "toml":
            for line in self.IOM.readlines(file):
                line_lstrip = line.lstrip()
                # ignore comments, but keep them in the file
                if line_lstrip.startswith("#"):
                    self.FM.add_text(file, line)
                    continue

                # a bracket always denotes a new path, so the current path is set to the new one, this line is also kept in the file
                if line_lstrip.startswith("["):
                    current_path = line_lstrip[line_lstrip.find("[") + 1:line_lstrip.find("]")]
                    self.FM.add_text(file, line)
                    continue
                
                # if the current path is one where a change is needed, get the key of the current line
                if current_path in config_paths:
                    option = line_lstrip[:line_lstrip.find("=")].rstrip()
                    # check if the key is one that needs to be changed
                    for i in range(len(config_paths[current_path][0])):
                        if option == config_paths[current_path][0][i]:
                            # replaces the current value with the new one, replace is used to keep the formating of the file
                            replace_with = 1 if self.UT.get_main_config('ores.disable_other_ores', None) is True else 2
                            line = line.replace(line_lstrip[line_lstrip.find("=") + 1:].lstrip(), str(config_paths[current_path][replace_with][i]).replace("False", "false").replace("True", "true"))
                            break
                
                # add the (un)modified line to the file
                self.FM.add_text(file, line)
        
        elif type_config_file == "cfg":
            current_path = ""
            for line in self.IOM.readlines(file):
                line_strip = line.lstrip().rstrip()
                # ignore comments, but keep them in the file
                if line_strip.startswith("#"):
                    self.FM.add_text(file, line)
                    continue

                # an opening bracket always denotes that a new path element starts, so the current path is set to the new one, this line is also kept in the file
                if line_strip.endswith("{"):
                    if current_path != "":
                        current_path += "."
                    current_path += line_strip[line_strip.find('"') + 1:line_strip.rfind('"')]
                    self.FM.add_text(file, line)
                    continue
                # a closing always denotes that the last path element is removed, so the current path is updated accordingly, this line is also kept in the file
                if line_strip.endswith("}"):
                    if current_path.rfind(".") == -1: 
                        current_path = ""
                    else: 
                        current_path = current_path[:current_path.rfind(".")]
                    self.FM.add_text(file, line)
                    continue

                # if the current path is one where a change is needed, get the key of the current line
                if current_path in config_paths:
                    option = line_strip[line_strip.find('"') + 1:line_strip.rfind('"')]
                    # check if the key is one that needs to be changed
                    for i in range(len(config_paths[current_path][0])):
                        if option == config_paths[current_path][0][i]:
                            # replaces the current value with the new one, replace is used to keep the formating of the file
                            replace_with = 1 if self.UT.get_main_config('ores.disable_other_ores', None) is True else 2
                            line = line.replace(line_strip[line_strip.find("=") + 1:].lstrip(), str(config_paths[current_path][replace_with][i]).replace("False", "false").replace("True", "true"))
                            break
            
                # add the (un)modified line to the file
                self.FM.add_text(file, line)

        elif type_config_file == "json5":
            current_path = ""
            multiline_comment = False
            for line in self.IOM.readlines(file):
                line_strip = line.lstrip().rstrip()
                # ignore comments, handle multiline comments, but keep them in the file
                if multiline_comment:
                    self.FM.add_text(file, line)
                    if line_strip.endswith("*/"):
                        multiline_comment = False
                    continue
                if line_strip.startswith("//"):
                    self.FM.add_text(file, line)
                    continue
                if line_strip.startswith("/*"):
                    multiline_comment = True
                    self.FM.add_text(file, line)
                    continue

                # an opening bracket always denotes that a new path element starts, so the current path is set to the new one, this line is also kept in the file
                if line_strip.endswith("{"):
                    if current_path != "":
                        current_path += "."
                    current_path += line_strip[:line_strip.rfind(":")]
                    self.FM.add_text(file, line)
                    continue
                # a closing always denotes that the last path element is removed, so the current path is updated accordingly, this line is also kept in the file
                if line_strip.removesuffix(",").endswith("}"):
                    if current_path.rfind(".") == -1: 
                        current_path = ""
                    else: 
                        current_path = current_path[:current_path.rfind(".")]
                    self.FM.add_text(file, line)
                    continue
                
                # if the current path is one where a change is needed, get the key of the current line
                if current_path in config_paths:
                    option = line_strip[:line_strip.find(":")].rstrip()
                    # check if the key is one that needs to be changed
                    for i in range(len(config_paths[current_path][0])):
                        if option == config_paths[current_path][0][i]:
                            # replaces the current value with the new one, replace is used to keep the formating of the file
                            replace_with = 1 if self.UT.get_main_config('ores.disable_other_ores', None) is True else 2
                            line = line.replace(line_strip[line_strip.find(":") + 1:].lstrip().removesuffix(","), 
                                str(config_paths[current_path][replace_with][i]).replace("False", "false").replace("True", "true"))
                            break
            
                # add the (un)modified line to the file
                self.FM.add_text(file, line)

        elif type_config_file == "json":
            # opens the json file and checks if the path exists by iterating over the keys
            json_file = json.loads(self.IOM.read(file))
            for path in config_paths.keys():
                current_path = json_file
                for key in path.split("."):
                    if current_path.get(key) is not None:
                        current_path = current_path[key]

                # check if the option that need to be changed exists
                for i in range(len(config_paths[path][0])):
                    if current_path.get(config_paths[path][0][i]) is not None:
                        # overwrites the current value with the new one
                        replace_with = 1 if self.UT.get_main_config('ores.disable_other_ores', None) is True else 2
                        current_path[config_paths[path][0][i]] = config_paths[path][replace_with][i]
                
                # adds the (un)modified json file to the file manager, with pretty print
                self.FM.add_json(file, json_file, True)
