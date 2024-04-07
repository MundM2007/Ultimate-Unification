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
texture_replaced = 0
type_added = 0
element_removed = 0

gen_scripts_info = json.loads(IOM.read(os.path.join(path_program, "base_files", "gen_scripts_info.json")))
recipe_types = json.loads(IOM.read(os.path.join(path_program, "base_files", "recipe", "recipe_types.json")))
for recipe_type in recipe_types:
    recipe_types[recipe_type] = (str(recipe_types.get(recipe_type)).removeprefix("[").removesuffix("]").replace("None", "null").replace("False", "false").replace("True", "true"))

for element in gen_scripts_info.get("main"):
    id_file = element[:element.find(".")]
    id_name = element[element.find(".") + 1:]
    base_file_registry_path = os.path.join(path_program, "base_files", "registry", f"{id_file}.json")
    base_file_registry = json.loads(IOM.read(base_file_registry_path))
    
    if base_file_registry.get(id_name) is None:
        LM.log("material_missing", f"Material ({id_name}) not found in base file: {base_file_registry_path}")
        continue

    license_notice = base_file_registry.get("license_notice", "")
    if license_notice is not None:
        license_notice = "".join(license_notice)
    
    # opens the file to check if this item is active
    if os.path.isfile(os.path.join(path_program, "config", f"materials.json")):
        config = json.loads(IOM.read(os.path.join(path_program, "config", f"materials.json")))
        if config.get(id_name) is False:
            FM.addJson(os.path.join(path_program, "config", f"materials.json"), {id_name: False})
            continue
        else:
            FM.addJson(os.path.join(path_program, "config", f"materials.json"), {id_name: True})
    else:
        FM.addJson(os.path.join(path_program, "config", f"materials.json"), {id_name: True})
    
    anything_changed = 0
    all_added_or_replaced = dict()
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



                        # make sure to adjust when having replace_gem_textures false
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
    
    if base_file_registry[id_name].get("add") is not None:
        for element_to_add in base_file_registry[id_name]["add"]:
            if not UT.check_material(element_to_add):
                continue

            color = ""
            if element_to_add.startswith("slurry") or element_to_add.startswith("molten"):
                if re.search(r'^#[0-9a-fA-F]{6}$', element_to_add.replace("slurry", "").replace("molten", "")):
                    color = "0x" + element_to_add.replace("slurry#", "").replace("molten#", "")
                    element_to_add = element_to_add[:-7]

            if KFUT.add_element(id_file, id_name, element_to_add, color, license_notice):
                if element_to_add == "slurry":
                    all_added_or_replaced["clean_slurry"] = f"unification:clean_{id_name}_slurry"
                    all_added_or_replaced["dirty_slurry"] = f"unification:dirty_{id_name}_slurry"
                else:
                    all_added_or_replaced[element_to_add] = f"unification:{id_name}_{element_to_add}"
                globals()["type_added"] += 1
                anything_changed += 1
                if not element_to_add.startswith("slurry") and not element_to_add.startswith("molten"):
                    is_block = element_to_add in ["raw_block", "storage_block"]
                    KFUT.add_tag(id_file, f"unification:{id_name}_{element_to_add}", f"forge:{element_to_add}s/{id_name}", is_block, license_notice)
                    KFUT.add_tag(id_file, f"unification:{id_name}_{element_to_add}", f"forge:{element_to_add}s", is_block, license_notice)
    
    if base_file_registry[id_name].get("remove") is not None:
        for check_remove, new_item in all_added_or_replaced.items():
            if base_file_registry[id_name]["remove"].get(check_remove) is not None:
                for element_to_remove in base_file_registry[id_name]["remove"][check_remove]:
                    mod_id = element_to_remove[:element_to_remove.find(":")]
                    if UT.check_mod(mod_id) is False:
                        continue

                    globals()["element_removed"] += 1
                    anything_changed += 1
                    KFUT.jei_hide(element_to_remove, id_file, license_notice)
                    KFUT.remove_tag(element_to_remove, id_file, element_to_add in ["raw_block", "storage_block"], license_notice)
                    KFUT.replace_input(element_to_remove, f"#forge:{check_remove}/{id_name}", id_file, license_notice)
                    KFUT.replace_output(element_to_remove, new_item, id_file, license_notice)

    base_file_recipe_path = os.path.join(path_program, "base_files", "recipe", f"{id_file}.json")
    base_file_recipe = json.loads(IOM.read(base_file_recipe_path))

    if base_file_recipe.get(id_name) is None:
        LM.log("material_missing", f"Material ({id_name}) not found in base file: {base_file_registry_path}")
        continue

    license_notice = base_file_registry.get("license_notice", "")
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

            arguments = recipe_types.get(recipe).replace("'id_name'", f"'{id_name}'")
            for material in mns:
                arguments = arguments.replace(f"'{material}'", f"'{mns[material]}'")
            FM.addKJS(os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "add_recipe", id_file, f"{id_name}.js"), 
                      f"    global.rp.{recipe}(event, " + arguments + ")\n", license_notice, 50, "onEvent('recipes', event => {\n")
    
    if base_file_recipe[id_name].get("remove") is not None:
        for recipe in base_file_recipe[id_name]["remove"]:
            FM.addKJS(os.path.join(UT.get_pack_path(), "kubejs", "server_scripts", "unification", "remove_recipe", f"{id_file}.js"), 
                      f"    event.remove({{id: '{recipe}'}})\n", license_notice, 40, "onEvent('recipes', event => {\n")



FM.save()
IOM.copy_tree(os.path.join(path_program, "base_files", "textures", "general", "copy"), os.path.join(UT.get_pack_path(), "kubejs", "assets", "unification"))
LM.log("info", "Finished")
LM.save()