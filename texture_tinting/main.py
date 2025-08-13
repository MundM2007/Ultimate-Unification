import os
from PIL import Image
import sys

# the 5th is only for dirty dust and gem ore; the 4th for molten; 1, 3, 4, 6, 8 for metal ore; 2, 5, 7, 9 for gem ore
colors = ['bone', 'CBBDAB', '000000', 'BEAD96', 'A99275', '000000', '927E64', '000000', '73624D', '000000', '000000']
name = colors[0]
colors = colors[1:]

colors = [tuple(int(color[i:i + 2], 16) for i in (0, 2, 4)) + (255,) for color in colors]
colors_in_file = ["F475F4", "DC69DC", "9D55C2", "8E4DAF", "7A48AA", "6E4199", "4E3581", "462F73", "3A2E76", "2F255E"]
colors_in_file = [tuple(int(color[i:i + 2], 16) for i in (0, 2, 4)) + (255,) for color in colors_in_file]
path_ = __file__.replace("main.py", "")

if os.path.isdir(f"{path_}/result/{name}/block") or os.path.isdir(f"{path_}/result/{name}/item"):
    user_input = str(input(f"do you really want to overwrite {name}? if so type yes/y: ")).replace(" ", "")
    if user_input.lower() not in ["yes", "y"]:
        sys.exit()

if not os.path.isdir(f"{path_}/result/{name}/block"):
    os.makedirs(f"{path_}/result/{name}/block")
if not os.path.isdir(f"{path_}/result/{name}/item"):
    os.makedirs(f"{path_}/result/{name}/item")

files = ["clump", "crushed", "crystal", "dirty_dust", "dust", "fragment", "gear", "gem_0", "gravel", "ingot", "nugget",
         "plate", "raw", "raw_block", "rod", "shard", "storage_block", "storage_block_gem", "gem_1", "gem_2", "gem_3",
         "gem_4", "parts", "ore_1", "ore_2", "ore_3", "ore_4", "ore_5", "ore_6", "ore_7", "ore_8", "ore_9", "ore_10",
         "wire", "piece", "coin0", "coin1", "coin2", "coin3", "coin4"
         #, "bolt", "curved_plate", "ring", "rotor"
]
for file in files:
    imgI = Image.open(f"{path_}/base/{file}.png").convert("RGBA")
    imgI_data = imgI.getdata()
    imgO_data = []
    for pixel in imgI_data:
        if pixel[3] == 0 or pixel[3] == 38:
            imgO_data.append(pixel)
        else:
            index_of_color = colors_in_file.index(pixel)
            imgO_data.append(colors[index_of_color])

    imgI.putdata(imgO_data)
    if file in ["raw_block", "storage_block", "storage_block_gem", "ore_1", "ore_2", "ore_3", "ore_4", "ore_5", "ore_6",
                "ore_7", "ore_8", "ore_9", "ore_10"]:
        imgI.save(f"{path_}/result/{name}/block/{name}_{file}.png", "PNG")
    else:
        imgI.save(f"{path_}/result/{name}/item/{name}_{file}.png", "PNG")
