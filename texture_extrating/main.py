import copy
import os
import sys
import PIL.Image
import math

if os.path.isfile(f"{__file__.replace('main.py', '')}\\input.png"):
    with PIL.Image.open("input.png") as img_i:
        img_i_data = img_i.getdata() # input
else:
    sys.exit()

wrong_pixel = []
for y in range(34):
    for x in range(8):
        wrong_pixel.extend([16 + 18 * x + 160 * y, 17 + 18 * x + 160 * y])

img_r_data_index = [] # result (without lines)
for pixel_index in range(int(len(img_i_data) / 4)):
    if pixel_index not in list(range(2_560, 2_880)) and pixel_index not in wrong_pixel:
        img_r_data_index.append(pixel_index)

img_r_data = [] # result (without lines)
for pixel_index in sorted(img_r_data_index):
    img_r_data.append(img_i_data[2 * pixel_index + 320 * math.floor(pixel_index / 160)])

name = "alfsteel"
types = ["storage_block", "ingot", "nugget", "dust", "plate", "rod", "gear", "gem", "gravel",
         "raw_block", "raw", "crystal", "shard", "clump", "dirty_dust", "crushed", "fragment"]

if not os.path.isdir(f"{__file__.replace('main.py', '')}\\result\\{name}"):
    os.makedirs(f"{__file__.replace('main.py', '')}\\result\\{name}")

for index, type in enumerate(types):
    globals()[f"{name}_{type}_data"] = []
    globals()[f"{name}_{type}_img"] = PIL.Image.new("RGB", (16, 16))

    for y in range(math.floor(index / 9) * 16, math.floor(index / 9) * 16 + 16):
        for x in range(index * 16, index * 16 + 16):
            globals()[f"{name}_{type}_data"].append(img_r_data[y * 144 - math.floor(index / 9) * 144 + x])

    globals()[f"{name}_{type}_img"].putdata(globals()[f"{name}_{type}_data"])

    if type not in ["storage_block", "raw_block"]:
        globals()[f"{name}_{type}_img"] = globals()[f"{name}_{type}_img"].convert("RGBA")
        globals()[f"{name}_{type}_data"] = list(globals()[f"{name}_{type}_img"].getdata())

        copied_data = copy.deepcopy(globals()[f"{name}_{type}_data"])
        for index, pixel in enumerate(copied_data):
            pixels_around = []
            for amount in [1, -1, 16, -16]:
                if 0 <= (index + amount) < 256:
                    pixels_around.append(copied_data[index + amount])

            if pixel == (139, 139, 139, 255) and ((139, 139, 139, 255) in pixels_around or (139, 139, 139, 0) in pixels_around):
                globals()[f"{name}_{type}_data"][index] = (pixel[0], pixel[1], pixel[2], 0)

        globals()[f"{name}_{type}_img"].putdata(globals()[f"{name}_{type}_data"])

    globals()[f"{name}_{type}_img"].save(f".\\result\\{name}\\{name}_{type}.png", "PNG")
