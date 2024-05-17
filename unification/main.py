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
import json
import copy

import base_files.python.LoggingManager
import base_files.python.IOManager 
import base_files.python.FileManager
import base_files.python.Utilities
import base_files.python.KJSFileUtilities
import base_files.python.MainExtended

# get path of the program
path_program = os.path.abspath(os.path.dirname(__file__))

# initialize the Managers and Utilities
LM = base_files.python.LoggingManager.LoggingManager(path_program)
IOM = base_files.python.IOManager.IOManager(LM)
FM = base_files.python.FileManager.FileManager(IOM)
UT = base_files.python.Utilities.Utilities(FM)
KFUT = base_files.python.KJSFileUtilities.KJSFileUtilities(UT)
ME = base_files.python.MainExtended.MainExtended(KFUT)

LM.log("info", "Started")

# clears paths
paths_to_clear = [
    os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "add_item"),
    os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "add_block"),
    os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "add_slurry"),
    os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "add_fluid"),
    os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "add_coin"),
    os.path.join(UT.pack_path, "kubejs", "client_scripts", "unification", "jei_hide"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "add_recipe"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "replace_output"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "replace_input"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "replace_loot"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "remove_recipe"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "add_tag"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "remove_tag"),
    os.path.join(UT.pack_path, "kubejs", "assets", "unification", "models", "item"),
    os.path.join(UT.pack_path, "kubejs", "assets", "unification", "textures", "item"),
]
for path in paths_to_clear:
    IOM.clear_path(path)

# used for counting
material_added = 0


# reads the gen scripts info and recipe types info
try:
    gen_scripts_info = json.loads(IOM.read(os.path.join(path_program, "base_files", "gen_scripts_info.json")))
    recipe_types = json.loads(IOM.read(os.path.join(path_program, "base_files", "recipe_types.json")))
except json.JSONDecodeError as e:
    LM.log("critical_json_error", f"Error decoding JSON content of the file: gen_scripts_info.json or recipe_types.json", e)
for recipe_type in recipe_types:
    recipe_types[recipe_type] = (str(recipe_types.get(recipe_type)).removeprefix("[").removesuffix("]").replace("None", "null").replace("False", "false").replace("True", "true"))

