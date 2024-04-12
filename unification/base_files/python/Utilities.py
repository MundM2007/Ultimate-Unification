import json
import os

class Utilities:
    # initializes the utilities and creates a mod list
    def __init__(self, FM):
        self.LM = FM.LM
        self.IOM = FM.IOM
        self.FM = FM
        self.pack_path = os.path.abspath(os.path.join(self.LM.path_program, os.pardir))

        self.mod_list = ["minecraft"]
        try:
            mod_list_config = json.loads(self.IOM.read(os.path.join(self.LM.path_program, "config", "mod_list.json")))
        except json.JSONDecodeError as e:
            self.LM.log("critical_json_error", f"Error decoding JSON content of the file: mod_list.json", e)
        for mod in mod_list_config:
            if mod_list_config[mod]:
                self.mod_list.append(mod) 

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
    
    
    # gets the path of the pack from the path of the program
    def get_pack_path(self):
        return self.pack_path


    # gets the file path from a resource location
    def resource_location_to_path(self, resource_location, type_rc="texture", kubejs_assets=False):
        namespace = resource_location[:resource_location.find(":")]
        path = resource_location[resource_location.find(":") + 1:]
        storage_location = "kubejs\\assets" if kubejs_assets else "resources"
        if type_rc == "texture":
            return os.path.join(self.get_pack_path(), storage_location, namespace, "textures", f"{path}.png")
        elif type_rc == "model":
            return os.path.join(self.get_pack_path(), storage_location, namespace, "models", f"{path}.json")
        elif type_rc == "blockstate":
            return os.path.join(self.get_pack_path(), storage_location, namespace, "blockstates", f"{path}.json")
        elif type_rc == "lang":
            return os.path.join(self.get_pack_path(), storage_location, namespace, "lang", f"{path}.json")
        return ""


    # gets the base files texture path
    def get_texture_path(self, id_file, id_name, material_type, new_texture_rl=""):
        extra_texture_name = (new_texture_rl[-1] if material_type == "coin" else "") if new_texture_rl != "" else ""
        return os.path.join(self.LM.path_program, "base_files", "textures", "general", id_file, id_name, 
                            "block" if material_type in ["raw_block", "storage_block"] else "item", 
                            f"{id_name}_{material_type}{extra_texture_name}.png")
                    

    # checks if a mod is in the mod list
    def check_mod(self, mod_id):
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

        if material_type in mod_mapping and not self.check_mod(mod_mapping[material_type]):
            return False

        return True
    

    def gen_lang_entry(self, id_file, id_name, material_type):
        for lang in self.langs:
            path_lang_file = self.resource_location_to_path(f"unification:{lang.get('lang')}", "lang")
            for material_type in [f"dirty_{material_type}", f"clean_{material_type}"] if material_type in ["slurry"] else [material_type]:
                if lang.get(material_type) is not None:
                    if lang.get(f"{id_file}.{id_name}") is not None:
                        if material_type in ["raw_block", "storage_block"]:
                            lang_key = f"block.unification.{id_name}_{material_type}"
                        elif material_type == "molten":
                            lang_key = f"fluid.unification.{id_name}_molten"
                        elif material_type == "dirty_slurry":
                            lang_key = f"slurry.unification.dirty_{id_name}_slurry"
                        elif material_type == "clean_slurry":
                            lang_key = f"slurry.unification.clean_{id_name}_slurry"
                        else:
                            lang_key = f"item.unification.{id_name}_{material_type}"
                        self.FM.addJson(path_lang_file, {lang_key: lang.get(material_type) % lang.get(f"{id_file}.{id_name}")})
                    else:
                        self.LM.log("lang_entry_missing", f"Missing lang entry for {id_file}.{id_name} in the lang file: {lang.get('lang')}")
                else:
                    self.LM.log("lang_entry_missing", f"Missing lang entry for {material_type} in the lang file: {lang.get('lang')}")