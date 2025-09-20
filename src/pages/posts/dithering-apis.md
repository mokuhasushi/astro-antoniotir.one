---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Magick Dithering APIs'
pubDate: 2025-09-18
description: 'Publishing a simple dithering service using FastAPIs and Google Cloud.'
author: 'Antonio'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'Paris, Texas dithered image'
tags: ["dithering", "art", "devops"]
---

I _love_ dithering. 

The aestethics always appalled to me, but it is while playing [The Return Of The Obra Dinn] that I got completely fascinated by it. 
As the end of summer approached, and I found myself with some spare time (unemployment!), I decided to develop and deploy a simple dithering service using FastAPIs and imagemagick. Let's dig in!

## Magic Wand

First of all, I had to decide on how to dither my images. 
As much as I would have loved to personally implement a (theory)[dithering algorithm], my main focus was on developing the APIs and getting them on the web. This might be a topic for a future improvement ;)

Some (https://stackoverflow.com/questions/34729404/floyd-steinberg-dithering-in-graphicsmagic-or-imagemagic)[quick researches] pointed in the direction of imagemagick. The official documentation provides a wide set of options to work with, but for my first version I will stick with a FloydSteinberg dithering after having boxed the image. Why? Because I like pixelated aesthetics     

## APIs

## Deployment


That was fun! I met a wall while deploying on Google cloud, but once I decided to _ I could overcome it and felt rather proud. 
Hope you enjoyed this and have fun dithering!