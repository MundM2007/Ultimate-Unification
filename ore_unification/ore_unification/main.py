
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
# Ultimate Unification Copyright (C) 2023 under MIT License by:                   
#         - MundM2007 (https://github.com/MundM2007)







# todo: integrate ore tag removals; 



#       add thermal ingot in smelter recipe


#       Unify Items: 
#           arcane gold ingot eidolon + the usage
#           brass, different rates or maybe other alloys
#           add coal coke burntime + from bitumen recipe + from coal in immersive engineering
#           ender pearl dust (betterend, lazier ae2, mini utilities ore drop, probably not needed cause worldgem is changes), add recipes
#           flour (nuclearcraft, pneumaticcraft, lazier ae2, atum)
#           obsidian dust (mekanism, nuclearcraft, exnihilo, occultism)
#           salt (meka, alchemistry)
#           silicon check all mods in registry base file
#           wood (thermal, excompressum) gears
#           chromatic compound recipe
#           ritual of the forest ore aren't using tags
#           netherite ore processing + calcinated netherite powder isn't using tags + dust from blood magic
#           quartz: add casting and smelting of block
#       Unify Essences: from mystical agriculture
#       Unify Fluids: 
#           Aluminum, Boron, Lithium, Silver, Beryllium, Manganese, Steel, Coal, basically every one from (nc)
#           from create automated
#           Destabelized redstone

#       rose gold
#       semi-stable-ingot
#       extended crafting
#       nature's aura
#       mythicbotany
#       the twilight forest
#       redo manganese (move to alloy)
#       wood gear texture







#       conditional recipes after mods
#       write to generalsettings
#       ore drops
#       make a directory for files like mandatory kubejs files and config files to be copied over????
#       remove additional argument removal in recipe function and seperate the tconstruct casting recipes for that reason
#       add function to read files
#       also add tags to replaced items
# 6 libaries:
#   - IOUtils (Handles Input and Output)
#   - LoggingUtils (Handles logging, with class that stores it) 
#   - LanguageUtils (Handles Language Files) ???????? Or just in main file
#   - FilesUtils (Tracks what to write to a file using a class)
#   - TextureUtils ? maybe in FileUtils
#   - BackupUtils




from ast import literal_eval
import time
import decimal
from decimal import Decimal
import traceback
import os
import sys
import json
import tomli
from PIL import Image
import copy
import re
import shutil

start_time = time.time()

path_ = __file__.removesuffix("main.py").replace("/", "\\")

# clears / generates logging file
if not os.path.isdir(f"{path_}logs"):
    os.makedirs(f"{path_}logs")
with open(f"{path_}logs\\latest.log", mode="w") as file_log:
    file_log.close()

# generates constant logging file
index_logging = 0
while True:
    file_log_constant_name = f"log-{time.strftime('%Y-%m-%d', time.gmtime(start_time))}-{index_logging}.log"
    if not os.path.isfile(f"{path_}logs\\{file_log_constant_name}"):
        with open(f"{path_}logs\\{file_log_constant_name}", mode="w") as file_log_constant:
            break
    index_logging += 1

# checks if all base files exist
def check_base_files():
    for i in range(1, 11):
        if not os.path.isfile(f"{path_}textures\\overlay_base\\ore_{i}.png"):
            logging("file_missing", f"Missing Overlay Base texture file: ore_{i}")

    for file in [f"{path_}base_files\\osv\\osv-common_base.txt",
                 f"{path_}base_files\\osv\\osv-common_base_default.toml",
                 f"{path_}base_files\\osv\\osv-common_values.json"]:
        if not os.path.isfile(file):
            logging("file_missing", f"Missing Base File: {file}")


# clears given folder path
def clear_path(path_f):
    if os.path.isdir(path_f):
        for file in os.listdir(path_f):
            if os.path.isfile(path_f + "\\" + file):
                os.remove(path_f + "\\" + file)
            else:
                shutil.rmtree(path_f + "\\" + file)


# generates folders
def gen_folders():
    for path_create in [f"{path_to_osv_ores}custom", f"{path_to_osv_assets}blockstates",
                        f"{path_to_osv_assets}textures\\block\\custom", f"{path_to_osv_assets}models\\item",
                        f"{path_to_osv_assets}models\\block\\custom"]:
        if not os.path.isdir(path_create):
            os.makedirs(path_create)
        else:
            clear_path(path_create)


# tints an image and returns the new image (color with 6 length)
def tint_texture(img_path, color_hex):
    color_rgb = tuple(int(color_hex.removeprefix("#")[i:i + 2], 16) for i in (0, 2, 4))
    img = Image.open(img_path)
    img = img.convert("RGBA")
    img_data = img.getdata()
    img_r_data = []  # Result

    for i in range(len(img_data)):
        darken_amount = img_data[i][0] / 255

        with decimal.localcontext() as ctx:
            ctx.rounding = decimal.ROUND_HALF_UP
            red = round(Decimal(color_rgb[0] * darken_amount))
            green = round(Decimal(color_rgb[1] * darken_amount))
            blue = round(Decimal(color_rgb[2] * darken_amount))

        img_r_data.append((red, green, blue, img_data[i][3]))

    img.putdata(img_r_data)
    return img


# used for logging stuff
def logging(type_logging, message, error_name=""):
    if enable_logging:
        problematic_error_types = ["file_error", "file_missing", "script_error"]

        # rounds seconds passed
        with decimal.localcontext() as ctx:
            ctx.rounding = decimal.ROUND_HALF_UP
            seconds = round(Decimal(time.time()) - Decimal(start_time), 5)

        # prints all info messages
        if type_logging == "info":
            print(message)

        exception = "None"
        # format exception
        if type_logging in problematic_error_types:
            exception = "\n" + traceback.format_exc()
            newlines_exception = [match.start() + 3 for match in re.finditer('\n', traceback.format_exc())]
            for index in newlines_exception:
                exception = exception[:index] + " " * 51 + exception[index:]

        # format error Name
        err_name = "None"
        if error_name != "":
            err_name = error_name.__class__.__name__

        # write to log file
        with open(f"{path_}logs\\latest.log", mode="a") as file_log:
            with open(f"{path_}logs\\{file_log_constant_name}", mode="a") as file_log_constant:
                if err_name == "None" or exception == "None":
                    file_log.write(f"[Seconds Elapsed: {str(seconds):>08}] [{type_logging.replace('_', ' ').title():^20}]: {message}\n")
                    file_log_constant.write(f"[Seconds Elapsed: {str(seconds):>08}] [{type_logging.replace('_', ' ').title():^20}]: {message}\n")
                else:
                    file_log.write((f"[Seconds Elapsed: {str(seconds):>08}] [{type_logging.replace('_',' ').title():^20}]: "
                                    f"{message}, Error Name: {err_name}, Exception:{exception}\n"))
                    file_log_constant.write((f"[Seconds Elapsed: {str(seconds):>08}] [{type_logging.replace('_', ' ').title():^20}]: "
                                             f"{message}, Error Name: {err_name}, Exception:{exception}\n"))

        if type_logging in problematic_error_types:
            # exits program if it was a problematic error
            print("An Error occurred, please check log file")
            for i in range(10):
                if i in [0, 5, 7, 8, 9]:
                    print(f"\rclosing in {10 - i} second(s) ", end="")
                time.sleep(1)
            sys.exit("")


