#!/bin/bash

# Unless there are changes in the code, you only need to run this once
docker build --no-cache -t verus-explorer-api .
# Run using the host network as the Verus deamon is running in the host
# docker run -d --network host --rm --name verus-explorer-api verus-explorer-api
docker run -dit --rm --name verus-explorer-api verus-explorer-api
#sudo docker run -dit -p 4444:6379 --rm --name verus-exp-caching docker.dragonflydb.io/dragonflydb/dragonfly