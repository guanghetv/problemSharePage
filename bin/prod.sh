if [ ! -d "dist" ]; then
  mkdir dist
fi
NODE_ENV=prod node createPages.js
cp -r tmp/*  dist
