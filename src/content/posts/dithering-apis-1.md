---
title: 'Magick Dithering APIs - Part 1'
pubDate: 2025-09-18
description: 'Publishing a simple dithering service using FastAPIs and Google Cloud.'
author: 'Antonio'
image:
    url: 'https://storage.googleapis.com/public-antonio/blog-imgs/paris-final.jpg'
    alt: 'Paris, Texas dithered image'
tags: ["dithering", "art", "devops"]
---

I _love_ dithering. 

The aestethics always appalled to me, but it is while playing [The Return Of The Obra Dinn](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn) that I got completely fascinated by it. 
As the end of summer approached, and I found myself with some spare time (unemployment!), I decided to develop and deploy a simple dithering service using FastAPIs and imagemagick. Let's dig in!

## Magic Wand

First of all, I had to decide on how to dither my images. 
As much as I would have loved to personally implement a dithering algorithm, my main focus was on developing the APIs and getting them on the web. This might be a topic for a future improvement ;)

Some [quick researches](https://stackoverflow.com/questions/34729404/floyd-steinberg-dithering-in-graphicsmagic-or-imagemagic) pointed in the direction of imagemagick. The official documentation provides a wide set of options to work with, but for my first version I will stick with a FloydSteinberg dithering after having boxed the image. Why? Because I like pixelated aesthetics

I first tinkered a little with accessing a dockerized version of imagemagick, but that would have implied a deployment strategy of either using docker in docker or setting up a k8s environment. 

So I resorted to the wand library. The only sample image that came to mind is a snapshot from Paris, Texas

![Original image](https://storage.googleapis.com/public-antonio/blog-imgs/paris-texas.jpg)

```python
    with Image(width=256, height=1, pseudo='pattern:gray50') as amap:
        i.remap(amap, method=wand.image.DITHER_METHODS[2])
```

This snippet is the core dithering method. It is rather interesting that this is actually a `remap` of the original image using another image as reference. In this case a gray scale, but this could also be another color. Yes, watch out for a future pink dithering!

The result turns out like this: 

![Normal dithered image](https://storage.googleapis.com/public-antonio/blog-imgs/paris-dithered.jpg)

Looking good! *BUT* why enjoying a good quality image, when you could have a blocky pixelated version? So much more _retro_ right?

Hence I experimented a bit with resizing. A scale factor of 10 provides good results, but here I tried to push the limits to ahve a really blocky effect.

```python
    scale_x, scale_y = img.size[0]//20, img.size[1]//20
    # scale down and then back to original size
    i.scale(scale_x, scale_y)
    i.scale(img.size[0], img.size[1]) 

```

![Pixelated image](https://storage.googleapis.com/public-antonio/blog-imgs/paris-blocky.jpg)

And applying dithering to this lead to the cover image of this post.

## Blobs FTW

_Spoiler: this section has some insight coming from future development._

It is interesting to take a look at the `Image` class of the wand package. To instantiate it, you can pass a `filepath`, a `file` or even a `blob`. 

While trying things out in my local environment I simply used _filenames_, and that would stay my choice if I were to write a script. But as we are going to receive an image through FastAPI, we can take advantage of the other options, namely the `blob`. 

```python
    f = await file.read()
    img_blob = await dither_blob(f)
```

Bytestrings are fun, and operating directly on the received file required some extra steps given the `async` nature of the transmission. `await`ing on the read file allows to pass around the string representation, and we can leverage on this and stay coherent during the bucket upload. But this has to wait for the next section ;) 


The code for the finished project can be found on [github](https://github.com/mokuhasushi/dithering-apis). 

Here is [part 2](https://antoniotir.one/posts/dithering-apis-2), where this is wrapped in a FastAPI service and deployed on Google Cloud