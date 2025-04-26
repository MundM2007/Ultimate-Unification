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

import os
import json
import copy

import base_files.python.LoggingManager
import base_files.python.IOManager 
import base_files.python.FileManager
import base_files.python.Utilities
import base_files.python.KJSFileUtilities
import base_files.python.MainExtended

# gets the path of the program
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

if os.path.isfile(os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "remove_worldgen.js")):
    os.remove(os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "remove_worldgen.js"))
        
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


# transfers some general settings to a kubejs file for use in recipepresets / manualunification
FM.add_kjs(os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "generalsettings.js"), 
           (f"let raw_lower_output = {UT.get_main_config('ores.raw_lower_output', True)}\n" +
           f"let raw_ore_processing = {UT.get_main_config('ores.raw_ore_processing', True)}\n" +
           f"let disable_ftbic_recipe_gen = {not UT.get_main_config('unification.replace_recipes', False)}\n" +
           f"let new_seed_recipes = {UT.get_main_config('unification.new_seed_recipes', True)}\n" + 
           f"let replace_recipes = {UT.get_main_config('unification.replace_recipes', False)}\n")
           .replace("False", "false").replace("True", "true"), "", 250, "", "")

# initializes strata
for stratum in gen_scripts_info.get("stratum", []):
    id_file = stratum[:stratum.find(".")]
    id_name = stratum[stratum.find(".") + 1:]

    base_file_stratum_path = os.path.join(path_program, "base_files", "stratum", f"{id_file}.json")
    # checks if the base file exists and is valid
    if not os.path.isfile(base_file_stratum_path):
        LM.log("stratum_file_missing", f"Material Base file missing: {base_file_stratum_path} skipping")
        continue
    try:
        base_file_stratum = json.loads(IOM.read(base_file_stratum_path))
    except json.JSONDecodeError as e:
        LM.log("json_error", f"Error decoding JSON content of the file: {base_file_stratum_path} skipping", e)
        continue
    if base_file_stratum.get(id_name) is None:
        LM.log("stratum_missing", f"Material ({id_name}) not found in base file: {base_file_stratum_path}")
        continue

    UT.register_stratum(stratum, base_file_stratum[id_name])


# loops over all materials to add
for element in gen_scripts_info.get("main", []):
    #
    # REGISTRY
    #
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

    # registers material properties to the KFUT class and sets defaults
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
    
    # adds the candidates to the list of elements to add
    if base_file_registry[id_name].get("add") is not None:
        base_file_registry[id_name]["add"].update(ME.element_to_add_candidates)
    else:
        base_file_registry[id_name]["add"] = ME.element_to_add_candidates

    # handles the exact json files
    if UT.get_main_config("unification.mode", "full") == "full":
        anything_changed += ME.add_and_remove_elements(base_file_registry, id_file, id_name, license_notice)

    elif UT.get_main_config("unification.mode", "full") in ["replace", "no_add"]:
        if base_file_registry[id_name].get("remove") is not None:
            for material_type in copy.deepcopy(base_file_registry[id_name]["add"]):
                if base_file_registry[id_name]["remove"].get(material_type) is not None and material_type not in ME.element_replaced:
                    # gots potential items that can be used to replace instead of add, for that goes through each material type in add and checks remove
                    mods_potential_items = []
                    for element_to_remove in base_file_registry[id_name]["remove"][material_type]:
                        mod_id = element_to_remove[0][:element_to_remove[0].find(":")]
                        if UT.check_mod(mod_id):
                            mods_potential_items.append(mod_id)
                        else:
                            if not UT.check_mod_written(mod_id):
                                LM.log_same_message_once("mod_not_found", f"Mod ({mod_id}) not found in the mod list")

                    # gets prefered mods
                    mods = list(filter(lambda x: x != None, [UT.get_main_config("unification.mod_overwrites", "dict").get(id_name)]))
                    mods.extend(UT.get_main_config("unification.mod_priorities", "list"))
                    
                    # gets the index of the first mod that is marked as a potential one. if none is found, it takes the first one in the alphabetically sorted potential list
                    for mod in mods:
                        if mod in mods_potential_items:
                            index_of_item_to_replace = mods_potential_items.index(mod)
                            break
                    else:
                        index_of_item_to_replace = mods_potential_items.index(sorted(mods_potential_items)[0])
                    
                    # orders the list needed and replaces the item
                    removal_array = base_file_registry[id_name]["remove"][material_type][index_of_item_to_replace][::-1]
                    removal_array.insert(0, material_type)
                    anything_changed_replace = ME.replace_element(removal_array, id_file, id_name, license_notice)
                    anything_changed += anything_changed_replace
                    if anything_changed_replace > 0:
                        # removes the element from the remove list, so the item isn't removed again
                        base_file_registry[id_name]["remove"][material_type].pop(index_of_item_to_replace)
                        # removes the element from the add list, so the item isn't added again for the replace mode
                        if(UT.get_main_config("unification.mode", "full") == "replace"): base_file_registry[id_name]["add"].remove(material_type)
                    
        # adds remaining items (for replace mode) and removes the items in remove section
        if UT.get_main_config("unification.mode", "full") == "replace":
            anything_changed += ME.add_and_remove_elements(base_file_registry, id_file, id_name, license_notice)
        else:
            anything_changed += ME.remove_elements(base_file_registry, id_file, id_name, license_notice)

    # statistics
    if anything_changed > 0:
        material_added += 1

    #
    # RECIPES
    #

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
    
    # gets all active recipes types depending on config and removed recipes if needed
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
        # organizies all known info about a material in a dict (mns = material names)
        mns = {**ME.element_replaced, **ME.element_added}
        if base_file_recipe[id_name].get("variants") is not None:
            for material in base_file_recipe[id_name]["variants"]:
                if material not in mns:
                    mns[material] = base_file_recipe[id_name]["variants"][material]

        # adds recipes and extract gem multiplier for further use
        ME.add_recipes(base_file_recipe, id_file, id_name, mns, recipe_types_active, license_notice)
        if mns.get("gem_multiplier") is not None:
            gem_multiplier = mns["gem_multiplier"]


    #
    # ORES
    #
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
            if base_file_registry.get("enabled", True) is False:
                continue
            
            license_notice = base_file_registry.get("license_notice", "")
            if license_notice is not None:
                license_notice = "".join(license_notice)
            
            # gets all relevant strata for the ore
            all_strata = set()
            for ore_object in base_file_ore[id_name].get("variants", []):
                if ore_object.get("values") is not None:
                    strata = UT.get_strata_in_values(ore_object["values"])
                    all_strata.update(strata)
                    # adds the ore generation for the ore for each variant
                    if ore_object.get("generation") is not None:
                        KFUT.add_ore_gen(id_file, id_name, strata, ore_object["generation"], license_notice)

            # gets the drop info for the ore (drops, type, counts)
            drop_info = None
            if base_file_ore[id_name].get("loot") is not None and base_file_ore[id_name]["loot"].get("drops") is not None:
                drop_info = {"drops": base_file_ore[id_name]["loot"]["drops"] if isinstance(base_file_ore[id_name]["loot"]["drops"], list) else [base_file_ore[id_name]["loot"]["drops"]]}
                drop_info["type"] = base_file_ore[id_name]["loot"].get("type", "metal")
                counts = base_file_ore[id_name]["loot"].get("counts", [1])
                drop_info["counts"] = counts if isinstance(counts, list) else [counts]
                drop_info["stratum_mult_enabled"] = bool(base_file_ore[id_name]["loot"].get("stratum_multiplier_enabled", True))
            
            KFUT.add_ore(id_file, id_name, all_strata, drop_info, gem_multiplier, license_notice)

            # disables other ores as specified in remove
            if UT.get_main_config('ores.disable_other_ores', None) is not None:
                if base_file_ore[id_name].get("remove") is not None:
                    for ore in base_file_ore[id_name]["remove"]:
                        if UT.get_main_config('ores.disable_other_ores', None) is True:
                            KFUT.jei_hide(ore, id_file, True, license_notice)
                            KFUT.remove_tag_ore(ore, id_file, license_notice)
                        elif UT.get_main_config('ores.disable_other_ores', None) is False:
                            KFUT.add_tag_ore_other(ore, id_file, id_name, license_notice)