def extra_file(file_path, type_material, id_strata):
    if os.path.isfile(f"{path_}config/osv_extra/{file_path}.toml"):
        with open(f"{path_}config/osv_extra/{file_path}.toml", mode="rb") as config_extra_f:
            try:
                config_extra = tomli.load(config_extra_f)
            except tomli.TOMLDecodeError as ex:
                logging("extra_file_error", f"{path_}config/osv_extra/{file_path}.toml config file invalid, check for any syntax errors", ex)
                return []

    else:
        logging("extra_file_missing", f"{path_}config/osv_extra/{file_path}.toml config file is missing or is named incorrectly.")
        return []

    array_extra = []
    if config_extra.get(type_material) is not None:
        for element in config_extra[type_material]:
            if id_strata is not None:
                if element.get("id") in id_strata:
                    array_extra.append(element)
            else:
                array_extra.append(element)

    return array_extra

enable_logging = True
# checks the main.toml file if it should disable logging (even without the scripts being valid)
if os.path.isfile(f"{path_}config\\main.toml"):
    with open(f"{path_}config\\main.toml", mode="r") as main:
        for line in main:
            if "enable_logging" in line and ("true" in line or "false" in line) and "enable_logging_" not in line and "#" not in line:
                enable_logging = literal_eval(line.replace("enable_logging", "").replace("=", "").replace(" ", "").replace("true", "True").replace("false", "False"))

logging("info", 'Program started')

check_base_files()
# loads the main config
if os.path.isfile(f"{path_}config\\main.toml"):
    with open(f"{path_}config\\main.toml", mode="rb") as main:
        try:
            system_config = tomli.load(main)
        except tomli.TOMLDecodeError as ex:
            logging("file_error", "Main config file invalid, check for any syntax errors", ex)

else:
    logging("file_missing", 'Main config file is missing or is named incorrectly. The name should be: "main.toml"')

# loads the osv_main config
if os.path.isfile(f"{path_}config\\osv_main.toml"):
    with open(f"{path_}config\\osv_main.toml", mode="rb") as osv_main:
        try:
            config = tomli.load(osv_main)
        except tomli.TOMLDecodeError as ex:
            logging("file_error", "OSV config file invalid, check for any syntax errors", ex)

else:
    logging("file_missing", 'OSV config file is missing or is named incorrectly. The name should be: "osv_main.toml"')
logging("info", 'Main config files read successfully')

# gets the file location
file_loc = ""
if not system_config.get("system") is None and not system_config["system"].get("file_location") is None:
    file_loc = str(system_config["system"]["file_location"])
else:
    logging("file_error", 'missing "system" table or missing "file_location" argument in "system" table in "main.toml"')

enable_logging_dim_not_existent_errors = True
enable_logging_strata_not_existent_errors = True
if system_config["system"].get("enable_logging_dim_not_existent_errors") is False:
    enable_logging_dim_not_existent_errors = False
if system_config["system"].get("enable_logging_strata_not_existent_errors") is False:
    enable_logging_strata_not_existent_errors = False

path_to_osv_ores = path_.removesuffix(file_loc + "\\") + "config\\osv\\ores\\"
path_to_osv_assets = path_to_osv_ores.removesuffix("ores\\") + "resources\\assets\\osv\\"

gen_folders()
logging("info", 'Folders Generated successfully')

new_config = copy.deepcopy(config)
if "strata" in config:
    for strata_check_extra in config["strata"]:
        if "file" in strata_check_extra and strata_check_extra.get("active") is not False:
            new_config["strata"].extend(extra_file(strata_check_extra["file"], "strata", strata_check_extra.get("id")))
            del new_config["strata"][new_config["strata"].index(strata_check_extra)]

if "ore" in config:
    for ore_check_extra in config["ore"]:
        if "file" in ore_check_extra and ore_check_extra.get("active") is not False:
            new_config["ore"].extend(extra_file(ore_check_extra["file"], "ore", ore_check_extra.get("id")))
            del new_config["ore"][new_config["ore"].index(ore_check_extra)]

config = copy.deepcopy(new_config)

# id, block, dim, texture (invalid?)
# active (optional)
stratas = []
if "strata" in config:
    for strata_add in config["strata"]:
        if strata_add.get("active") is False:
            continue

        # checks if all needed values exist
        if all([True if key in strata_add else False for key in ["id", "block", "dim"]]):

            if not all([isinstance(strata_add[key], str) for key in ["id", "block"]]):
                logging("type_error", f'"id" or "block" is not a string type in strata with the id: {strata_add["id"]}, skipping this strata')
                continue

            # checks if the id already exists
            if not all(False if strata_check[0] == strata_add["id"] else True for strata_check in stratas):
                logging("config_error", f'duplicate id for strata {strata_add["id"]}, skipping this strata')
                continue

            # adds the strata to the array
            stratas.append([strata_add[key] for key in ["id", "block", "dim"]])

        else:
            logging("config_error", f'missing "id", "block" or "dim" argument in strata: {strata_add.get("id")}, skipping this strata')

dims = []
for strata in stratas:
    # if the dim section is no list then it makes it a list
    if not isinstance(strata[2], list):
        logging("type_error", f'the dim argument is not a list in strata {strata["id"]} (can be fixed for types: str, int and float), otherwise skipping this strata')

    if isinstance(strata[2], (str, int, float)):
        strata[2] = [str(strata[2])]
    elif not isinstance(strata[2], list):
        stratas.remove(strata)
        continue

    # adds all dims from the stratas to the dims list
    for i in range(len(strata[2])):
        if strata[2][i] not in dims:
            dims.append(strata[2][i])

# all dimension and an array for each
# id, block, texture (valid)
stratas_sorted = {}
for dim in dims:
    stratas_dim = []
    # orders the stratas after dim
    for strata in copy.deepcopy(stratas):
        for i in range(len(strata[2])):
            if strata[2][i] == dim:
                strata.pop(2)
                stratas_dim.append(strata)
                break

    stratas_sorted = stratas_sorted | {dim: stratas_dim}

logging("info", 'The Strata Config section has been read and processed successfully')

#add_formatters = True
#if config["system"].get("add_formatters") is False:
#    add_formatters = False

