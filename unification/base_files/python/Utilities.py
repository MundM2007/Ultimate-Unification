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

        # assign each mod either true or false, depending weither it is active or not, for checking if a mod is in the mod list
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
                base_file_lang_location = os.path.join(self.LM.path_program, "base_files", "lang", f"{id_file}")
                # checks if the lang file is valid, and adds all lanuages to a list
                try:
                    base_file_lang = json.loads(self.IOM.read(base_file_lang_location))
                    base_file_lang["lang"] = id_file.removesuffix(".json")
                    self.langs.append(base_file_lang)
                except json.JSONDecodeError as e:
                    self.LM.log("json_error", f"Error decoding JSON content of the file: {base_file_lang_location} skipping this language", e)
         
        # reads the main config
        try:
            self.config = json.loads(self.IOM.read(os.path.join(self.LM.path_program, "config", "main.json")))
        except json.JSONDecodeError as e:
            self.LM.log("critical_json_error", f"Error decoding JSON content of the file: main.json", e)
        
        # intializes strata dictionarizes
        self.strata = dict()
        self.stratum_tags = dict()


    # gets the file path from a resource location
    def resource_location_to_path(self, resource_location, type_rc="texture", kubejs_assets=False):
        namespace = resource_location[:resource_location.find(":")]
        path = resource_location[resource_location.find(":") + 1:]
        if self.get_main_config("unification.resource_loader", "lmr") == "kubejs":
            kubejs_assets = True
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
        return os.path.join(self.LM.path_program, "base_files", "assets", "textures", id_file, id_name, 
                            "block" if material_type in ["ore"] + self.get_main_config("advanced.block_material_types", "list_blocks") else "item", 
                            f"{id_name}_{material_type}{extra_texture_name}.png")
                    

    # checks if a mod is in the mod list and active
    def check_mod(self, mod_id):
        return mod_id in self.mod_list and self.mod_list[mod_id]
    

    # checks if a mod is in the mod list
    def check_mod_written(self, mod_id):
        return mod_id in self.mod_list


    # checks if a material type is from a mod that is in the mod list and active
    def check_material(self, material_type):
        if self.get_main_config("unification.disable_material_type_check", False) is True:
            return True

        mod_mapping = {
            "crystal": "mekanism",
            "shard": "mekanism",
            "clump": "mekanism",
            "dirty_dust": "mekanism",
            "slurry": "mekanism",
            "fragment": "bloodmagic",
            "gravel": "bloodmagic",
            "crushed_ore": "create",
        }

        if "slurry" in material_type:
            material_type = "slurry"

        # logs error if mod is not found in the mod list
        if material_type in mod_mapping:
            if not self.check_mod(mod_mapping[material_type]):
                if not self.check_mod_written(mod_mapping[material_type]):
                    self.LM.log_same_message_once("mod_not_found", f"Mod {mod_mapping[material_type]} not found in the mod list")
                return False

        return True


    # gets the language key for a specific id name and material type
    def get_lang_key(self, id_name, material_type, id_file_stratum="", id_name_stratum=""):
        if material_type == "ore":
            return f"block.unification.{id_name}_ore_{id_file_stratum}_{id_name_stratum}"
        elif material_type in self.get_main_config("advanced.block_material_types", "list_blocks"):
            return f"block.unification.{id_name}_{material_type}"
        elif material_type == "molten":
            return f"fluid.unification.{id_name}_molten"
        elif material_type == "dirty_slurry":
            return f"slurry.unification.dirty_{id_name}_slurry"
        elif material_type == "clean_slurry":
            return f"slurry.unification.clean_{id_name}_slurry"
        elif material_type == "mysticalagriculture":
            return f"crop.mysticalcustomization.{id_name}"
        else:
            return f"item.unification.{id_name}_{material_type}"


    def gen_lang_entry(self, id_file, id_name, material_type, id_file_stratum="", id_name_stratum=""):
        # if id_file_stratum is not empty, it means that the material type is an ore
        if id_file_stratum:
            # do this for every language file
            for lang in self.langs:
                # get path of the lang file in the game
                path_lang_file = self.resource_location_to_path(f"unification:{lang.get('lang')}", "lang")
                # check if this specific material, and stratum (so this specific ore) have a lang entry, if so use that
                if lang.get(f"{id_file}.{id_name}.{material_type}.{id_file_stratum}.{id_name_stratum}") is not None:
                    self.FM.add_json(path_lang_file, {
                        self.get_lang_key(id_name, material_type, id_file_stratum, id_name_stratum): 
                        lang.get(f"{id_file}.{id_name}.{material_type}.{id_file_stratum}.{id_name_stratum}")
                    })
                # if not check if the material type has a lang entry, and use that instead and replace the %s with the stratum name
                elif lang.get(f"{id_file}.{id_name}.{material_type}") is not None:
                    if lang.get(f"stratum.{id_file_stratum}.{id_name_stratum}") is not None:
                            self.FM.add_json(path_lang_file, {
                                self.get_lang_key(id_name, material_type, id_file_stratum, id_name_stratum): 
                                lang.get(f"{id_file}.{id_name}.{material_type}") % lang.get(f"stratum.{id_file_stratum}.{id_name_stratum}")
                            })
                    else:
                        self.LM.log("lang_entry_missing", f"Missing lang entry for stratum.{id_file_stratum}.{id_name_stratum} in the lang file: {lang.get('lang')}")
                # if not check if the material type has a lang entry, and use that instead and replace the %s with the material name and stratum name
                elif lang.get(material_type) is not None:
                    if lang.get(f"{id_file}.{id_name}") is not None:
                        if lang.get(f"stratum.{id_file_stratum}.{id_name_stratum}") is not None:
                            self.FM.add_json(path_lang_file, {
                                self.get_lang_key(id_name, material_type, id_file_stratum, id_name_stratum): 
                                lang.get(material_type) % (lang.get(f"{id_file}.{id_name}"), lang.get(f"stratum.{id_file_stratum}.{id_name_stratum}"))
                            })
                        else:
                            self.LM.log_same_message_once("lang_entry_missing", f"Missing lang entry for stratum.{id_file_stratum}.{id_name_stratum} in the lang file: {lang.get('lang')}")
                    else:
                        self.LM.log_same_message_once("lang_entry_missing", f"Missing lang entry for {id_file}.{id_name} in the lang file: {lang.get('lang')}")
                else:
                    self.LM.log_same_message_once("lang_entry_missing", f"Missing lang entry for {material_type} in the lang file: {lang.get('lang')}")
        else:
            # do this for every language file
            for lang in self.langs:
                # get path of the lang file in the game
                path_lang_file = self.resource_location_to_path(f"unification:{lang.get('lang')}", "lang")
                # generate two lang entries if we have a slurry, one for dirty and one for clean
                for material_type in [f"dirty_{material_type}", f"clean_{material_type}"] if material_type in ["slurry"] else [material_type]:
                    # check if this specific item has a lang entry, if so use that
                    if lang.get(f"{id_file}.{id_name}.{material_type}") is not None:
                        self.FM.add_json(path_lang_file, {self.get_lang_key(id_name, material_type): lang.get(f"{id_file}.{id_name}.{material_type}")})
                    # if not check if the material type has a lang entry, and use that instead and replace the %s with the material name
                    elif lang.get(material_type) is not None:
                        if lang.get(f"{id_file}.{id_name}") is not None:
                            self.FM.add_json(path_lang_file, {self.get_lang_key(id_name, material_type): lang.get(material_type) % lang.get(f"{id_file}.{id_name}")})
                        else:
                            self.LM.log_same_message_once("lang_entry_missing", f"Missing lang entry for {id_file}.{id_name} in the lang file: {lang.get('lang')}")
                    else:
                        self.LM.log_same_message_once("lang_entry_missing", f"Missing lang entry for {material_type} in the lang file: {lang.get('lang')}")

    
    # used to get a main config option, and also has a fallback option if the config option is not found, uses lru_chache because this is called a lot with the same parameters
    @functools.lru_cache()
    def get_main_config(self, config_path, fallback):
        config_temp = copy.deepcopy(self.config)
        for key in config_path.split("."):
            if config_temp.get(key) is not None:
                config_temp = config_temp[key]
            else:
                return {} if fallback == "dict" else [] if fallback == "list" else ["raw_block", "storage_block"] if fallback == "list_blocks" else fallback
        return config_temp


    # registers a stratum in the above defined strata dictionary, and also adds it to the stratum_tags dictionary if it has tags
    def register_stratum(self, name, stratumDict):
        if not self.check_mod(name[:name.find(".")]):
            if not self.check_mod_written(name[:name.find(".")]):
                self.LM.log_same_message_once("mod_not_found", f"Mod {name[:name.find('.')]} not found in the mod list")
            return

        # error if no block is defined in the stratum
        if stratumDict.get("block") is None:
            self.LM.log("stratum_error", f"Stratum '{name}' is missing a 'block' field. It will be ignored.")
            return
        
        # transfer relevant information and sets defaults
        self.strata[name] = {
            "block": stratumDict["block"],
            "dimension": stratumDict.get("dimension", "default"),
            "properties": stratumDict.get("properties", []),
            "falling": stratumDict.get("falling", False),
            "material": stratumDict.get("material", "rock"),
            "sound_type": stratumDict.get("sound_type", "stone"),
            "harvest_tool": stratumDict.get("harvest_tool", "pickaxe"),
            "harvest_level": stratumDict.get("harvest_level", 0),
            "destroy_time": stratumDict.get("destroy_time", 1.5),
            "explosion_resistance": stratumDict.get("explosion_resistance", 6)
        }

        # adds the specific tags to the stratum_tags dictionary, and add the stratum to it
        for tag in stratumDict.get("tags", []):
            if tag in self.stratum_tags:
                self.stratum_tags[tag].append(name)
            else:
                self.stratum_tags[tag] = [name]


    # checks if a stratum exists in the strata dictionary
    def stratum_exists(self, name):
        return name in self.strata


    # gets the stratum information from the strata dictionary
    def get_stratum(self, name):
        return self.strata.get(name, {})


    # gets all strata in the values section of the ore, handling tags and normal strata
    def get_strata_in_values(self, values):
        strata = []
        for value in values:
            if value.startswith("#"):
                strata.extend(self.stratum_tags.get(value[1:], []))
            elif self.stratum_exists(value):
                strata.append(value)

        return strata
    

    # gets the ore drop function for the drop info, so weither to use fortune or silk touch, and check if the ore should drop itself
    def get_ore_drop_function(self, drop_info): 
        if self.get_main_config(f"{drop_info["type"]}_ore_drop_itself", False): return ""
        if not drop_info: return "global.rp.without_fortune.without_silk_touch"
        fortune_part = "with_fortune" if self.get_main_config(f"{drop_info["type"]}_fortune_affected", True) else "without_fortune"
        silk_touch_part = "with_silk_touch" if self.get_main_config(f"{drop_info["type"]}_silk_touch_affected", True) else "without_silk_touch"
        return f"global.lp.{fortune_part}.{silk_touch_part}"
    

    # get the blockstate of an stratum, for this read the file and replace all the %s with the id_file, id_name and id_name, to get the amount the word model is used
    def get_stratum_blockstate(self, id_file, id_name, id_file_stratum, id_name_stratum):
        blockstate_path = os.path.join(self.LM.path_program, "base_files", "assets", "blockstates", id_file_stratum, f"{id_name_stratum}.json")
        if not os.path.isfile(blockstate_path): self.LM.log("asset_file_missing", f"Missing Stratum asset file: {blockstate_path}"); return ""
        blockstate = self.IOM.read(blockstate_path)
        blockstate = blockstate % (blockstate.count("model") * (id_file, id_name, id_name))
        blockstate = blockstate.replace("\n", "").replace("\t", "").replace(" ", "")
        return blockstate



    def handle_ore_assets(self, id_file, id_name, id_file_stratum, id_name_stratum, blockstate, resource_location_item_model): 
        # gets the resource location of the block model in the game assets
        if blockstate == "": return False
        resource_location_block_model = f'unification:{id_file}/{id_name}/block/{id_name}_ore/{id_file_stratum}/{id_name_stratum}/'

        # gets the model path in the base files
        model_path = os.path.join(self.LM.path_program, "base_files", "assets", "models", id_file_stratum, id_name_stratum)
        if not os.path.isdir(model_path): self.LM.log("asset_folder_missing", f"Missing Stratum asset folder: {model_path}"); return False

        # for each file in the model path read it, replace the %s accordingly and then save it to the game assets
        for model_file in os.listdir(model_path):
            model = (self.IOM.read(os.path.join(model_path, model_file)) % (id_file, id_name, id_name, id_file, id_name, id_name)).replace("\n", "").replace("\t", "").replace(" ", "")
            self.FM.add_json(self.resource_location_to_path(resource_location_block_model + model_file.removesuffix(".json"), "model"), model)

        # adds the item model to the game assets
        self.FM.add_json(self.resource_location_to_path(resource_location_item_model, "model", True), {"parent": resource_location_block_model + "x_0_y_0"})

        return True