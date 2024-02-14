#!/bin/bash
$1
npm run build:$1 --aot
#For Ubunutu
sudo zip -r MeshBuildForDeployment.zip Procfile dist/


#For window
# "C:\Program Files\7-Zip\7z.exe" a -tzip PMSBuildForDeployment.zip Procfile dist/ .ebextensions/ .platform/