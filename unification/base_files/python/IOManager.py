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

import functools
import os
import shutil

class IOManager:
    def __init__(self, LM):
        self.LM = LM
    

    # reads the content of a file, uses lru_cache to cache the result for faster access, because the same file is read a lot of times
    @functools.lru_cache()
    def read(self, path_file):
        try:
            with open(path_file, mode="r", encoding="utf-8") as file:
                return file.read()
        except Exception as e:
            self.LM.log("file_error", f"Error reading file: {path_file}", e)


    # reads the content of a file and splits it into lines
    def readlines(self, path_file):
        return self.read(path_file).splitlines()
    

    # writes content to a file and creates the directories if they don't exist
    def write(self, path_file, content):
        try:
            os.makedirs(os.path.dirname(path_file), exist_ok=True)
            with open(path_file, mode="w", encoding="utf-8") as file:
                file.write(content)
        except Exception as e:
            self.LM.log("file_error", f"Error writing file: {path_file}", e)
    

    # removes a file or directory
    def remove(self, path_file):
        try:
            if os.path.isdir(path_file):
                shutil.rmtree(path_file)
            elif os.path.isfile(path_file):
                os.remove(path_file)
        except Exception as e:
            self.LM.log("file_error", f"Error removing file: {path_file}", e)


    # creates a directory if it doesn't exist, otherwise it clears it
    def clear_path(self, path):
        try:
            os.makedirs(path, exist_ok=True)
            for file in os.listdir(path):
                if os.path.isdir(os.path.join(path, file)):
                    shutil.rmtree(os.path.join(path, file))
                else:
                    os.remove(os.path.join(path, file))
        except Exception as e:
            self.LM.log("file_error", f"Error clearing path: {path}", e)

    
    # traverses a path and applies a function to each file in the path
    def traverse_path(self, path, function):
        try:
            for root, dirs, files in os.walk(path):
                for file in files:
                    function(os.path.join(root, file))
        except Exception as e:
            self.LM.log("file_error", f"Error traversing path: {path}", e)
    

    # copies a file and creates the directories if they don't exist
    def copy(self, path_file, path_copy):
        try:
            os.makedirs(os.path.dirname(path_copy), exist_ok=True)
            shutil.copyfile(path_file, path_copy)
        except Exception as e:
            self.LM.log("file_error", f"Error copying file: {path_file} to {path_copy}", e)
    

    # copies a directory and creates the directories if they don't exist
    def copy_tree(self, path, path_copy):
        try:
            os.makedirs(path_copy, exist_ok=True)
            shutil.copytree(path, path_copy, copy_function=shutil.copyfile, dirs_exist_ok=True)
        except Exception as e:
            self.LM.log("file_error", f"Error copying tree: {path} to {path_copy}", e)
            