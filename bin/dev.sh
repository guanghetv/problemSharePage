if [ ! -d "dev" ]; then
  mkdir dev
fi
NODE_ENV=dev node createPages.js
cp -r tmp/*  dev
