---
title: 'Magick Dithering APIs - Part 2'
pubDate: 2025-09-24
description: 'Publishing a simple dithering service using FastAPIs and Google Cloud.'
author: 'Antonio'
image:
    url: 'https://storage.googleapis.com/public-antonio/blog-imgs/paris-final.jpg'
    alt: 'Paris, Texas dithered image'
tags: ["dithering", "art", "devops"]
---

In [part 1](https://antoniotir.one/posts/dithering-apis-1) I goofed around with some image processing until I achieved a reasonable result. 

I would like to note that as much as the example is rather simple, actually finding an interesting service to deploy is rather challenging. Having ideas that are meaningful and possible to realise is often hard.

What I will go through in this post: adjusting a FastAPI snippet to my needs, containerize, deploy on Google Cloud.

.. 

Go!

## FastAPI

As I am really lazy, I searched the web for some already made code snippets. I ended up finding this [quick tutorial](https://betterstack.com/community/guides/scaling-python/uploading-files-using-fastapi/), that helped me setting up the basic server.

It boils down to validating the file type and size, handling unexpected errors and saving the file on the local storage. 

Now, since I am going to deploy this on a Cloud Run instance, I do not want to save images on local disk. Tinkering with volumes could provide some persistent storage, but this being for personal use, I can live with serving the results through a public bucket. 

This poses some privacy problems if users grow in number, but for a PoC I think fares well. And allows me easy access to all processed images. 

My final endpoint flow is: 
1. validate the received image
2. dither it
3. upload on a bucket
4. return image url to requester

```python
@app.post('/dither')
async def upload_single_file(file: UploadFile = File(...)):
    validation = await img_validator.validate_file(file)

    # validate
    if not validation['valid']:
        raise HTTPException(...)
    
    # dither
    try:
        blob = await file.read()
        dithered_blob = await dither_blob(blob)
    except Exception as e:
        raise HTTPException(...)

    # upload
    try:
        processed_url = upload_blob_from_string(dithered_blob, file.filename)
    except Exception as e:
        raise HTTPException(...)

    # success
    return {
        'success': True,
        'original_filename': file.filename,
        'processed_url': processed_url,
        'upload_time': datetime.now(timezone.utc).isoformat(),
    }
```

Some code omitted (check it on [github](https://github.com/mokuhasushi/dithering-apis)).

The `dither_blob(f)` function calls the imagemagick function discussed in the previous post. `upload_blob_from_string(...)` contains the simple logic to connect and upload to a google cloud bucket. 

If you know a bit about FastAPI you must be thinking: why not dependency injection. And I have no excuses, but for this first version I did not want to overcomplicate things.

To test locally I used a `save_to_file()` function instead of uploading, since working inside a container (coming next). Running the server locally allows to use GCD credentials, but some extra steps are needed to connect from inside a dockerized app (I wanted to avoid issuing API keys as of now). 

## Dockerize

I love containers. 

Especially so for the cleanup. Tomorrow I will be done with this project, and by just deleting unused images my HD will be freed of most artifacts. Cumulating project in local storage grows fast to take a toll on the system efficiency. 

And deployments get so easy! 

```docker
FROM python:3.9.23-alpine

WORKDIR /app

RUN apk --update add imagemagick-dev py-pip

ENV MAGICK_HOME=/usr

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt 

COPY . . 

ENV PORT=8080

CMD uvicorn  --app-dir apis main:app --host 0.0.0.0 --port $PORT
```

The important takeaways from this simple Dockerfile lie in the 2 defined `ENV` variables. 

Imagemagick was not behaving, due to alpine lightweight system if I understood correctly, thus the need to define the `MAGICK_HOME` directory. 

In order for the service to run on Cloud Run, the `PORT` needs to be passed as an environment variable. Took me a couple of _pomidoros_ to figure out (not like it was the only problem...).

## Deploy

In the repository, you can find a terraform attempt to deploy on google cloud. It was a partially successful attempt, but some rework needs to be done, and I ended up tweaking things manually. 

Lame. 

I will try to update it in the near future (yes, _*retroposting*_). 

Aside from that, once the GC client is set up and a [repository created](https://cloud.google.com/artifact-registry/docs/docker/store-docker-container-images) on your cloud profile, tag and push your image. 

You can then select your image as container for the run service, and if ports are correctly configured and authorization granted (don't forget to make your bucket public and set the `GC_BUCKET` env variable on run service!) you should be able to access the apis. 

And the `/docs` endpoint in FastAPIs is so convenient. 

## From here

I had a locally working version using redis and celery to process asynchronously the dithering, but given the current scope I opted for a single Run deployment, instead of messing with a K8s orchestration. This might be a next development, along with expanding endpoints to allow multiple processing options. 

Enjoy dithering!

The code for the finished project can be found on [github](https://github.com/mokuhasushi/dithering-apis). 