# id, dim, texture (valid), values, extra_rules, use original, displayName
ores = []
if "ore" in config:
    for ore_add in config["ore"]:
        if not ore_add.get("active"):
            continue

        continue_ = False
        # checks if all needed values exist
        if all([True if key in ore_add else False for key in ["id", "dim", "values"]]):

            # checks if id is string type
            if not all([isinstance(ore_add[key], str) for key in ["id"]]):
                logging("type_error", f'"id" is not a string type in ore with the id: {ore_add["id"]}, skipping this ore')
                continue

            # checks if the id already exists
            if not all(False if ore_check[0] == ore_add["id"] else True for ore_check in ores):
                logging("config_error", f'duplicate id for ore {ore_add["id"]}, skipping this ore')
                continue

            # creates the display_name
            display_name = str(ore_add["id"]).replace("_", " ").title()
            if "displayName" in ore_add and isinstance(ore_add["displayName"], str):
                display_name = str(ore_add["displayName"])

            # checks original variable
            if ore_add["values"].get("variant") is not None and ore_add["values"]["variant"].get("original") is not None:
                original = True
            else:
                original = False
            
            # texture verification
            if not original:
                if ore_add.get("texture") is not None:
                    # checks if the texture section is valid
                    texture_valid = [True if key in ore_add["texture"] else False for key in ["color", "type", "name"]]

                    # checks if the texture exist (only if it's the texture variant)
                    if texture_valid == [0, 0, 1]:
                        if not os.path.isfile(f"{path_}textures\\ore\\{ore_add['texture']['name']}.png"):
                            logging("texture_missing", f'The following ore texture file is missing: "textures\\ore\\{ore_add["texture"]["name"]}.png"')
                            continue

                    # checks if the texture color and type are valid (only if it's the tint variant)
                    elif texture_valid == [1, 1, 0]:
                        if not re.search(r'^#[0-9a-fA-F]{6}$', ore_add['texture']["color"]) or not ore_add['texture']["type"] in range(1, 11):
                            logging("config_error", f'The color or the type in the texture section in the ore {ore_add["id"]} is invalid, skipping this ore')
                            continue
                    else:
                        logging("config_error", f'The texture section in the ore {ore_add["id"]} is invalid, skipping this ore')
                        continue

                else:
                    logging("config_error", f'missing "textures" argument in ore: {ore_add.get("id")}, skipping this ore')
                    continue

            # dim verification
            # if the dim section is no list then it makes it a list
            if not isinstance(ore_add["dim"], list):
                logging("type_error", f'the dim argument is not a list in ore {ore_add["id"]} (can be fixed for types: str, int and float), otherwise skipping this ore')

            if isinstance(ore_add["dim"], (str, int, float)):
                ore_add["dim"] = [ore_add["dim"]]
            elif not isinstance(ore_add["dim"], list):
                continue

            # checks if the dim in the values section is valid
            copy_dim_section = copy.deepcopy(ore_add["dim"])
            for i_dim in range(len(ore_add["dim"])):
                if not ore_add["dim"][i_dim] in dims:
                    if enable_logging_dim_not_existent_errors:
                        logging("config_error", f'Unknown Dimension: {ore_add["dim"][i_dim]} in {ore_add["id"]}, skipping this dim')
                    del copy_dim_section[i_dim]

            ore_add["dim"] = copy_dim_section
            if ore_add["dim"] == []:
                continue

            # extra_strata_rules verification
            extra_rules = []
            all_stratas_in_extra_rules = []
            if ore_add.get("extra_rules") is not None:
                # gets all stratas for this ore's dimensions
                all_stratas = []
                for dim in ore_add["dim"]:
                    all_stratas.extend([strata[0] for strata in stratas_sorted[dim]])
                    
                for extra_rule in ore_add["extra_rules"]:
                    # checks if strata exists
                    if extra_rule.get("strata") is not None and extra_rule["strata"] in all_stratas:
                        # checks if an extra rule with that strata has already been added
                        if extra_rule["strata"] not in all_stratas_in_extra_rules:
                            extra_rules.append(extra_rule)
                            all_stratas_in_extra_rules.append(extra_rule["strata"])

                        else:
                            logging("config_error", f"Duplicate strata in 2 extra rules: {extra_rule['strata']}, in ore {ore_add['id']}")
                    else:
                        if enable_logging_strata_not_existent_errors:
                            logging("config_error", (f"No strata section or the strata doesn't exist for the specified dims "
                                                     f"in extra rule {ore_add['extra_rules'].index(extra_rule)}, in ore {ore_add['id']}"))

            # adds the ore to the array
            ores.append([ore_add.get(key) for key in ["id", "dim", "texture", "values"]] + [extra_rules, original, display_name])

        else:
            logging("config_error", f'missing "id", "dim" or "values" argument in ore: {ore_add.get("id")}, skipping this ore')

logging("info", 'The Ore Config section has been read and processed successfully')

# opens needed files for osvcommon gen
with open(f"{path_}/base_files/osv/osv-common_values.json", "r") as file_osvcommon_values:
    osvcommon_values = json.load(file_osvcommon_values)

with open(f"{path_}/base_files/osv/osv-common_base.txt", "r") as file_osvcommon_base:
    osvcommon_base = file_osvcommon_base.read()

with open(f"{path_}/base_files/osv/osv-common_base_default.toml", "rb") as file_osvcommon_base_default:
    osvcommon_base_default = tomli.load(file_osvcommon_base_default)

logging("info", 'Base files read successfully')

total_ores = 0
all_ores = []
total_unique_ores = 0
values_for_osvcommon = ""
for ore in ores:
    # changes the formatters section if it is enabled
    # if add_formatters and (ore[3].get("item") is None or ore[3]["item"].get("formatters") is None):
    #    ore[3]["item"]["formatters"] = {"": [{"text": "%s ({bg})" % (ore[6])}]}

    # makes changes if there is no original
    if not ore[5]:
        ore[3]["variant"] = {"original": f"osv:custom_{ore[0]}_ore"}
        if ore[3].get("recipe") in [None, {}]:
            ore[3]["recipe"] = {"result": "minecraft:air"}

        if ore[3].get("texture") is None:
            ore[3]["texture"] = {"original": f"osv:block/custom/custom_{ore[0]}_ore",
                                 "overlay": f"osv:block/custom/custom_{ore[0]}_ore"}
        else:
            for variant in ["original", "overlay"]:
                if dict(ore[3])["texture"].get(variant) is None:
                    ore[3]["texture"][variant] = f"osv:block/custom/custom_{ore[0]}_ore"

    # generates the string for the ore file
    values_for_ore_file = ""
    types = ["variant", "block", "state", "item", "forge", "texture", "recipe", "loot", "nested", "gen"]
    for type_ in types:
        if not ore[3].get(type_) is None:
            values_for_ore_file += f"'{type_}': " + str(ore[3][type_]).replace("True", "true").replace("False", "false") + ", "

    # creates the ore file
    with open(f"{path_to_osv_ores}custom\\custom_{ore[0]}_ore.hjson", "w") as file:
        file.write("{" + values_for_ore_file.removesuffix(", ") + "}")

    # copies textures
    if not ore[5]:
        # with tinting
        if sum([1 if key in ore[2] else 0 for key in ["color", "type", "name"]]) == 2:
            texture = tint_texture(f"{path_}textures\\overlay_base\\ore_{ore[2]['type']}.png", ore[2]['color'])
            texture.save(f"{path_to_osv_assets}textures\\block\\custom\\custom_{ore[0]}_ore.png", "PNG")
            texture.save(f"{path_to_osv_assets}textures\\block\\custom\\custom_{ore[0]}_ore_shade.png", "PNG")

        # without tinting
        else:
            shutil.copyfile(f"{path_}textures\\ore\\{ore[2]['name']}.png",
                            f"{path_to_osv_assets}textures\\block\\custom\\custom_{ore[0]}_ore.png")
            shutil.copyfile(f"{path_}textures\\ore\\{ore[2]['name']}.png",
                            f"{path_to_osv_assets}textures\\block\\custom\\custom_{ore[0]}_ore_shade.png")

    values_extra_rules = []
    true_exists = False
    # gets the active only values in order for each extra rule
    for extra_rule in ore[4]:
        if extra_rule.get("active_only") is True:
            values_extra_rules.append(True)
            true_exists = True
        elif extra_rule.get("active_only") is False:
            values_extra_rules.append(False)
        else:
            values_extra_rules.append(None)

    active_stratas_extra_rule = []
    all_stratas = []
    for dim in ore[1]:
        all_stratas.extend([strata[0] for strata in copy.deepcopy(stratas_sorted[dim])])

    for i, boolean in enumerate(values_extra_rules):
        # removes the stratas if they were used in extra_rules
        all_stratas.remove(ore[4][i]["strata"])

        # add all stratas used in extra rules to array
        if not ore[4][i]["strata"] in active_stratas_extra_rule:
            if (true_exists and boolean) or (not true_exists and boolean in [True, None]):
                active_stratas_extra_rule.append(ore[4][i]["strata"])

    # adds all missing stratas to the array
    active_stratas = copy.deepcopy(active_stratas_extra_rule)
    if not true_exists:
        active_stratas.extend(all_stratas)

    stratas_added = []
    all_ores_strata = []
    for dim in ore[1]:
        for strata in stratas_sorted[dim]:
            if strata[0] in active_stratas and strata[0] not in stratas_added:
                # needed later for osvcommon gen
                values_for_osvcommon += f"        custom_{ore[0]}_ore {strata[1]}\n"
                
                # needed later for ore drops. minecraft is removed, cause it isn't generated by the mod osv
                if strata[1][:strata[1].find(':')] == "minecraft":
                    all_ores_strata.append([strata[1], f"custom_{ore[0]}_ore_{strata[1][strata[1].find(':') + 1:]}"])
                else:
                    all_ores_strata.append([strata[1], f"custom_{ore[0]}_ore_{strata[1].replace(':', '_', 1)}"])
                    
                stratas_added.append(strata[0])
                total_unique_ores += 1
    
    # [[ore_id, [[strata, name_block], ...]], ...]
    all_ores.append([ore[0], all_ores_strata])
    
    if stratas_added != []:
        total_ores += 1

