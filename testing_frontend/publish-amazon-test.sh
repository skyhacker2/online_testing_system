#!/bin/sh
cerPath="../amazon_cer/test.cer"
serverLogin="ec2-user@54.250.147.219"
serverBasePath="/home/ec2-user/manggis_frontend/manggis_web/static"
clientBasePath="../manggis_web/src/main/webapp/static"

if [ -d "${clientBasePath}/$1" ]; then
	ssh -i ${cerPath} ${serverLogin} "mkdir -p ${serverBasePath}/$1"
	scp -i ${cerPath} -r ${clientBasePath}/$1/* ${serverLogin}:${serverBasePath}/$1
elif [ -f "${clientBasePath}/$1" ]; then
	scp -i ${cerPath} -r ${clientBasePath}/$1 ${serverLogin}:${serverBasePath}/$1
else
	echo "No such file or directory!"
fi