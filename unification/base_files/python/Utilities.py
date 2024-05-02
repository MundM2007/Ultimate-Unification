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

import json
import os
import copy
import functools

class Utilities:
    # initializes the utilities and creates a mod list
    def __init__(self, FM):
        self.LM = FM.LM
        self.IOM = FM.IOM
        self.FM = FM
        self.pack_path = os.path.abspath(os.path.join(self.LM.path_program, os.pardir))

        self.mod_list = {"minecraft": True}
        try:
            mod_list_config = json.loads(self.IOM.read(os.path.join(self.LM.path_program, "config", "mod_list.json")))
        except json.JSONDecodeError as e:
            self.LM.log("critical_json_error", f"Error decoding JSON content of the file: mod_list.json", e)
        for mod in mod_list_config:
            if mod_list_config[mod]:
                self.mod_list.update({mod: True})
            else:
                self.mod_list.update({mod: False})

        self.langs = []
        for id_file in os.listdir(os.path.join(self.LM.path_program, "base_files", "lang")):
            if os.path.isfile(os.path.join(self.LM.path_program, "base_files", "lang", id_file)):
                base_file_lang = os.path.join(self.LM.path_program, "base_files", "lang", f"{id_file}")
                # checks if the lang file is valid
                try:
                    base_file_registry = json.loads(self.IOM.read(base_file_lang))
                    base_file_registry["lang"] = id_file.removesuffix(".json")
                    self.langs.append(base_file_registry)
                except json.JSONDecodeError as e:
                    self.LM.log("json_error", f"Error decoding JSON content of the file: {base_file_lang} skipping this lang", e)
         
        # reads the main config
        try:
            self.config = json.loads(self.IOM.read(os.path.join(self.LM.path_program, "config", "main.json")))
        except json.JSONDecodeError as e:
            self.LM.log("critical_json_error", f"Error decoding JSON content of the file: main.json", e)


    # gets the file path from a resource location
    def resource_location_to_path(self, resource_location, type_rc="texture", kubejs_assets=False):
        namespace = resource_location[:resource_location.find(":")]
        path = resource_location[resource_location.find(":") + 1:]
        storage_location = "kubejs\\assets" if kubejs_assets else "resources"
        if type_rc == "texture":
            return os.path.join(self.pack_path, storage_location, namespace, "textures", f"{path}.png")
        elif type_rc == "model":
            return os.path.join(self.pack_path, storage_location, namespace, "models", f"{path}.json")
        elif type_rc == "blockstate":
            return os.path.join(self.pack_path, storage_location, namespace, "blockstates", f"{path}.json")
        elif type_rc == "lang":
            return os.path.join(self.pack_path, storage_location, namespace, "lang", f"{path}.json")
        return ""


    # gets the base files texture path
    def get_texture_path(self, id_file, id_name, material_type, new_texture_rl=""):
        extra_texture_name = (new_texture_rl[-1] if material_type == "coin" else "") if new_texture_rl != "" else ""
        return os.path.join(self.LM.path_program, "base_files", "textures", "general", id_file, id_name, 
                            "block" if material_type in ["raw_block", "storage_block"] else "item", 
                            f"{id_name}_{material_type}{extra_texture_name}.png")
                    

    # checks if a mod is in the mod list
    def check_mod(self, mod_id):
        return mod_id in self.mod_list and self.mod_list[mod_id]
    

    def check_mod_written(self, mod_id):
        return mod_id in self.mod_list

    # checks if a material type is from a mod that is in the mod list
    def check_material(self, material_type):
        mod_mapping = {
            "crystal": "mekanism",
            "shard": "mekanism",
            "clump": "mekanism",
            "dirty_dust": "mekanism",
            "slurry": "mekanism",
            "fragment": "bloodmagic",
            "gravel": "bloodmagic",
            "crushed": "create"
        }

        if "slurry" in material_type:
            material_type = "slurry"

        if material_type in mod_mapping:
            if not self.check_mod(mod_mapping[material_type]):
                if not self.check_mod_written(mod_mapping[material_type]):
                    self.LM.log("mod_not_found", f"Mod {mod_mapping[material_type]} not found in the mod list")
                return False

        return True
    

    def get_lang_key(self, id_name, material_type):
        if material_type in ["raw_block", "storage_block"]:
            return f"block.unification.{id_name}_{material_type}"
        elif material_type == "molten":
            return f"fluid.unification.{id_name}_molten"
        elif material_type == "dirty_slurry":
            return f"slurry.unification.dirty_{id_name}_slurry"
        elif material_type == "clean_slurry":
            return f"slurry.unification.clean_{id_name}_slurry"
        else:
            return f"item.unification.{id_name}_{material_type}"


    def gen_lang_entry(self, id_file, id_name, material_type):
        for lang in self.langs:
            path_lang_file = self.resource_location_to_path(f"unification:{lang.get('lang')}", "lang")
            for material_type in [f"dirty_{material_type}", f"clean_{material_type}"] if material_type in ["slurry"] else [material_type]:
                if lang.get(f"{id_file}.{id_name}.{material_type}") is not None:
                    self.FM.add_json(path_lang_file, {self.get_lang_key(id_name, material_type): lang.get(f"{id_file}.{id_name}.{material_type}")})
                else:
                    if lang.get(material_type) is not None:
                        if lang.get(f"{id_file}.{id_name}") is not None:
                            self.FM.add_json(path_lang_file, {self.get_lang_key(id_name, material_type): lang.get(material_type) % lang.get(f"{id_file}.{id_name}")})
                        else:
                            self.LM.log("lang_entry_missing", f"Missing lang entry for {id_file}.{id_name} in the lang file: {lang.get('lang')}")
                    else:
                        self.LM.log("lang_entry_missing", f"Missing lang entry for {material_type} in the lang file: {lang.get('lang')}")

    
    @functools.lru_cache()
    def get_main_config(self, config_path, fallback):
        config_temp = copy.deepcopy(self.config)
        for key in config_path.split("."):
            if config_temp.get(key) is not None:
                config_temp = config_temp[key]
            else:
                return {} if fallback == "dict" else [] if fallback == "list" else fallback
        return config_temp