logging("info", 'HJSON and Texture files created successfully')

format_osvcommon_array = [values_for_osvcommon]
for value in osvcommon_values["values"]:
    for key in value[1]:
        if not config.get("osv_common") is None and not config["osv_common"].get(value[0]) is None and not config["osv_common"][value[0]].get(key) is None:
            format_osvcommon_array.append(str(config["osv_common"][value[0]][key]))
        else:
            format_osvcommon_array.append(str(osvcommon_base_default[value[0]][key]))

with open(path_.removesuffix(file_loc + "\\") + "config\\osv-common.hjson", "w") as file_osvcommon:
    file_osvcommon.write(str(osvcommon_base % tuple(format_osvcommon_array)).replace("True", "true").replace("False", "false"))

logging("info", 'osv-common config created successfully')
logging("info", f'Generated {total_ores} ores and {total_unique_ores} unique ore blocks with accounting for stratas!')

# ---------------------------------------------- #
# FINISHED FIRST PART OF SCRIPT. STARTING SECOND #
# ---------------------------------------------- #

logging("info", 'finished osv config generation. Starting second the part of script.')
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\client_scripts\\ore_unification\\tooltips")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\item_add")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\block_add")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\slurry_add\\dirty")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\slurry_add\\clean")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\jei_hide")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\replace_output")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\remove_recipes")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\add_tags")
clear_path(path_.removesuffix(file_loc + '\\') + f"kubejs\\assets\\unification")

# used for counting
material_added = 0
texture_replaced = 0
type_added = 0
element_removed = 0

# used for mod checking
makanism_types = ["crystal", "shard", "clump", "dirty_dust", "clean_slurry", "dirty_slurry"]
bloodmagic_types = ["fragment", "gravel"]
create_types = ["crushed"]

# opens the file and reads the mod list
if os.path.isfile(f"{path_}config\\mod_list.toml"):
    with open(f"{path_}config\\mod_list.toml", "rb") as f:
        try:
            config_mod_list = tomli.load(f)
        except tomli.TOMLDecodeError as ex:
            logging("file_error", f"mod specific config\\mod_list file invalid, check for any syntax errors", ex)

else:
    logging("file_missing", f"missing config file: {path_}config\\mod_list.toml")

mod_list = ["minecraft"]
if config_mod_list.get("mods") is not None:
    for mod_to_check in config_mod_list["mods"]:
        if config_mod_list["mods"][mod_to_check] is True:
            mod_list.append(mod_to_check)


def check_material(type_material):
    if type_material in makanism_types and "mekanism" not in mod_list:
        return False
    elif type_material in bloodmagic_types and "bloodmagic" not in mod_list:
        return False
    elif type_material in create_types and "create" not in mod_list:
        return False

    return True


def check_mod(mod):
    return mod in mod_list


def config_mat_set_default():
    result = {}
    for index, check_config in enumerate(["active", "overwrite_texture", "add_tooltip", "add_element", "add_tag", "hide_jei", "replace_output", "replace_input", "remove_tag"]):
        if index in [0, 1, 2, 3, 4]:
            result[check_config] = True
        else:
            result[check_config] = False
    return result


def gen_config(id_file, id_name, base_file):
    config_options_needed = [0]

    if base_file.get(id_name) is not None and base_file[id_name].get("replace") is not None and base_file[id_name]["replace"] != []: 
        config_options_needed.extend([1, 2])
    if base_file.get(id_name) is not None and base_file[id_name].get("add") is not None and base_file[id_name]["add"] != []: 
        config_options_needed.extend([2, 3, 4])
    if base_file.get(id_name) is not None and base_file[id_name].get("remove") is not None and base_file[id_name]["remove"] != {}: 
        config_options_needed.extend([5, 6, 7, 8])

    config_add = f"\n[{id_name}]\n"

    config_options = [
        "    active = true\n",
        "    overwrite_texture = true\n",
        "    add_tooltip = true\n",
        "    add_element = true\n",
        "    add_tag = true\n",
        "    hide_jei = false\n",
        "    replace_output = true\n",
        "    replace_input = true\n",
        "    remove_tag = true\n"
    ]

    for i in range(9):
        if i in config_options_needed:
            config_add += config_options[i]

    return [f"{path_}config\\mod_specific\\{id_file}.toml", id_file + ".toml", config_add, 0, "", ""]


path_general_config = f"{path_}\\base_files\\kubejs\\registry\\general.json"
if os.path.isfile(path_general_config):
    with open(path_general_config) as f:
        try:
            config_general_file = json.load(f)
        except json.decoder.JSONDecodeError as ex:
            logging("file_error", "The Base File kubejs\\registry\\general.json couldn't be read, check for any syntax errors / redownload the file", ex)
else:
    logging("file_missing", "The Base File kubejs\\registry\\general.json couldn't be found, redownload the file")

def get_display_name(type_material, display_name):
    if config_general_file.get("names") is not None and config_general_file["names"].get(type_material) is not None:
        return str(config_general_file["names"][type_material] % (display_name,))
    else:
        logging("type_missing", f"The {type_material} material type is missing in general.json, please add it, to format Display Names correctly")
        return display_name


def read_info():
    array_write_to_files = []
    
    if os.path.isfile(f"{path_}base_files\\kubejs\\registry\\gen_scripts_info.json"):
        with open(f"{path_}base_files\\kubejs\\registry\\gen_scripts_info.json") as f:
            try:
                info = json.load(f)
            except json.decoder.JSONDecodeError as ex:
                logging("file_error", f"The Base File kubejs\\registry\\gen_scripts_info.json couldn't be read, check for any syntax errors / redownload the file", ex)
    else:
        logging("file_missing", f"missing base file: {path_}base_files\\kubejs\\registry\\gen_scripts_info.json")
    
    if info.get("main") is not None:
        for element in info["main"]:
            array_write_to_files.extend(gen_scripts(element[0], element[1], element[2]))

    for ore in all_ores: 
        # think about if this should really be done this way and not all tags removed from the item seperatly
        #array_write_to_files.append([path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\remove_tags\\ores_items.js", "ores_items.js", 
        #                             f"    event.removeAll('forge:ores/{ore[0]}')\n", 50, "onEvent('item.tags', event => {\n    event.removeAll('forge:ores')\n", "})"])
        #array_write_to_files.append([path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\remove_tags\\ores_blocks.js", "ores_blocks.js", 
        #                             f"    event.removeAll('forge:ores/{ore[0]}')\n", 50, "onEvent('block.tags', event => {\n    event.removeAll('forge:ores')\n", "})"])
        for ore_strata in ore[1]:
            item_name = f'osv:{ore_strata[1]}'[:-6] if ore_strata[1].endswith("ore_stone") else f'osv:{ore_strata[1]}'
            array_write_to_files.append([path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\add_tags\\items\\ores.js", "ores.js", 
                                         f"    event.add('forge:ores/{ore[0]}', '{item_name}')\n    event.add('forge:ores', '{item_name}')\n", 40, "onEvent('item.tags', event => {\n", "})"])
            array_write_to_files.append([path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\add_tags\\blocks\\ores.js", "ores.js", 
                                         f"    event.add('forge:ores/{ore[0]}', '{item_name}')\n    event.add('forge:ores', '{item_name}')\n", 40, "onEvent('block.tags', event => {\n", "})"])

    write_to_files(array_write_to_files)