# loops over all materials to add
for element in gen_scripts_info.get("main"):
    id_file = element[:element.find(".")]
    id_name = element[element.find(".") + 1:]

    base_file_registry_path = os.path.join(path_program, "base_files", "registry", f"{id_file}.json")
    # checks if the base file exists and is valid
    if not os.path.isfile(base_file_registry_path):
        LM.log("material_file_missing", f"Material Base file missing: {base_file_registry_path} skipping")
        continue
    try:
        base_file_registry = json.loads(IOM.read(base_file_registry_path))
    except json.JSONDecodeError as e:
        LM.log("json_error", f"Error decoding JSON content of the file: {base_file_registry_path}", e)
        continue
    if base_file_registry.get(id_name) is None:
        LM.log("material_missing", f"Material ({id_name}) not found in base file: {base_file_registry_path}")
        continue

    license_notice = base_file_registry.get("license_notice", "")
    if license_notice is not None:
        license_notice = "".join(license_notice)
    
    # opens the file to check if this item is active
    if os.path.isfile(os.path.join(path_program, "config", f"materials.json")):
        try:
            config = json.loads(IOM.read(os.path.join(path_program, "config", f"materials.json")))
        except json.JSONDecodeError as e:
            LM.log("critical_json_error", f"Error decoding JSON content of the file: materials.json", e)

        if config.get(id_name) is False:
            FM.add_json(os.path.join(path_program, "config", f"materials.json"), {id_name: False}, True)
            continue
        else:
            FM.add_json(os.path.join(path_program, "config", f"materials.json"), {id_name: True}, True)
    else:
        FM.add_json(os.path.join(path_program, "config", f"materials.json"), {id_name: True}, True)

    anything_changed = 0

    if base_file_registry[id_name].get("block") is not None:
        harvest_level = base_file_registry[id_name]["block"].get("harvest_level")
        if harvest_level is None:
            harvest_level = 2
            LM.log("value_missing", f"Harvest Level not found for {id_name}, using default value of 2")
        
        destroy_time = base_file_registry[id_name]["block"].get("destroy_time")
        if destroy_time is None:
            destroy_time = 5
            LM.log("value_missing", f"Destroy Time not found for {id_name}, using default value of 5")
        
        explosion_resistance = base_file_registry[id_name]["block"].get("explosion_resistance")
        if explosion_resistance is None:
            explosion_resistance = 6
            LM.log("value_missing", f"Explosion Resistance not found for {id_name}, using default value of 6")
        
    else:
        harvest_level = 2
        destroy_time = 5
        explosion_resistance = 6
        LM.log("value_missing", f"Block values not found for {id_name}, using default values")

    if base_file_registry[id_name].get("add") is not None:
        base_file_registry[id_name]["add"] = set(base_file_registry[id_name]["add"])

    ME.init_actions(harvest_level, destroy_time, explosion_resistance)
    # replaces items with a new texture and adds the tags
    if base_file_registry[id_name].get("replace") is not None:
        # loops over all elements to replace
        for element_to_replace in base_file_registry[id_name]["replace"]:
            anything_changed += ME.replace_element(element_to_replace, id_file, id_name, license_notice)
    
    if base_file_registry[id_name].get("add") is not None:
        base_file_registry[id_name]["add"].update(ME.element_to_add_candidates)
    else:
        base_file_registry[id_name]["add"] = ME.element_to_add_candidates

    if UT.get_main_config("unification.mode", "full") == "full":
        anything_changed += ME.add_and_remove_elements(base_file_registry, id_file, id_name, license_notice)

    elif UT.get_main_config("unification.mode", "full") in ["replace", "no_add"]:
        if base_file_registry[id_name].get("remove") is not None:
            for material_type in copy.deepcopy(base_file_registry[id_name]["add"]):
                if base_file_registry[id_name]["remove"].get(material_type) is not None and material_type not in ME.element_replaced:
                    mods_potential_items = []
                    for element_to_remove in base_file_registry[id_name]["remove"][material_type]:
                        mod_id = element_to_remove[0][:element_to_remove[0].find(":")]
                        if UT.check_mod(mod_id):
                            mods_potential_items.append(mod_id)
                        else:
                            if not UT.check_mod_written(mod_id):
                                LM.log_same_message_once("mod_not_found", f"Mod ({mod_id}) not found in the mod list")

                    mods = list(filter(lambda x: x != None, [UT.get_main_config("unification.mod_overwrites", "dict").get(id_name)]))
                    mods.extend(UT.get_main_config("unification.mod_priorities", "list"))
                    
                    for mod in mods:
                        if mod in mods_potential_items:
                            index_of_item_to_replace = mods_potential_items.index(mod)
                            break
                    else:
                        index_of_item_to_replace = mods_potential_items.index(sorted(mods_potential_items)[0])
                    
                    removal_array = base_file_registry[id_name]["remove"][material_type][index_of_item_to_replace][::-1]
                    removal_array.insert(0, material_type)
                    anything_changed_replace = ME.replace_element(removal_array, id_file, id_name, license_notice)
                    anything_changed += anything_changed_replace
                    if anything_changed_replace > 0:
                        base_file_registry[id_name]["remove"][material_type].pop(index_of_item_to_replace)
                        if(UT.get_main_config("unification.mode", "full") == "replace"): base_file_registry[id_name]["add"].remove(material_type)
                    
                
        if UT.get_main_config("unification.mode", "full") == "replace":
            anything_changed += ME.add_and_remove_elements(base_file_registry, id_file, id_name, license_notice)
        else:
            anything_changed += ME.remove_elements(base_file_registry, id_file, id_name, license_notice)


    if anything_changed > 0:
        material_added += 1

    # checks if the base file exists and is valid
    base_file_recipe_path = os.path.join(path_program, "base_files", "recipe", f"{id_file}.json")
    if not os.path.isfile(base_file_recipe_path):
        LM.log("material_file_missing", f"Material Base file missing: {base_file_recipe_path} skipping")
        continue
    try:
        base_file_recipe = json.loads(IOM.read(base_file_recipe_path))
    except json.JSONDecodeError as e:
        LM.log("json_error", f"Error decoding JSON content of the file: {base_file_recipe_path}", e)
        continue
    if base_file_recipe.get(id_name) is None:
        LM.log("material_missing", f"Material ({id_name}) not found in base file: {base_file_recipe_path}")
        continue

    license_notice = base_file_recipe.get("license_notice", "")
    if license_notice is not None:
        license_notice = "".join(license_notice)
    
    recipe_types_active = set()
    if UT.get_main_config("unification.replace_recipes", False) is True:
        if base_file_recipe[id_name].get("remove") is not None:
            recipe_types_active = ME.remove_recipes(base_file_recipe, id_file, id_name, True, license_notice)
        else:
            recipe_types_active = set()
        recipe_types_active.update(UT.get_main_config("unification.recipe_types_to_keep", "list"))
        recipe_types_active.difference_update(UT.get_main_config("unification.recipe_types_to_remove", "list"))
    else:
        if base_file_recipe[id_name].get("remove") is not None:
            ME.remove_recipes(base_file_recipe, id_file, id_name, False, license_notice)

    if base_file_recipe[id_name].get("add") is not None:
        mns = {**ME.element_replaced, **ME.element_added}
        if base_file_recipe[id_name].get("variants") is not None:
            for material in base_file_recipe[id_name]["variants"]:
                if material not in mns:
                    mns[material] = base_file_recipe[id_name]["variants"][material]

        ME.add_recipes(base_file_recipe, id_file, id_name, mns, recipe_types, recipe_types_active, license_notice)
            
FM.save()
IOM.copy_tree(os.path.join(path_program, "base_files", "textures", "general", "copy"), os.path.join(UT.pack_path, "kubejs", "assets", "unification", "textures"))
LM.log("info", (f"Materials added: {material_added}, Types added: {ME.type_added}, Textures replaced: {ME.texture_replaced}, Elements removed: {ME.element_removed} "
                f"Recipes removed: {ME.recipe_removed}, Amount of Recipe Presets that will be run: {ME.recipe_added}"))
LM.log("info", "Finished")
LM.save()