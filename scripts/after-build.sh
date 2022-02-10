#!/bin/bash
echo "Running after-build tasks ..."
find target/assets/ -name "parent.*.js" -exec rm -vf {} \;
find target/assets/ -name "parent.*.css" -exec rm -vf {} \;
rm -vf target/index.html
rm -vf target/manifest.json
mv -v target/parent/assets/* target/assets/
rm -rfv target/parent