def gen_scripts(id_file, id_name, display_name):
    array_write_to_files = []

    # opens needed files
    if os.path.isfile(f"{path_}base_files\\kubejs\\registry\\{id_file}.json"):
        with open(f"{path_}base_files\\kubejs\\registry\\{id_file}.json", encoding="utf-8") as f:
            try:
                base_file_registry = json.load(f)
            except json.decoder.JSONDecodeError as ex:
                logging("base_file_error", f"The Base File {path_}base_files\\kubejs\\registry\\{id_file}.json couldn't be read, check for any syntax errors / redownload the file", ex)
                return []
    else:
        logging("base_file_missing", f"missing base file: {path_}base_files\\kubejs\\registry\\{id_file}.json")
        return []

    if base_file_registry.get(id_name) is None:
        logging("material_missing", f"The following material id is not defined in the following base file: {id_name}, {path_}base_files\\kubejs\\registry\\{id_file}.json")
        return []

    license_notice = base_file_registry.get("license_notice")
    if license_notice is None:
        license_notice = ""
    else:
        license_notice = "".join(license_notice)
        
    config_mat = {}
    # opens the file to check if this item is active
    if os.path.isfile(f"{path_}config\\mod_specific\\{id_file}.toml"):
        with open(f"{path_}config\\mod_specific\\{id_file}.toml", "rb") as f:
            try:
                config_file = tomli.load(f)
                if config_file.get(id_name) is not None:
                    for check_config in ["active", "overwrite_texture", "add_tooltip", "add_element", "add_tag", "hide_jei", "replace_output", "replace_input", "remove_tag"]:
                        if config_file[id_name].get(check_config) is not None:
                            config_mat[check_config] = config_file[id_name][check_config]
                        else:
                            config_mat[check_config] = False

                else:
                    config_mat = config_mat_set_default()
                    array_write_to_files.append(gen_config(id_file, id_name, base_file_registry))

            except tomli.TOMLDecodeError as ex:
                logging("config_error", f"mod specific config\\{id_file} file invalid, check for any syntax errors", ex)
                config_mat = config_mat_set_default()

    else:
        config_mat = config_mat_set_default()
        array_write_to_files.append(gen_config(id_file, id_name, base_file_registry))

    array_write_to_files.extend(register_elements(id_file, id_name, display_name, base_file_registry, config_mat, license_notice))
    return array_write_to_files
    

def register_elements(id_file, id_name, display_name, base_file_registry, config_mat, license_notice):
    array_write_to_files = []
    anything_changed = 0

    if base_file_registry[id_name].get("replace") is not None:
        all_element_to_replace = []
        for element_to_replace in base_file_registry[id_name]["replace"]:
            if len(element_to_replace) == 3 and check_material(element_to_replace[0]):
                active_overwrite_texture = (config_mat["overwrite_texture"] and config_mat["active"])
                return_replace_texture = replace_texture(id_name, element_to_replace[0], element_to_replace[1], id_file, active_overwrite_texture, False)
                globals()["texture_replaced"] += return_replace_texture
                anything_changed += return_replace_texture
                if config_mat["overwrite_texture"] and config_mat["add_tooltip"] and config_mat["active"] and element_to_replace[0] not in all_element_to_replace:
                    array_write_to_files.append(add_item_tooltip(element_to_replace[2], id_file, license_notice))
                if config_mat["add_tag"]:
                    is_block = True if element_to_replace[0] in ["raw_block", "storage_block"] else False
                    array_write_to_files.extend(add_tag(element_to_replace[2], f"forge:{element_to_replace[0]}s/{id_name}", is_block, id_file, license_notice))
                    array_write_to_files.extend(add_tag(element_to_replace[2], f"forge:{element_to_replace[0]}s", is_block, id_file, license_notice))
                all_element_to_replace.append(element_to_replace[0])

    if config_mat["active"]:
        all_added = []
        if base_file_registry[id_name].get("add") is not None:
            for element_to_add in base_file_registry[id_name]["add"]:
                if config_mat["add_element"] and check_material(element_to_add):
                    all_added.append(element_to_add)

                    color = ""
                    if element_to_add.startswith("slurry") or element_to_add.startswith("molten"):
                        if re.search(r'^#[0-9a-fA-F]{6}$', element_to_add.replace("slurry", "").replace("molten", "")):
                            color = "0x" + element_to_add.replace("slurry#", "").replace("molten#", "")
                            element_to_add = element_to_add[:-7]

                    return_add_element = add_element(id_name, element_to_add, id_file, display_name, color, license_notice)
                    if return_add_element != "":
                        array_write_to_files.extend(return_add_element)
                        globals()["type_added"] += 1
                        anything_changed += 1
                        if not element_to_add.startswith("slurry") and not element_to_add.startswith("molten"):
                            if config_mat["add_tooltip"]:
                                array_write_to_files.append(add_item_tooltip(f"unification:{id_name}_{element_to_add}", id_file, license_notice))
                            if config_mat["add_tag"]:
                                is_block = True if element_to_add in ["raw_block", "storage_block"] else False
                                array_write_to_files.extend(add_tag(f"unification:{id_name}_{element_to_add}", f"forge:{element_to_add}s/{id_name}", is_block, id_file, license_notice))
                                array_write_to_files.extend(add_tag(f"unification:{id_name}_{element_to_add}", f"forge:{element_to_add}s", is_block, id_file, license_notice))

        if base_file_registry[id_name].get("remove") is not None:
            for check_remove in all_added:
                if base_file_registry[id_name]["remove"].get(check_remove) is not None:
                    for element_to_remove in base_file_registry[id_name]["remove"][check_remove]:
                        mod_id = element_to_remove[:element_to_remove.find(":")]
                        if check_mod(mod_id) is False:
                            continue

                        globals()["element_removed"] += 1
                        anything_changed += 1
                        if config_mat["hide_jei"]:
                            array_write_to_files.append(jei_hide(element_to_remove, id_file, license_notice))
                        if config_mat["replace_output"]:
                            array_write_to_files.append(replace_output(element_to_remove, f"unification:{id_name}_{check_remove}", id_file, license_notice))
                        if config_mat["replace_input"]:
                            array_write_to_files.append(replace_input(element_to_remove, f"#forge:{check_remove}/{id_name}", id_file, license_notice)) # use non tag? f"kubejs:{id_name}_{check_remove}"
                        if config_mat["remove_tag"]:
                            array_write_to_files.extend(remove_tag(element_to_remove, id_file, license_notice))
        
            array_write_to_files.extend(register_recipes(id_file, id_name, base_file_registry))

        if anything_changed > 1:
            globals()["material_added"] += 1
        return array_write_to_files

    else:
        if anything_changed > 1:
            globals()["material_added"] += 1
        return []


