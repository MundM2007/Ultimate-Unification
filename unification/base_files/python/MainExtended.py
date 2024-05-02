import re

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


    def init_actions(self):
        self.all_element_replaced = []
        self.elements_added = dict()
        self.elements_replaced = dict()

    def replace_element(self, material_type, id_file, id_name, license_notice):
        anything_changed = 0
        if len(material_type) == 3:
            if self.UT.check_material(material_type[0]):
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
                        self.FM.handle_texture("", self.UT.resource_location_to_path(material_type[1]), False, False)
                
                # adds the tags
                if material_type[0] not in self.all_element_replaced and "slurry" not in material_type[0] and "molten" not in material_type[0]:
                    self.KFUT.add_tag(material_type[2], id_file, id_name, material_type, license_notice)
                    anything_changed += 1
                    self.all_element_replaced.append(material_type[0])
                
                self.elements_replaced[material_type[0]] = material_type[2]
            else:
                # removes the texture if the material type doesn't exist
                self.FM.handle_texture("", self.UT.resource_location_to_path(material_type[1]), False, False)
            
        return anything_changed
    

    def add_element(self, material_type, id_file, id_name, license_notice, harvest_level, destroy_time, explosion_resistance):
        if not self.UT.check_material(material_type):
            return 0

        # extract color and element name
        color = ""
        if material_type.startswith("slurry") or material_type.startswith("molten"):
            if re.search(r'^#[0-9a-fA-F]{6}$', material_type.replace("slurry", "").replace("molten", "")):
                color = "0x" + material_type.replace("slurry#", "").replace("molten#", "")
                material_type = material_type[:-7]

        # adds the element
        if self.KFUT.add_element(id_file, id_name, material_type, color, license_notice, harvest_level, destroy_time, explosion_resistance):
            # item id is added to a dictionary to be used later
            if material_type == "slurry":
                self.elements_added["clean_slurry"] = f"unification:clean_{id_name}_slurry"
                self.elements_added["dirty_slurry"] = f"unification:dirty_{id_name}_slurry"
            else:
                self.elements_added[material_type] = f"unification:{id_name}_{material_type}"

            # adds the tags
            if not material_type.startswith("slurry") and not material_type.startswith("molten"):
                self.KFUT.add_tag(f"unification:{id_name}_{material_type}", id_file, id_name, material_type, license_notice)
            
            self.type_added += 1
            return 1
        return 0
    

    def remove_element(self, removal_array, id_file, id_name, material_type, new_item, license_notice):
        mod_id = removal_array[0][:removal_array[0].find(":")]
        if not self.UT.check_mod(mod_id):
            if not self.UT.check_mod_written(mod_id):
                self.LM.log("mod_not_found", f"Mod ({mod_id}) not found in the mod list")
            return 0

        # removes the element
        self.KFUT.jei_hide(removal_array[0], id_file, material_type in ["raw_block", "storage_block"], license_notice)
        self.KFUT.remove_tag(removal_array[0], id_file, id_name, material_type, license_notice)
        self.KFUT.replace_input(removal_array[0], f"#forge:{material_type}s/{id_name}", id_file, license_notice)
        self.KFUT.replace_output(removal_array[0], new_item, id_file, license_notice)

        self.element_removed += 1
        return 1
    

    def add_and_remove_elements(self, base_file_registry, id_file, id_name, license_notice, harvest_level, destroy_time, explosion_resistance):
        anything_changed = 0
        if base_file_registry[id_name].get("add") is not None:
            for material_type in base_file_registry[id_name]["add"]:
                anything_changed += self.add_element(material_type, id_file, id_name, license_notice, harvest_level, destroy_time, explosion_resistance)
        
        if base_file_registry[id_name].get("remove") is not None:
            for material_type, new_item in {**self.elements_replaced, **self.elements_added}.items():
                if base_file_registry[id_name]["remove"].get(material_type) is not None:
                    for removal_array in base_file_registry[id_name]["remove"][material_type]:
                        anything_changed += self.remove_element(removal_array, id_file, id_name, material_type, new_item, license_notice)
        
        return anything_changed


    def remove_elements(self, base_file_registry, id_file, id_name, license_notice):
        anything_changed = 0
        if base_file_registry[id_name].get("remove") is not None:
            for material_type, new_item in self.elements_replaced.items():
                if base_file_registry[id_name]["remove"].get(material_type) is not None:
                    for removal_array in base_file_registry[id_name]["remove"][material_type]:
                        anything_changed += self.remove_element(removal_array, id_file, id_name, material_type, new_item, license_notice)
        
        return anything_changed