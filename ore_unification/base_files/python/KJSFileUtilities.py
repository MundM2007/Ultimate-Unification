import os

class KJSFileUtilities:
    def __init__(self, UT):
        self.LM = UT.LM
        self.IOM = UT.IOM
        self.FM = UT.FM
        self.UT = UT
        
    # adds a tag to an item
    def add_tag(self, id_file, id_item, item_tag, is_block, license_notice):
        path_script_file_item = os.path.join(self.UT.get_pack_path(), "kubejs", "server_scripts", "unification", "add_tag", "item", f"{id_file}.js")
        self.FM.addKJS(path_script_file_item, f"    event.add('{item_tag}', '{id_item}')\n", license_notice, 90, "onEvent('item.tags', event => {\n")

        if is_block:
            path_script_file_block = os.path.join(self.UT.get_pack_path(), "kubejs", "server_scripts", "unification", "add_tag", "block", f"{id_file}.js")
            self.FM.addKJS(path_script_file_block, f"    event.add('{item_tag}', '{id_item}')\n", license_notice, 90, "onEvent('block.tags', event => {\n")
    

    def add_element(self, id_file, id_name, material_type, color, license_notice):
        if material_type in ["raw_block", "storage_block"]:
            return self.add_block(id_file, id_name, material_type, license_notice)
    
        elif material_type.startswith("molten"):
            return self.add_molten(id_file, id_name, color, license_notice)

        elif material_type.startswith("slurry"):
            return self.add_slurry(id_file, id_name, color, license_notice)
    
        elif material_type == "coin": 
            return self.add_coin(id_file, id_name, license_notice)

        else:
            return self.add_item(id_file, id_name, material_type, license_notice)
    

    def add_item(self, id_file, id_name, material_type, license_notice):
        texture_path = f"unification:{id_file}/{id_name}/item/{id_name}_{material_type}"
        if self.FM.handleTexture(self.UT.get_texture_path(id_file, id_name, material_type), self.UT.resource_location_to_path(texture_path), True, True):
            path_script_file = os.path.join(self.UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_item", f"{id_file}.js")
            self.FM.addKJS(path_script_file, f"    global.scripts.add_item(event, '{id_name}', '{material_type}', '{texture_path}')\n", 
                           license_notice, 100, "onEvent('item.registry', event => {\n")
            return True
        return False
    

    def add_block(self, id_file, id_name, material_type, license_notice):
        texture_path = f"unification:{id_file}/{id_name}/block/{id_name}_{material_type}"
        if self.FM.handleTexture(self.UT.get_texture_path(id_file, id_name, material_type), self.UT.resource_location_to_path(texture_path), True, True):
            path_script_file = os.path.join(self.UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_block", f"{id_file}.js")
            type_material_extra = "stone" if material_type == "raw_block" else "metal"
            self.FM.addKJS(path_script_file, f"    global.scripts.add_block(event, '{id_name}', '{material_type}', '{type_material_extra}', '{texture_path}')\n", 
                           license_notice, 100, "onEvent('block.registry', event => {\n")
            return True
        return False
    

    def add_molten(self, id_file, id_name, color, license_notice):
        color = "0xffffff" if color == "" else color
        path_script_file = os.path.join(self.UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_fluid", f"{id_file}.js")
        self.FM.addKJS(path_script_file, f"    global.scripts.add_molten(event, '{id_name}', {color})\n",
                       license_notice, 100, "onEvent('fluid.registry', event => {\n")
        return True


    def add_slurry(self, id_file, id_name, color, license_notice):
        color = "0xffffff" if color == "" else color
        path_script_file = os.path.join(self.UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_slurry", f"{id_file}.js")
        self.FM.addKJS(path_script_file, f"SLURRY.register('{id_name}_slurry', builder => builder.color({color}))\n", license_notice, 100, "", "")
        return True
    

    def add_coin(self, id_file, id_name, license_notice):
        texture_path_new = f"unification:{id_file}/{id_name}/item/{id_name}_coin"
        for i in range(5):
            if not self.FM.handleTexture(self.UT.get_texture_path(id_file, id_name, f"coin{i}"), self.UT.resource_location_to_path(texture_path_new + str(i)), True, True):
                for j in range(i):
                    self.FM.handleTexture("", self.UT.resource_location_to_path(texture_path_new + str(j)), False, True)
                return False
            
            path_model_file = os.path.join(self.UT.get_pack_path(), "resources", "unification", "models", id_file, id_name, "item", f"{id_name}_coin{i}.json")
            model_json = '{"parent": "item/generated", "textures": {"layer0": "' + texture_path_new + str(i) + '"}}'
            self.FM.addJson(path_model_file, model_json)
        
        self.FM.addKJS(os.path.join(self.UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_coin", f"{id_file}.js"), 
                       f"    global.scripts.add_coin(event, '{id_name}')\n", license_notice, 100, "onEvent('item.registry', event => {\n")
        self.FM.addKJS(os.path.join(self.UT.get_pack_path(), "kubejs", "startup_scripts", "unification", "add_coin", f"{id_file}_register_item_property.js"),
                       f"    global.scripts.register_item_property('unification:{id_name}_coin')\n", license_notice, 100, "onEvent('postinit', event => {\n")
        
        main_model = (f'{{"parent": "item/generated", '
                      f'"textures": {{"layer0": "{texture_path_new + "0"}"}}, '
                        f'"overrides": ['
                          f'{{"predicate": {{"count": 0.00000}}, "model": "{texture_path_new + "0"}"}}, '
                          f'{{"predicate": {{"count": 0.03125}}, "model": "{texture_path_new + "1"}"}}, '
                          f'{{"predicate": {{"count": 0.25000}}, "model": "{texture_path_new + "2"}"}}, '
                          f'{{"predicate": {{"count": 0.50000}}, "model": "{texture_path_new + "3"}"}}, '
                          f'{{"predicate": {{"count": 1.00000}}, "model": "{texture_path_new + "4"}"}}'
                        f']'
                      f'}}')
        self.FM.addJson(os.path.join(self.UT.get_pack_path(), "kubejs", "assets", "unification", "models", "item", f"{id_name}_coin.json"), main_model)
        return True
    

    def jei_hide(self, id_item, id_file, license_notice):
        path_script_file = os.path.join(self.UT.get_pack_path(), "kubejs", "client_scripts", "unification", "jei_hide", f"{id_file}.js")
        self.FM.addKJS(path_script_file, f"    event.hide('{id_item}')\n", license_notice, 50, "onEvent('jei.hide.items', event => {\n")


    def remove_tag(self, id_item, id_file, is_block, license_notice):
        path_script_file = os.path.join(self.UT.get_pack_path(), "kubejs", "server_scripts", "unification", "remove_tag", "items", f"{id_file}.js")
        self.FM.addKJS(path_script_file, f"    event.removeAllTagsFrom('{id_item}')\n", license_notice, 120, "onEvent('item.tags', event => {\n")
        if is_block:
            path_script_file_block = os.path.join(self.UT.get_pack_path(), "kubejs", "server_scripts", "unification", "remove_tags", "blocks", f"{id_file}.js")
            self.FM.addKJS(path_script_file_block, f"    event.removeAllTagsFrom('{id_item}')\n", license_notice, 120, "onEvent('block.tags', event => {\n")

    
    def replace_input(self, id_item, new_tag, id_file, license_notice):
        path_script_file = os.path.join(self.UT.get_pack_path(), "kubejs", "server_scripts", "unification", "replace_input", f"{id_file}.js")
        self.FM.addKJS(path_script_file, f"    event.replaceInput({{}}, '{id_item}', '{new_tag}')\n", license_notice, 100, "onEvent('recipes', event => {\n")

    
    def replace_output(self, id_item, new_id_item, id_file, license_notice):
        path_script_file = os.path.join(self.UT.get_pack_path(), "kubejs", "server_scripts", "unification", "replace_output", f"{id_file}.js")
        self.FM.addKJS(path_script_file, f"    event.replaceOutput({{}}, '{id_item}', '{new_id_item}')\n", license_notice, 100, "onEvent('recipes', event => {\n")