def register_recipes(id_file, id_name, base_file_registry):
    array_write_to_files = []

    # opens needed files
    if os.path.isfile(f"{path_}base_files\\kubejs\\recipe\\{id_file}.json"):
        with open(f"{path_}base_files\\kubejs\\recipe\\{id_file}.json", encoding="utf-8") as f:
            try:
                base_file_recipe = json.load(f)
            except json.decoder.JSONDecodeError as ex:
                logging("base_file_error", f"The Base File {path_}base_files\\kubejs\\recipe\\{id_file}.json couldn't be read, check for any syntax errors / redownload the file", ex)
                return []
    else:
        logging("base_file_missing", f"missing base file: {path_}base_files\\kubejs\\recipe\\{id_file}.json")
        return []

    if base_file_recipe.get(id_name) is None:
        logging("material_missing", f"The following material id is not defined in the following base file: {id_name}, {path_}base_files\\kubejs\\recipe\\{id_file}.json")
        return []

    license_notice = base_file_recipe.get("license_notice")
    if license_notice is None:
        license_notice = ""
    else:
        license_notice = "".join(license_notice)
    
    file_path = path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\recipes\\{id_file}\\{id_name}.js"        
    if base_file_recipe[id_name].get("remove") is not None:
        for recipe_to_remove in base_file_recipe[id_name]["remove"]:
            array_write_to_files.append([file_path, f"{id_name}.js", f'    event.remove({{id: "{recipe_to_remove}"}})\n', 50, "onEvent('recipes', event => {\n", "})"])

    recipes = []
    if base_file_recipe[id_name].get("add") is not None:
        #material names
        mns = {}

        if base_file_registry[id_name].get("add") is not None:
            for material in base_file_registry[id_name]["add"]:
                if material.startswith("slurry"):
                    mns["dirty_slurry"] = f"unification:dirty_{id_name}_slurry"
                    mns["clean_slurry"] = f"unification:clean_{id_name}_slurry"
                elif material.startswith("molten"):
                    mns["molten"] = f"unification:molten_{id_name}"
                else:
                    mns[material] = f"unification:{id_name}_{material}"

        if base_file_registry[id_name].get("replace") is not None:
            for material_array in base_file_registry[id_name]["replace"]:
                if material_array[0] not in mns:
                    if not (material.startswith("slurry") or material.startswith("molten")):
                        mns[material_array[0]] = material_array[2]
        
        if base_file_recipe[id_name].get("variants") is not None:
            for material in base_file_recipe[id_name]["variants"]:
                if material not in mns:
                    mns[material] = base_file_recipe[id_name]["variants"][material]

        all_coin = ["ftbic.coin", "thermal.coin"]
        all_dust = ["appliedenergistics2.dust", "bloodmagic.dust", "create.dust", "ftbic.dust", "immersiveengineering.dust", "mekanism.dust", "occultism.dust",
            "potionsmaster.dust", "silents_mechanisms.dust", "thermal.dust"
        ]
        all_gear = ["ftbic.gear", "immersiveengineering.gear", "thermal.gear", "minecraft.gear"]
        all_plate = ["boss_tools.plate", "boss_tools_giselle_addon.plate", "create.plate", "ftbic.plate", "immersiveengineering.plate", "thermal.plate"]
        all_rod = ["boss_tools_giselle_addon.rod", "createaddition.rod", "ftbic.rod", "immersiveengineering.rod", "minecraft.rod"]
        all_wire = ["boss_tools_giselle_addon.wire", "createaddition.wire", "ftbic.wire", "immersiveengineering.wire", "minecraft.wire"]
        for recipe in base_file_recipe[id_name]["add"]:
            if not isinstance(recipe, list):
                recipe = [recipe]

            if recipe[0] in all_coin: recipes.append(pass_inputs([id_name, mns.get('coin')], recipe[1:2]))
            elif recipe[0] in all_dust: recipes.append(pass_inputs([id_name, mns.get('dust')], recipe[1:2]))
            elif recipe[0] in all_gear: recipes.append(pass_inputs([id_name, mns.get('gear')], recipe[1:2]))
            elif recipe[0] in all_plate: recipes.append(pass_inputs([id_name, mns.get('plate')], recipe[1:2]))
            elif recipe[0] in all_rod: recipes.append(pass_inputs([id_name, mns.get('rod')], recipe[1:2]))
            elif recipe[0] in all_wire: recipes.append(pass_inputs([id_name, mns.get('wire')], recipe[1:2]))

            elif recipe[0] == "appliedenergistics2.ore_processing": recipes.append(pass_inputs([id_name, mns.get('dust'), mns.get("gem_multiplyer")], recipe[1:2]))

            elif recipe[0] == "astralsorcery.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "astralsorcery.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('ingot')], recipe[1:2]))

            elif recipe[0] == "betterendforge.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "betterendforge.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('ingot')], recipe[1:2]))

            elif recipe[0] == "bloodmagic.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('dust'), mns.get('gravel'), mns.get('fragment')], recipe[1:2]))

            elif recipe[0] == "create.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "create.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('ingot'), mns.get("nugget"), mns.get("crushed_ore")], recipe[1:2]))

            elif recipe[0] == "engineerstools.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('dust')], recipe[1:2]))

            elif recipe[0] == "exnihilo.pieces_to_raw": recipes.append(pass_inputs([id_name, mns.get('raw_material')], recipe[1:2]))

            elif recipe[0] == "ftbic.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('dust'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "ftbic.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('dust')], recipe[1:2]))

            elif recipe[0] == "immersiveengineering.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "immersiveengineering.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('ingot'), mns.get('dust')], recipe[1:2]))

            elif recipe[0] == "integrateddynamics.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('dust'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "integrateddynamics.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('dust')], recipe[1:2]))

            elif recipe[0] == "mekanism.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "mekanism.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('dust'), mns.get('dirty_dust'), mns.get('clump'), mns.get('shard'), 
                                                                                           mns.get('crystal'), mns.get('clean_slurry'), mns.get('dirty_slurry')], recipe[1:2]))
                
            elif recipe[0] == "minecraft.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "minecraft.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('ingot')], recipe[1:2]))
            elif recipe[0] == "minecraft.smelting_recipes": recipes.append(pass_inputs([id_name, [mns.get('ingot'), mns.get('gem')], mns.get('nugget'), False], recipe[1:2]))
            elif recipe[0] == "minecraft.storage_convert_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get('block')], recipe[1:2]))
            elif recipe[0] == "minecraft.storage_convert_metal": recipes.append(pass_inputs([id_name, mns.get('ingot'), mns.get('block'), mns.get('nugget')], recipe[1:2]))
            elif recipe[0] == "minecraft.storage_convert_raw": recipes.append(pass_inputs([id_name, mns.get('raw_material'), mns.get('raw_block')], recipe[1:2]))
            
            elif recipe[0] == "occultism.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('dust')], recipe[1:2]))

            elif recipe[0] == "silents_mechanisms.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "silents_mechanisms.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('dust')], recipe[1:2]))

            elif recipe[0] == "tconstruct.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('molten'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "tconstruct.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('molten')], recipe[1:2]))
            elif recipe[0] == "tconstruct.smelting": recipes.append(pass_inputs([id_name, mns.get('molten')], recipe[1:2]))
            elif recipe[0] == "tconstruct.casting": recipes.append(pass_inputs([mns.get('molten'), mns.get('storage_block'), mns.get('ingot'), mns.get('nugget'), mns.get('gem'),
                                                                                mns.get('plate'), mns.get('gear'), mns.get('rod'), mns.get('wire'), mns.get('coin')], recipe[1:2]))
            
            elif recipe[0] == "thermal.coin_to_energy": recipes.append(pass_inputs([id_name, mns.get('energy_from_coin')], recipe[1:2]))
            elif recipe[0] == "thermal.ingot_in_chiller": recipes.append(pass_inputs([mns.get('molten'), mns.get('ingot')], recipe[1:2]))
            elif recipe[0] == "thermal.ingot_in_smelter": recipes.append(pass_inputs([id_name, mns.get('ingot')], recipe[1:2]))
            elif recipe[0] == "thermal.ore_processing_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get("gem_multiplyer")], recipe[1:2]))
            elif recipe[0] == "thermal.ore_processing_metal": recipes.append(pass_inputs([id_name, mns.get('ingot'), mns.get('dust')], recipe[1:2]))
            elif recipe[0] == "thermal.rod": recipes.append(pass_inputs([mns.get("molten"), mns.get("rod")], recipe[1:2]))
            elif recipe[0] == "thermal.storage_convert_gem": recipes.append(pass_inputs([id_name, mns.get('gem'), mns.get('block')], recipe[1:2]))
            elif recipe[0] == "thermal.storage_convert_metal": recipes.append(pass_inputs([id_name, mns.get('ingot'), mns.get('block'), mns.get('nugget')], recipe[1:2]))

            else: 
                logging("recipe_error", f"Unknown recipe type: {recipe[0]}")
                continue

            recipes[-1] = f"    global.rp.{recipe[0]}(event, " + recipes[-1] + ")\n"
            
    for recipe in recipes:
        array_write_to_files.append([file_path, f"{id_name}.js", recipe, 50, "onEvent('recipes', event => {\n", "})"])
    
    return array_write_to_files


