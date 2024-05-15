zip -r bin bin
xs update-buildpack docker_buildpack -p bin.zip
cd testbuildpack
xs push dockerapp
