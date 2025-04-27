import os
from PIL import Image

path_ = __file__.replace("extract_colors.py", "")
banned_pixels = [(139, 139, 139, 255), (255, 255, 255, 255), (55, 55, 55, 255), (198, 198, 198, 255)]

pixels_saturation = []
pixels = []
firstfile = ""
for file in os.listdir(path_ + "input_extract_colors\\"):
    globals()["firstfile"] = file
    image = Image.open(path_ + "input_extract_colors\\" + file).convert("RGBA")
    image_data = image.getdata()
    for pixel in image_data:
        if pixel in banned_pixels:
            continue
        red = "%X" % pixel[0]
        green = "%X" % pixel[1]
        blue = "%X" % pixel[2]
        for color in ["red", "green", "blue"]:
            if len(globals()[color]) == 1:
                globals()[color] = "0" + globals()[color]
        pixel_format = red + green + blue

        pixel_saturation_insert = pixel[0] + pixel[1] + pixel[2]
        closest_pixel_saturation = 0
        for pixel_saturation in pixels_saturation:
            if pixel_saturation_insert >= pixel_saturation >= closest_pixel_saturation:
                closest_pixel_saturation = pixel_saturation
        if closest_pixel_saturation != 0:
            pixel_saturation_index = pixels_saturation.index(closest_pixel_saturation)
        else:
            pixel_saturation_index = len(pixels_saturation)

        if pixel_format not in pixels and pixel[3] == 255:
            pixels_saturation.insert(pixel_saturation_index, pixel_saturation_insert)
            pixels.insert(pixel_saturation_index, pixel_format)
    os.remove(path_ + "input_extract_colors\\" + file)

pixels.insert(0, firstfile.removesuffix("_ingot.png").removesuffix("_plate.png"))
pixels.insert(5, "000000")
print(pixels)
