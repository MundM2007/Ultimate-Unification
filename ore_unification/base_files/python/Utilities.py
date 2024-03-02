import json
import os

class Utilities:
    # initializes the utilities and creates a mod list
    def __init__(self, FM):
        self.LM = FM.LM
        self.IOM = FM.IOM
        self.FM = FM

        self.mod_list = ["minecraft"]
        mod_list_config = json.loads(self.IOM.read(os.path.join(self.LM.path_program, "config", "mod_list.json")))
        for mod in mod_list_config:
            if mod_list_config[mod]:
                self.mod_list.append(mod) 
    
    
    # gets the path of the pack from the path of the program
    def get_pack_path(self):
        return os.path.join(self.LM.path_program, os.pardir)


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
            "crystal": "makanism",
            "shard": "makanism",
            "clump": "makanism",
            "dirty_dust": "makanism",
            "clean_slurry": "makanism",
            "dirty_slurry": "makanism",
            "fragment": "bloodmagic",
            "gravel": "bloodmagic",
            "crushed": "create"
        }

        if material_type in mod_mapping and not self.check_mod(mod_mapping[material_type]):
            return False

        return True
    

