#!/usr/bin/env python3

import tempfile
from io import BytesIO as StringIO
from PIL import Image, ImageChops, ImageEnhance
import pyexiv2


def image2str(img):
    """Converts PIL Image object to binary data.
    @param img: PIL Image object
    @return:  binary data
    """
    f = StringIO()
    img.save(f, "JPEG")
    return f.getvalue()


def str2temp_file(text_data, delete=True):
    tmp = tempfile.NamedTemporaryFile(prefix="pictest-", delete=delete)
    tmp.write(text_data)
    return tmp


def str2image(data):
    output = StringIO()
    output.write(data)
    output.seek(0)
    return Image.open(output)


def ela(image):
    # Create temporary file.
    handle, resaved = tempfile.mkstemp()
    # Open file and resave it.
    im = Image.open(image)
    im.save(resaved, "JPEG", quality=95)
    resaved_im = Image.open(resaved)
    # Trick to convert images like PNG to a format comparable with JPEG.
    if im.mode != "RGB":
        im = im.convert("RGB")
    # create ELA image
    ela_im = ImageChops.difference(im, resaved_im)
    # Calculate difference
    extrema = ela_im.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    if not max_diff:
        return image
    scale = 255.0 / max_diff
    ela_im = ImageEnhance.Brightness(ela_im).enhance(scale)
    diff = max([ex[1] for ex in extrema])
    # return im
    # Save image.
    img = image2str(ela_im)
    # image.AutoVivification(["ela"]["ela_image"]) = save_file(img, content_type="image/jpeg")
    return img, diff


def gexiv(data):
    metadata = pyexiv2.ImageMetadata(data)
    metadata.read()
    exif_list = metadata.exif_keys
    List = ['Exif.Image.Software', 'Exif.Image.Model',
            'Exif.Photo.DateTimeOriginal', 'Exif.Image.DateTime']
    d = {}
    for l in List:
        if l in exif_list:
            d[l] = metadata[l].value
        else:
            d[l] = None
    return d['Exif.Image.Model'], d['Exif.Photo.DateTimeOriginal'], d['Exif.Image.DateTime'], d['Exif.Image.Software']


def judge(data):
    (im, diff) = ela(data)
    tag = (crame, time_crate, time_edit, soft) = gexiv(data)
    if soft :
        return False, soft
    elif diff < 20 :
        return True
    else:
        return False