def pass_inputs(params, remove):
    for i in remove:
        params.remove(i)
    return str(params).removeprefix("[").removesuffix("]").replace("None", "null").replace("False", "false").replace("True", "true")


def add_item_tooltip(id_item, id_file, license_notice):
    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\client_scripts\\ore_unification\\tooltips\\{id_file}.js"
    tooltip_add = f"    global.scripts.add_item_tooltip(event, '{id_item}')\n"
    return [path_script_file, id_file + ".js", tooltip_add, 100, license_notice + "onEvent('item.tooltip', event => {\n", "})"]


def replace_texture(id_name, type_material, texture_path, id_file, active, isAdding):
    if(texture_path.find(":") == -1):
        return 0
    
    texture_path_seperator_index = texture_path.find(":")
    texture_path_mod_name = texture_path[:texture_path_seperator_index]
    texture_path_other = texture_path[texture_path_seperator_index + 1:]
    texture_path_copy_to = path_.removesuffix(file_loc + '\\') + f"resources\\{texture_path_mod_name}\\textures\\{texture_path_other}.png"

    extra_file_path = ""
    if(type_material == "coin"):
        extra_file_path = texture_path[-1]

    if not os.path.isdir(texture_path_copy_to[:texture_path_copy_to.replace("/", "\\").rfind("\\") + 1]):
        os.makedirs(texture_path_copy_to[:texture_path_copy_to.replace("/", "\\").rfind("\\") + 1])

    if active and (check_mod(texture_path_mod_name) or texture_path_mod_name == "unification"):
        if type_material in ["raw_block", "storage_block"]:
            texture_path_copy_from = f"{path_}textures\\general\\{id_file}\\{id_name}\\block\\{id_name}_{type_material}{extra_file_path}.png"
        else:
            texture_path_copy_from = f"{path_}textures\\general\\{id_file}\\{id_name}\\item\\{id_name}_{type_material}{extra_file_path}.png"

        if os.path.isfile(texture_path_copy_from):
            shutil.copyfile(texture_path_copy_from, texture_path_copy_to)
            return 1
        else:
            if isAdding:
                logging("texture_missing", (f"The following Meterial texture file is missing, for that reason this item or block won't be added: : "
                    f"{texture_path_copy_from.removeprefix(path_)}"))
            else:
                logging("texture_missing", (f"The following Meterial texture file is missing, meaning this texture file couldn't be copied to replace a texture: "
                    f"{texture_path_copy_from.removeprefix(path_)}"))
            if os.path.isfile(texture_path_copy_to):
                os.remove(texture_path_copy_to)
            return 0

    elif os.path.isfile(texture_path_copy_to):
        os.remove(texture_path_copy_to)
        return 0

    return 0


def add_element(id_name, type_material, id_file, display_name, color, license_notice):
    if type_material in ["raw_block", "storage_block"]:
        return add_block(id_name, type_material, id_file, display_name, license_notice)
    
    elif type_material.startswith("molten"):
        return add_molten(id_name, type_material, id_file, display_name, color, license_notice)

    elif type_material.startswith("slurry"):
        return add_slurry(id_name, type_material, id_file, display_name, color, license_notice)
    
    elif type_material == "coin": 
        return add_coin(id_name, id_file, display_name, license_notice)

    else:
        return add_item(id_name, type_material, id_file, display_name, license_notice)


def add_item(id_name, type_material, id_file, display_name, license_notice):
    texture_path = f"unification:{id_file}/{id_name}/item/{id_name}_{type_material}"
        
    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\item_add\\{id_file}.js"
    texture_exists = replace_texture(id_name, type_material, texture_path, id_file, True, True)
    material_add = f"    global.scripts.add_item(event, '{id_name}', '{type_material}', '{texture_path}', '{get_display_name(type_material, display_name)}')\n"

    if texture_exists == 1: 
        return [[path_script_file, id_file + ".js", material_add, 100, license_notice + "onEvent('item.registry', event => {\n", "})"]]
    else: 
        return ""


def add_coin(id_name, id_file, display_name, license_notice):
    texture_path = f"unification:{id_file}/{id_name}/item/{id_name}_coin"

    model_files = []
    texture_exists = 0
    for i in range(5):
        texture_exists += replace_texture(id_name, "coin" + str(i), texture_path + str(i), id_file, True, True)
        path_model_file = path_.removesuffix(file_loc + '\\') + f"resources\\unification\\models\\{id_file}\\{id_name}\\item\\{id_name}_coin{i}.json"
        model_json = '{"parent": "item/generated", "textures": {"layer0": "' + texture_path  + str(i) + '"}}'
        model_files.append([path_model_file, f"{id_name}_coin{i}.json", model_json, 0, "", ""])

    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\coin_add\\{id_file}.js"
    material_add = f"    global.scripts.add_coin(event, '{id_name}', '{get_display_name('coin', display_name)}')\n"
    path_script_file_extra = path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\coin_add\\{id_file}_register_item_property.js"
    material_add_extra = f"    global.scripts.register_item_property('unification:{id_name}_coin')\n"
    path_main_model = path_.removesuffix(file_loc + '\\') + f"kubejs\\assets\\unification\\models\\item\\{id_name}_coin.json"
    main_model = (f'{{"parent": "item/generated", '
                  f'"textures": {{"layer0": "{texture_path + "0"}"}}, '
                  f'"overrides": ['
                  f'{{"predicate": {{"count": 0.00000}}, "model": "{texture_path + "0"}"}}, '
                  f'{{"predicate": {{"count": 0.03125}}, "model": "{texture_path + "1"}"}}, '
                  f'{{"predicate": {{"count": 0.25000}}, "model": "{texture_path + "2"}"}}, '
                  f'{{"predicate": {{"count": 0.50000}}, "model": "{texture_path + "3"}"}}, '
                  f'{{"predicate": {{"count": 1.00000}}, "model": "{texture_path + "4"}"}}'
                  f']'
                  f'}}')

    if texture_exists == 5: 
        return [
            [path_script_file, id_file + ".js", material_add, 100, license_notice + "onEvent('item.registry', event => {\n", "})"], 
            [path_script_file_extra, id_file + "_register_item_property.js", material_add_extra, 100, license_notice + "onEvent('postinit', event => {\n", "})"],
            [path_main_model, f"{id_name}_coin.json", main_model, 0, "", ""]
        ] + model_files
    else: 
        return ""
    
