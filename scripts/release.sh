#!/bin/bash
yarn build
VERSION=$(cat package.json | jq -r .version)
cd target
mkdir -p ../release
tar -czvf ../release/chatterbox-v$VERSION.tar.gz *
