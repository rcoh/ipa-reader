#!/bin/bash
docker build -t app .
docker tag app gcr.io/$(gcloud config get-value project)/ipa-reader:$TAG
docker push gcr.io/$(gcloud config get-value project)/ipa-reader:$TAG


