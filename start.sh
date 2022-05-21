#!/bin/bash

export LOCAL_IP=`hostname -i`
export NODEJS_IP=`dig +short node-observer`
export CRON_IP=`dig +short cron-service`

# envsubst < ./kernel/config.local.template > kernel/config.local.php
envsubst '$${HOST_NAME}' < ./conf/observer.template > /etc/apache2/sites-available/observer.conf
cp -f ./conf/site.template /etc/apache2/sites-available/site.conf

case $SRV_RUN in
  WWW )
    a2ensite observer
    a2ensite site
    apache2ctl -D FOREGROUND
    ;;
  JOB )
    php ./jobs/starter.php $JOB_START dummy
    touch ./logs/empty.log
    tail -f ./logs/*.log
    ;;
esac
