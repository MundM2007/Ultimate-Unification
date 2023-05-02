import shutil
import os

id_name = "copper"  # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
extra_path = "vanilla"  # !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

# [------------------------------------]

path_ = __file__.removesuffix("copy_files.py").replace("/", "\\")

types_copy_block = [f"{id_name}_block", f"raw_{id_name}_block"]
types_copy_item = [f"raw_{id_name}", f"{id_name}_ingot", f"{id_name}_nugget", f"clump_{id_name}", f"crushed_{id_name}_ore", f"crystal_{id_name}",
                   f"dirty_dust_{id_name}", f"{id_name}_dust", f"{id_name}_gear", f"{id_name}_rod", f"{id_name}_plate", f"shard_{id_name}",
                   f"{id_name}fragment", f"{id_name}gravel"]
path_copy = f"{path_}{extra_path}\\{id_name.title()}\\"

types_new_block = [f"{id_name}_storage_block", f"{id_name}_raw_block"]
types_new_item = [f"{id_name}_raw", f"{id_name}_ingot", f"{id_name}_nugget", f"{id_name}_clump", f"{id_name}_crushed", f"{id_name}_crystal",
                  f"{id_name}_dirty_dust", f"{id_name}_dust", f"{id_name}_gear", f"{id_name}_rod", f"{id_name}_plate", f"{id_name}_shard",
                  f"{id_name}_fragment", f"{id_name}_gravel"]
path_new = f"{path_}ore_unification\\{id_name}\\"

for index in range(len(types_copy_block)):
    if not os.path.isdir(path_new + "block"):
        os.makedirs(path_new + "block")

    shutil.copyfile(path_copy + "blocks\\" + types_copy_block[index] + ".png", path_new + "block\\" + types_new_block[index] + ".png")

for index in range(len(types_copy_item)):
    if not os.path.isdir(path_new + "item"):
        os.makedirs(path_new + "item")

    shutil.copyfile(path_copy + "items\\" + types_copy_item[index] + ".png", path_new + "item\\" + types_new_item[index] + ".png")
