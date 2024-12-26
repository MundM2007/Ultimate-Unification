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
    os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "add_ore"),
    os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "remove_worldgen.js"),
    os.path.join(UT.pack_path, "kubejs", "client_scripts", "unification", "jei_hide"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "add_recipe"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "add_tag"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "add_loot"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "replace_output"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "replace_input"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "replace_loot"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "remove_recipe"),
    os.path.join(UT.pack_path, "kubejs", "server_scripts", "unification", "remove_tag"),
    os.path.join(UT.pack_path, "kubejs", "assets", "unification", "models", "item"),
    os.path.join(UT.pack_path, "kubejs", "assets", "unification", "textures", "item")
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
ME.set_recipe_types(recipe_types)


for strata in gen_scripts_info.get("strata", []):
    id_file = strata[:strata.find(".")]
    id_name = strata[strata.find(".") + 1:]

    base_file_strata_path = os.path.join(path_program, "base_files", "strata", f"{id_file}.json")
    # checks if the base file exists and is valid
    if not os.path.isfile(base_file_strata_path):
        LM.log("strata_file_missing", f"Material Base file missing: {base_file_strata_path} skipping")
        continue
    try:
        base_file_strata = json.loads(IOM.read(base_file_strata_path))
    except json.JSONDecodeError as e:
        LM.log("json_error", f"Error decoding JSON content of the file: {base_file_strata_path} skipping", e)
        continue
    if base_file_strata.get(id_name) is None:
        LM.log("strata_missing", f"Material ({id_name}) not found in base file: {base_file_strata_path}")
        continue

    UT.register_strata(strata, base_file_strata[id_name])


# loops over all materials to add
for element in gen_scripts_info.get("main", []):
    id_file = element[:element.find(".")]
    id_name = element[element.find(".") + 1:]

    base_file_registry_path = os.path.join(path_program, "base_files", "registry", "general", f"{id_file}.json")
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

    KFUT.register_material_property(base_file_registry, id_name, "block.harvest_level", 2)
    KFUT.register_material_property(base_file_registry, id_name, "block.destroy_time", 5)
    KFUT.register_material_property(base_file_registry, id_name, "block.explosion_resistance", 6)
    KFUT.register_material_property(base_file_registry, id_name, "burn_time", 0)
    KFUT.register_material_property(base_file_registry, id_name, "mysticalagriculture.flower_type", "ingot")
    KFUT.register_material_property(base_file_registry, id_name, "mysticalagriculture.essence_type", "ingot")
    KFUT.register_material_property(base_file_registry, id_name, "mysticalagriculture.tier", 1)

    if base_file_registry[id_name].get("add") is not None:
        base_file_registry[id_name]["add"] = set(base_file_registry[id_name]["add"])

    ME.init_actions()
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

    gem_multiplier = 1
    if base_file_recipe[id_name].get("add") is not None:
        mns = {**ME.element_replaced, **ME.element_added}
        if base_file_recipe[id_name].get("variants") is not None:
            for material in base_file_recipe[id_name]["variants"]:
                if material not in mns:
                    mns[material] = base_file_recipe[id_name]["variants"][material]

        ME.add_recipes(base_file_recipe, id_file, id_name, mns, recipe_types_active, license_notice)
        if mns.get("gem_multiplier") is not None:
            gem_multiplier = mns["gem_multiplier"]


    if UT.get_main_config("ores.active", True) is True:
        base_file_ore_path = os.path.join(path_program, "base_files", "registry", "ore", f"{id_file}.json")
        # checks if the base file exists and is valid
        success = False
        if os.path.isfile(base_file_ore_path):
            try:
                base_file_ore = json.loads(IOM.read(base_file_ore_path))
                if base_file_ore.get(id_name) is not None:
                    success = True
            except json.JSONDecodeError as e:
                LM.log("json_error", f"Error decoding JSON content of the file: {base_file_ore_path}, skipping", e)

        if success:       
            license_notice = base_file_registry.get("license_notice", "")
            if license_notice is not None:
                license_notice = "".join(license_notice)
            
            all_stratas = []
            for ore_object in base_file_ore[id_name].get("variants", []):
                if ore_object.get("values") is not None:
                    all_stratas.extend(UT.get_stratas_in_values(ore_object["values"]))
            
            drop_info = None
            if base_file_ore[id_name].get("drops") is not None:
                drop_info = {"drops": base_file_ore[id_name]["drops"] if isinstance(base_file_ore[id_name]["drops"], list) else [base_file_ore[id_name]["drops"]]}
                drop_info["type"] = base_file_ore[id_name].get("type", "metal")
                counts = base_file_ore[id_name].get("counts", [1])
                drop_info["counts"] = counts if isinstance(counts, list) else [counts]
            
            KFUT.add_ore(id_file, id_name, all_stratas, drop_info, gem_multiplier, license_notice)

