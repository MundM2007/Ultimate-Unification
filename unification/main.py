import os
import json
import re

import base_files.python.LoggingManager
import base_files.python.IOManager 
import base_files.python.FileManager
import base_files.python.Utilities
import base_files.python.KJSFileUtilities

# get path of the program
path_program = os.path.abspath(os.path.dirname(__file__))

# initialize the Managers and Utilities
LM = base_files.python.LoggingManager.LoggingManager(path_program)
IOM = base_files.python.IOManager.IOManager(LM)
FM = base_files.python.FileManager.FileManager(IOM)
UT = base_files.python.Utilities.Utilities(FM)
KFUT = base_files.python.KJSFileUtilities.KJSFileUtilities(UT)

LM.log("info", "Started")

total_time = 0
# clears paths
paths_to_clear = [
    os.path.join(UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_item"),
    os.path.join(UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_block"),
    os.path.join(UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_slurry"),
    os.path.join(UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_fluid"),
    os.path.join(UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_coin"),
    os.path.join(UT.get_pack_path(), "kubejs", "client_scripts", "unification", "jei_hide"),
    os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "add_recipe"),
    os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "replace_output"),
    os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "replace_input"),
    os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "remove_recipe"),
    os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "add_tag"),
    os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "remove_tag"),
    os.path.join(UT.get_pack_path(), "kubejs", "assets", "unification")
]
for path in paths_to_clear:
    IOM.clear_path(path)

# used for counting
material_added = 0
type_added = 0
texture_replaced = 0
element_removed = 0

# reads the main config
try:
    config = json.loads(IOM.read(os.path.join(path_program, "config", "main.json")))
except json.JSONDecodeError as e:
    LM.log("critical_json_error", f"Error decoding JSON content of the file: main.json", e)

