import json
import os

class FileManager:
    def __init__(self, IOM):
        self.LM = IOM.LM
        self.IOM = IOM
        self.files = dict()
        self.textures_add = dict()
        self.textures_remove = set()
    

    # adds a KubeJS file section to be written to the file later
    def addKJS(self, path_file, content, license_notice, priority, event_write, ending="})"):
        if path_file in self.files:
            self.files[path_file][1] += content
        else:
            self.files[path_file] = [f"{license_notice}//priority: {priority}\n{event_write}", content, ending]
    

    # adds a JSON file section to be written to the file later
    def addJson(self, path_file, content, pretty_print=False):
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
    

    # handles a texture to be created or deleted later
    def handleTexture(self, path_file, path_copy, active, isAdding):
        if active:
            if os.path.exists(path_file):
                self.textures_add[path_file] = path_copy
                return True
            else:
                if isAdding:
                    self.LM.log("texture_missing", f"Missing Material texture file: {path_file} meaning the corresponding item won't be added to the game")
                else:
                    self.LM.log("texture_missing", f"Missing Material texture file: {path_file} meaning the corresponding item's texture won't be changed")
                if os.path.exists(path_copy):
                    if path_copy in self.textures_add:
                        self.textures_add.pop(path_copy)
                    self.textures_remove.add(path_copy)
                return False
        else:
            if os.path.exists(path_copy):
                if path_copy in self.textures_add:
                    self.textures_add.pop(path_copy)
                self.textures_remove.add(path_copy)
            return False
        

    # saves the files and textures
    def save(self):
        amount_files = len(self.files)
        for index, (path_file, content) in enumerate(self.files.items()):
            if len(content) == 3:
                self.IOM.write(path_file, content[0] + content[1] + content[2])
            else:
                self.IOM.write(path_file, json.dumps(content[0], indent=4 if content[1] else None))
            self.LM.log_percentage(f"Saving files", index / (amount_files - 1))
        
        amount_textures_add = len(self.textures_add)
        for index, (path_file, path_copy) in enumerate(self.textures_add.items()):
            self.IOM.copy(path_file, path_copy)
            self.LM.log_percentage(f"Saving textures", index / (amount_textures_add - 1))

        amount_textures_remove = len(self.textures_remove)
        for index, path_file in enumerate(self.textures_remove):
            self.IOM.remove(path_file)
            self.LM.log_percentage(f"Removing textures", index / (amount_textures_remove - 1))