FM.add_kjs(os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "generalsettings.js"), 
           (f"let metal_ore_drops_fortune = {not UT.get_main_config('ores.metal_ore_drop_itself', False) and UT.get_main_config('ores.metal_fortune_affected', True)}\n" +
           f"let enable_raw_recipes = {not UT.get_main_config('ores.metal_ore_drop_itself', False)}\n" +
           f"let disable_ftbic_recipe_gen = {not UT.get_main_config('unification.replace_recipes', False)}\n" +
           f"let new_seed_recipes = {UT.get_main_config('unification.new_seed_recipes', True)}").replace("False", "false").replace("True", "true"),
           "", 250, "", "")

if UT.get_main_config('ores.disable_other_ores', None) is not None:
    IOM.traverse_path(os.path.join(path_program, "base_files", "ore_generation_disabling", "mc_config"), ME.overwrite_config)
    IOM.traverse_path(os.path.join(path_program, "base_files", "ore_generation_disabling", "mc_defaultconfig"), ME.overwrite_config)

    config_features_to_disable = json.loads(IOM.read(os.path.join(path_program, "base_files", "ore_generation_disabling", "mc_configured_feature.json")))
    for mod in config_features_to_disable.get("locations", {}).keys():
        for ore in config_features_to_disable["locations"][mod]:
            file_path = os.path.join(UT.pack_path, "kubejs", "data", mod, "worldgen", "configured_feature", f"{ore}.json")
            if UT.get_main_config('ores.disable_other_ores', None) is True:
                FM.add_text(file_path, "{}")
            elif os.path.isfile(file_path):
                IOM.remove(file_path)

    config_disable_ore_gen_kubejs = json.loads(IOM.read(os.path.join(path_program, "base_files", "ore_generation_disabling", "kubejs_worldgen_remove.json")))
    for feature_id in config_disable_ore_gen_kubejs.get("feature_ids", []):
        FM.add_kjs(os.path.join(UT.pack_path, "kubejs", "startup_scripts", "remove_worldgen.js"), f"    event.removeFeatureById('underground_ores', '{feature_id}')\n",
            "", 250, "onEvent('worldgen.remove', event => {\n")
    if config_disable_ore_gen_kubejs.get("ore_ids", []) != []:
        FM.add_kjs(os.path.join(UT.pack_path, "kubejs", "startup_scripts", "remove_worldgen.js"), 
            f"    event.removeOres(ores => {{ores.blocks = {config_disable_ore_gen_kubejs.get("ore_ids")}}})\n", "", 250, "onEvent('worldgen.remove', event => {\n")


    

FM.save()
IOM.copy_tree(os.path.join(path_program, "base_files", "assets", "copy"), os.path.join(UT.pack_path, "kubejs", "assets", "unification"))
LM.log("info", (f"Materials added: {material_added}, Types added: {ME.type_added}, Textures replaced: {ME.texture_replaced}, Elements removed: {ME.element_removed}, "
                f"Recipes removed: {ME.recipe_removed}, Amount of Recipe Presets that will be run: {ME.recipe_added}"))
LM.log("info", "Finished")
LM.save()