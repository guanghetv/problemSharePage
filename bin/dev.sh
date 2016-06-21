if [ ! -d "dist" ]; then
  mkdir dist
fi
NODE_ENV=dev node createPages.js
cp -r img dist/
cp -r js dist/
