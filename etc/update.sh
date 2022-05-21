#!/bin/sh

cd ..

#### PARAMETERS ####
VERTXT='kernel/version.txt'

git pull
rm $VERTXT
git rev-parse --short HEAD > $VERTXT

DONOT_RESTART_MEMCACHED="0";

for p in $*;
do
  if [ $p = "-s" ]
  then
    DONOT_RESTART_MEMCACHED="1";
  fi;
done;

if [ $DONOT_RESTART_MEMCACHED != "1" ]
then
  sudo service memcached restart
fi;

sudo rm -f /tmp/zend_cache*