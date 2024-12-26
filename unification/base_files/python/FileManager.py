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

import json
import os

class FileManager:
    def __init__(self, IOM):
        self.LM = IOM.LM
        self.IOM = IOM
        self.files = dict()
        self.textures_add = dict()
        self.files_remove = set()
    

    # adds a KubeJS file section to be written to the file later
    def add_kjs(self, path_file, content, license_notice, priority, event_write, ending="})"):
        if path_file in self.files:
            self.files[path_file][1] += content
        else:
            self.files[path_file] = [f"{license_notice}//priority: {priority}\n{event_write}", content, ending]
    

    # adds a JSON file section to be written to the file later
    def add_json(self, path_file, content, pretty_print=False):
        if self.files.get(path_file):
            try:
                content = content if isinstance(content, dict) else json.loads(content)
                self.files[path_file][0].update(content)
            except json.JSONDecodeError as e:
                self.LM.log("json_error", f"Error decoding JSON content: {content} that's trying to be written to the file: {path_file}", e)
        else:
            try: 
                self.files[path_file] = [json.loads(content) if isinstance(content, str) else content, pretty_print==True]
            except json.JSONDecodeError as e:
                self.LM.log("json_error", f"Error decoding JSON content: {content} that's trying to be written to the file: {path_file}", e)
    

    def add_text(self, path_file, content):
        if path_file in self.files:
            self.files[path_file][0] += "\n"
            self.files[path_file][0] += content
        else:
            self.files[path_file] = [content]


    # handles a texture to be created or deleted later
    def handle_texture(self, path_file, path_copy, active, isAdding):
        if active:
            if os.path.exists(path_file):
                self.textures_add[path_copy] = path_file
                return True
            else:
                if isAdding:
                    self.LM.log("texture_missing", f"Missing Material texture file: {path_file} meaning the corresponding item won't be added to the game")
                else:
                    self.LM.log("texture_missing", f"Missing Material texture file: {path_file} meaning the corresponding item's texture won't be changed")
                if os.path.exists(path_copy):
                    self.files_remove.add(path_copy)
                if path_copy in self.textures_add:
                    self.textures_add.pop(path_copy)
                return False
        else:
            if os.path.exists(path_copy):
                self.files_remove.add(path_copy)
            if path_copy in self.textures_add:
                self.textures_add.pop(path_copy)
            return False
        
    
    def remove_json(self, path_file):
        if os.path.exists(path_file):
            self.files_remove.add(path_file)
        if path_file in self.files:
            self.files.pop(path_file)


    # saves the files and textures
    def save(self):
        amount_files = len(self.files) - 1
        for index, (path_file, content) in enumerate(self.files.items()):
            if len(content) == 3:
                self.IOM.write(path_file, content[0] + content[1] + content[2])
            elif len(content) == 2:
                self.IOM.write(path_file, json.dumps(content[0], indent=4 if content[1] else None))
            else:
                self.IOM.write(path_file, content[0])
            self.LM.log_percentage(f"Saving files", index / (amount_files))
        
        amount_textures_add = len(self.textures_add) - 1
        for index, (path_copy, path_file) in enumerate(self.textures_add.items()):
            self.IOM.copy(path_file, path_copy)
            self.LM.log_percentage(f"Saving textures", index / (amount_textures_add))

        amount_files_remove = len(self.files_remove) - 1
        for index, path_file in enumerate(self.files_remove):
            self.IOM.remove(path_file)
            self.LM.log_percentage(f"Removing files", index / (amount_files_remove))