# disables other ores generation
if UT.get_main_config('ores.disable_other_ores', None) is not None:
    # handeles mc and default configs
    IOM.traverse_path(os.path.join(path_program, "base_files", "ore_generation_disabling", "mc_config"), ME.overwrite_config)
    IOM.traverse_path(os.path.join(path_program, "base_files", "ore_generation_disabling", "mc_defaultconfig"), ME.overwrite_config)

    # disables ore generation by replacing the configured features with empty json files
    config_features_to_disable = json.loads(IOM.read(os.path.join(path_program, "base_files", "ore_generation_disabling", "mc_configured_feature.json")))
    for mod in config_features_to_disable.get("locations", {}).keys():
        for ore in config_features_to_disable["locations"][mod]:
            file_path = os.path.join(UT.pack_path, "kubejs", "data", mod, "worldgen", "configured_feature", f"{ore}.json")
            if UT.get_main_config('ores.disable_other_ores', None) is True:
                FM.add_text(file_path, '{"type": "minecraft:no_op", "config": {}}')
            elif os.path.isfile(file_path):
                IOM.remove(file_path)

    # disables ores that allow none of the above by using kubejs removeFeatureById and removeOres
    config_disable_ore_gen_kubejs = json.loads(IOM.read(os.path.join(path_program, "base_files", "ore_generation_disabling", "kubejs_worldgen_remove.json")))
    for feature_id in config_disable_ore_gen_kubejs.get("feature_ids", []):
        FM.add_kjs(os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "remove_worldgen.js"), f"    event.removeFeatureById('underground_ores', '{feature_id}')\n",
            "", 250, "onEvent('worldgen.remove', event => {\n")
    if config_disable_ore_gen_kubejs.get("ore_ids", []) != []:
        FM.add_kjs(os.path.join(UT.pack_path, "kubejs", "startup_scripts", "unification", "remove_worldgen.js"), 
            f"    event.removeOres(ores => {{ores.blocks = {config_disable_ore_gen_kubejs.get("ore_ids")}}})\n", "", 250, "onEvent('worldgen.remove', event => {\n")

# removes some recipes that can only be disabled using the mod's config
IOM.traverse_path(os.path.join(path_program, "base_files", "recipe", "mc_config_recipe_disabling"), ME.overwrite_config)
    

# saves all files, copies the assets that can be copied one on one, gives statistics and saves the log
FM.save()
IOM.copy_tree(os.path.join(path_program, "base_files", "assets", "copy"), os.path.join(UT.pack_path, "kubejs", "assets", "unification"))
LM.log("info", (f"Materials added: {material_added}, Types added: {ME.type_added}, Textures replaced: {ME.texture_replaced}, Elements removed: {ME.element_removed}, "
                f"Recipes removed: {ME.recipe_removed}, Amount of Recipe Presets that will be run: {ME.recipe_added}"))
LM.log("info", "Finished")
LM.save()