FROM ubuntu:14.04
LABEL maintainer="Alexander Y Lyapko z@sunsay.ru"

ENV LANG=C.UTF-8
RUN locale-gen en_US.UTF-8
RUN update-locale LANG=en_US.UTF-8

# Install dependses
RUN apt-get -qq update && \
    apt-get install -y git wget apache2 libapache2-mod-php5 php5 php5-gd curl php5-curl php5-pgsql php5-xmlrpc php5-odbc memcached sendmail gettext dnsutils && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY . /opt/maprox/web.observer/

WORKDIR /opt/maprox/web.observer/

# Remove config.local.* files to prevent sensitive data in production image
RUN rm -f kernel/config.local.*.php

RUN wget https://getcomposer.org/installer && \
    php installer && \
    php composer.phar install && \
    chmod +x start.sh && \
    a2enmod remoteip && \
    a2enmod expires && \
    a2enmod headers && \
    a2enmod rewrite && \
    update-rc.d -f apache2 remove

CMD ["./start.sh"]

EXPOSE 8080
