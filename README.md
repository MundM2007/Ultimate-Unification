All of these code snippets require the python package [Pillow](https://pypi.org/project/pillow/) to be installed. 

# Texture Tinting

This directory contains two scripts: one that extracts all colors from a given image (except ones that are gui colors). This script takes all images from the `input_extract_colors` folder and gets the colors and orders them after brightness.

The second script (main.py) takes up to 10 colors (in order of descending brightness) and a name of the material. These are specified in the colors array. With this, it generates all image files for the given material. If you also wish to generate `bolt`, `curved_plate`, `ring` and `coin` make sure to uncomment the comment stating these. 
This way is the way most Ultimate Unification textures have been made. The results will be pasted inside the `result` directory that will be created. 

To overwrite a file you need to input `yes` or `y`. You'll know what I'm talking about if you get it. Also note that sometimes not every color is required. Which colors are required for what can be seen in the first comment. 

# Texture Extracting

This can be used to extract textures from EEv2 to actual png files. For this download this resource pack and load it: https://modrinth.com/resourcepack/inventory-flat-pack. After that you would need to generate a material with Emendatus Enigmatica. 
By arranging the items in the following way you can then take a screenshot and the code will do the rest:

items         | /             | /             | /             | /             | /             | /             | /             | /
------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | -------------
storage block | ingot         | nugget        | dust          | plate         | rod           | gear          | gem           | gravel
raw block     | raw material  | crystal       | shard         | clump         | dirty dust    | crushed ore   | fragment      | /

The image should be taken from the upper left pixel of the slot to the lower right of the last empty slot (9 rows, 2 columns). It should be taken with GUI size 2. 
You then have to paste the image in the directory the python file is in and name it `input.png`. The extracted textures will be printed in the console (so it shouldn't auto close when finished).