# reads the gen scripts info and recipe types info
try:
    gen_scripts_info = json.loads(IOM.read(os.path.join(path_program, "base_files", "gen_scripts_info.json")))
    recipe_types = json.loads(IOM.read(os.path.join(path_program, "base_files", "recipe", "recipe_types.json")))
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
            FM.addJson(os.path.join(path_program, "config", f"materials.json"), {id_name: False}, True)
            continue
        else:
            FM.addJson(os.path.join(path_program, "config", f"materials.json"), {id_name: True}, True)
    else:
        FM.addJson(os.path.join(path_program, "config", f"materials.json"), {id_name: True}, True)

    anything_changed = 0
    all_added_or_replaced = dict()

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

    # replaces items with a new texture and adds the tags
    if base_file_registry[id_name].get("replace") is not None:
        all_element_to_replace = []
        # loops over all elements to replace
        for element_to_replace in base_file_registry[id_name]["replace"]:
            if len(element_to_replace) == 3:
                if UT.check_material(element_to_replace[0]):
                    if element_to_replace[1] != "":
                        # gets the path of the texture from which it should be copied
                        path_texture = UT.get_texture_path(id_file, id_name, element_to_replace[0], element_to_replace[1])
                        
                        # replaces the texture 
                        if element_to_replace[0] != "gem" or config.get("unification") is None or config["unification"].get("replace_gem_texture") is True:
                            if FM.handleTexture(path_texture, UT.resource_location_to_path(element_to_replace[1]), True, False):
                                globals()["texture_replaced"] += 1
                                anything_changed += 1
                    
                    # adds the tags
                    if element_to_replace[0] not in all_element_to_replace and "slurry" not in element_to_replace[0] and "molten" not in element_to_replace[0]:
                        is_block = element_to_add in ["raw_block", "storage_block"]
                        KFUT.add_tag(id_file, element_to_replace[2], f"forge:{element_to_replace[0]}s/{id_name}", is_block, license_notice)
                        KFUT.add_tag(id_file, element_to_replace[2], f"forge:{element_to_replace[0]}s", is_block, license_notice)
                        anything_changed += 1
                        all_element_to_replace.append(element_to_replace[0])
                    
                    all_added_or_replaced[element_to_replace[0]] = element_to_replace[2]
                else:
                    # removes the texture if the material type doesn't exist
                    FM.handleTexture("", UT.resource_location_to_path(element_to_replace[2]), False, False)
    
    # adds new items with tags
    if base_file_registry[id_name].get("add") is not None:
        # loops over all elements to add
        for element_to_add in base_file_registry[id_name]["add"]:
            if not UT.check_material(element_to_add):
                continue

            # extract color and element name
            color = ""
            if element_to_add.startswith("slurry") or element_to_add.startswith("molten"):
                if re.search(r'^#[0-9a-fA-F]{6}$', element_to_add.replace("slurry", "").replace("molten", "")):
                    color = "0x" + element_to_add.replace("slurry#", "").replace("molten#", "")
                    element_to_add = element_to_add[:-7]

            # adds the element
            if KFUT.add_element(id_file, id_name, element_to_add, color, license_notice, harvest_level, destroy_time, explosion_resistance):
                # item id is added to a dictionary to be used later
                if element_to_add == "slurry":
                    all_added_or_replaced["clean_slurry"] = f"unification:clean_{id_name}_slurry"
                    all_added_or_replaced["dirty_slurry"] = f"unification:dirty_{id_name}_slurry"
                else:
                    all_added_or_replaced[element_to_add] = f"unification:{id_name}_{element_to_add}"
                globals()["type_added"] += 1
                anything_changed += 1

                # adds the tags
                if not element_to_add.startswith("slurry") and not element_to_add.startswith("molten"):
                    is_block = element_to_add in ["raw_block", "storage_block"]
                    KFUT.add_tag(id_file, f"unification:{id_name}_{element_to_add}", f"forge:{element_to_add}s/{id_name}", is_block, license_notice)
                    KFUT.add_tag(id_file, f"unification:{id_name}_{element_to_add}", f"forge:{element_to_add}s", is_block, license_notice)
    
    # removes elements and replaces the recipes
    if base_file_registry[id_name].get("remove") is not None:
        # loops over all elements to remove
        for check_remove, new_item in all_added_or_replaced.items():
            if base_file_registry[id_name]["remove"].get(check_remove) is not None:
                for element_to_remove in base_file_registry[id_name]["remove"][check_remove]:
                    mod_id = element_to_remove[:element_to_remove.find(":")]
                    if not UT.check_mod(mod_id):
                        continue

                    # removes the element
                    globals()["element_removed"] += 1
                    anything_changed += 1
                    KFUT.jei_hide(element_to_remove, id_file, license_notice)
                    KFUT.remove_tag(element_to_remove, id_file, element_to_add in ["raw_block", "storage_block"], license_notice)
                    KFUT.replace_input(element_to_remove, f"#forge:{check_remove}/{id_name}", id_file, license_notice)
                    KFUT.replace_output(element_to_remove, new_item, id_file, license_notice)

    if anything_changed > 0:
        globals()["material_added"] += 1

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
    
    if base_file_recipe[id_name].get("add") is not None:
        mns = all_added_or_replaced
        if base_file_recipe[id_name].get("variants") is not None:
            for material in base_file_recipe[id_name]["variants"]:
                if material not in mns:
                    mns[material] = base_file_recipe[id_name]["variants"][material]

        for recipe in base_file_recipe[id_name]["add"]:
            if recipe_types.get(recipe) is None:
                continue

            stop_recipe = False
            arguments = recipe_types.get(recipe).replace("'id_name'", f"'{id_name}'")
            for material in mns:
                if material in ["gem_multiplier", "energy_from_coin"]:
                    arguments = arguments.replace(f"'{material}'", f"{mns[material]}")
                else:
                    arguments = arguments.replace(f"'{material}'", f"'{mns[material]}'")

            FM.addKJS(os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "add_recipe", id_file, f"{id_name}.js"), 
                      f"    global.rp.{recipe}(event, " + arguments + ")\n", license_notice, 50, "onEvent('recipes', event => {\n")
    
    if base_file_recipe[id_name].get("remove") is not None:
        for recipe in base_file_recipe[id_name]["remove"]:
            FM.addKJS(os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "remove_recipe", f"{id_file}.js"), 
                      f"    event.remove({{id: '{recipe}'}})\n", license_notice, 40, "onEvent('recipes', event => {\n")

FM.save()
IOM.copy_tree(os.path.join(path_program, "base_files", "textures", "general", "copy"), os.path.join(UT.get_pack_path(), "kubejs", "assets", "unification", "textures"))
LM.log("info", f"Materials added: {material_added}, Types added: {type_added}, Textures replaced: {texture_replaced}, Elements removed: {element_removed}")
LM.log("info", "Finished")
LM.save()