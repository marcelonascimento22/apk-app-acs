#!/bin/bash

echo "Limpando projeto..."
rm -rf node_modules dist android

echo "Instalando dependencias..."
npm install

echo "Buildando..."
npm run build

echo "Criando Android..."
npx cap add android

echo "Sincronizando..."
npx cap sync

echo "Abrindo Android Studio..."
npx cap open android