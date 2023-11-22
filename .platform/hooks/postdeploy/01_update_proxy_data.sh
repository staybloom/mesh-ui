#!/bin/bash
API_URL=$(/opt/elasticbeanstalk/bin/get-config environment -k API_URL)
SOCKET_URL=$(/opt/elasticbeanstalk/bin/get-config environment -k SOCKET_URL)
cat <<EOF >/etc/httpd/conf.d/pmsproxya.conf
<VirtualHost *:80>
  <Proxy *>
  Require all granted
</Proxy>
      
ProxyPass /app ${API_URL} retry=0 disablereuse=On
ProxyPassReverse /app ${API_URL}
ProxyPass /login ${SOCKET_URL} retry=0 disablereuse=On
ProxyPassReverse /login ${SOCKET_URL}
      
ProxyPass / http://localhost:8080/ retry=0
ProxyPassReverse / http://localhost:8080/
ProxyPreserveHost on
      
LogFormat "%h (%{X-Forwarded-For}i) %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\""
</VirtualHost>
EOF
sudo systemctl restart httpd


