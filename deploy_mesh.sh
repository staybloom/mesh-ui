#!/bin/bash

npm run build --aot
#For Ubunutu
sudo zip -r MeshBuildForDeployment.zip Procfile dist/ .ebextensions/ .platform/


#For window
# "C:\Program Files\7-Zip\7z.exe" a -tzip PMSBuildForDeployment.zip Procfile dist/ .ebextensions/ .platform/