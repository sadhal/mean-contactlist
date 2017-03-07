#/bin/bash!

docker build -t sadhal/mean-contactlist .

docker tag sadhal/mean-contactlist:latest 172.30.1.1:5000/contacts-be-dev/mean-contactlist

docker push 172.30.1.1:5000/contacts-be-dev/mean-contactlist