def add_block(id_name, type_material, id_file, display_name, license_notice):
    
    texture_path = f"unification:{id_file}/{id_name}/block/{id_name}_{type_material}"

    type_material_extra = "metal"
    if type_material == "raw_block":
        type_material_extra = "stone"

    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\block_add\\{id_file}.js"
    texture_exists = replace_texture(id_name, type_material, texture_path, id_file, True, True)
    material_add = f"    global.scripts.add_block(event, '{id_name}', '{type_material}', '{texture_path}', '{type_material_extra}', '{get_display_name(type_material, display_name)}')\n"

    if texture_exists == 1: 
        return [[path_script_file, id_file + ".js", material_add, 100, license_notice + "onEvent('block.registry', event => {\n", "})"]]
    else: 
        return ""
    

def add_molten(id_name, type_material, id_file, display_name, color, license_notice):
    if color == "":
        color = "0xffffff"

    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\molten_add\\{id_file}.js"
    material_add = f"    global.scripts.add_fluid(event, '{id_name}', {color}, '{get_display_name(type_material, display_name)}')\n"

    return [[path_script_file, id_file + ".js", material_add, 100, license_notice + "onEvent('fluid.registry', event => {\n", "})"]]


def add_slurry(id_name, type_material, id_file, display_name, color, license_notice):
    if color == "":
        color = "0xffffff"

    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\startup_scripts\\ore_unification\\slurry_add\\{id_file}.js"
    material_add = f"SLURRY.register('{id_name}_{type_material}', builder => builder.color({color}))\n"
    event_write =  ("let $EventBuses = java('me.shedaniel.architectury.platform.forge.EventBuses')\n"
                    "let $SlurryDeferredRegister = java('mekanism.common.registration.impl.SlurryDeferredRegister')\n"
                    "let SLURRY = new $SlurryDeferredRegister('unification')\n")
    ending_string = "SLURRY['register(net.minecraftforge.eventbus.api.IEventBus)']($EventBuses.getModEventBus('kubejs').get())"

    path_script_file_extra = path_.removesuffix(file_loc + '\\') + f"resources\\unification\\lang\\en_us.json"
    material_add_extra  = (f'    "slurry.unification.dirty_{id_name}_{type_material}": "{get_display_name("dirty_" + type_material, display_name)}",\n'
                            f'    "slurry.unification.clean_{id_name}_{type_material}": "{get_display_name("clean_" + type_material, display_name)}",\n')

    return [
        [path_script_file, id_file + ".js", material_add, 100, license_notice + event_write, ending_string], 
        [path_script_file_extra, "en_us.json", material_add_extra, 0, "{\n", '    "": ""\n}']
    ]


def add_tag(id_item, item_tag, is_block, id_file, license_notice):
    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\add_tags\\items\\{id_file}.js"
    event_write = "onEvent('item.tags', event => {\n"
    string_write = f"    event.add('{item_tag}', '{id_item}')\n"
    if is_block:
        path_script_file_block = path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\add_tags\\blocks\\{id_file}.js"
        event_write_block = "onEvent('block.tags', event => {\n"
        return [
            [path_script_file, id_file + ".js", string_write, 90, license_notice + event_write, "})"],
            [path_script_file_block, id_file + ".js", string_write, 90, license_notice + event_write_block, "})"]
        ]
    else:
        return [[path_script_file, id_file + ".js", string_write, 90, license_notice + event_write, "})"]]


def jei_hide(id_item, id_file, license_notice):
    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\client_scripts\\ore_unification\\jei_hide\\{id_file}.js"
    event_write = "onEvent('jei.hide.items', event => {\n"
    string_write = f"    event.hide('{id_item}')\n"
    return [path_script_file, id_file + ".js", string_write, 50, license_notice + event_write, "})"]


def replace_output(id_output_old, id_output, id_file, license_notice):
    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\replace_output\\{id_file}.js"
    event_write = "onEvent('recipes', event => {\n"
    string_write = f"    event.replaceOutput({{}}, '{id_output_old}', '{id_output}')\n"
    return [path_script_file, id_file + ".js", string_write, 100, license_notice + event_write, "})"]


def replace_input(id_input_old, id_input, id_file, license_notice):
    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\replace_input\\{id_file}.js"
    event_write = "onEvent('recipes', event => {\n"
    string_write = f"    event.replaceInput({{}}, '{id_input_old}', '{id_input}')\n"
    return [path_script_file, id_file + ".js", string_write, 100, license_notice + event_write, "})"]


def remove_tag(id_item, id_file, license_notice):
    path_script_file = path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\remove_tags\\items\\{id_file}.js"
    path_script_file_block = path_.removesuffix(file_loc + '\\') + f"kubejs\\server_scripts\\ore_unification\\remove_tags\\blocks\\{id_file}.js"
    event_write = "onEvent('item.tags', event => {\n"
    event_write_block = "onEvent('block.tags', event => {\n"
    string_write = f"    event.removeAllTagsFrom('{id_item}')\n"

    return [
        [path_script_file, id_file + ".js", string_write, 60, license_notice + event_write, "})"],
        [path_script_file_block, id_file + ".js", string_write, 60, license_notice + event_write_block, "})"] 
    ]


def write_to_files(data_array):
    # data_array = array of ["path_file", "file_name", "string write", "prio", "starting_string", "ending_string"]
    # name: ["priority?", "starting_string", "rest_of_text_in_multiple_strings", "ending_string"]
    data_sorted = {}
    all_file_paths = []

    for element in data_array:
        if element[0] not in all_file_paths:
            all_file_paths.append(element[0])
            if element[3] == 0:
                data_sorted[element[0]] = [element[4], element[2], element[5]]
            else:
                data_sorted[element[0]] = [f"// priority: {element[3]}\n\n", element[4], element[2], element[5]]
                
            if not os.path.isdir(element[0].removesuffix(f"\\{element[1]}")):
                os.makedirs(element[0].removesuffix(f"\\{element[1]}"))

        else:
            data_sorted[element[0]].insert(len(data_sorted[element[0]]) - 1, element[2])
    
    for file_path in all_file_paths:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("".join(data_sorted[file_path]))

read_info()

shutil.copytree(f"{path_}textures\\general\\copy", path_.removesuffix(file_loc + '\\') + f"kubejs\\assets\\unification\\textures", copy_function=shutil.copyfile, dirs_exist_ok=True)

logging("info", (f"Changed {material_added} materials. Replaced {texture_replaced} textures. "
                 f"Added {type_added} items/blocks. Removed {element_removed} items/blocks"))
logging("info", "Program finished!")
