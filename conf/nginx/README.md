NGINX
===========

# nginx-testing.conf
- DEV use only
- This server block is used to listen for incoming connections on port 80
- Server block contains following important directives:
    * **access_log/error_log** 
        - full path to the files where access or error logs are stored
    * **charset** 
        - adds the specified charset to the “Content-Type” response header field
    * **autoindex** 
        - enables (on) or disables (off) the directory listing output
    * **try_files**
        - checks the existence of files in the specified order and uses the first found file for request processing
        - the processing is performed in the current context 
        - we use _try_files_ to load both Angular applications (ADMIN UI and YANG CATALOG UI)
        ```
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html =404;
            ...
        }
        ```
        ```
        location /admin/ {
            alias /usr/share/nginx/html/admin/;
            try_files $uri $uri/ /index.html =404;
        }
        ```

# yangcatalog-nginx-ssl.conf
- PROD use only
- This server block is used to listen for incoming connections on port 443
- Server block contains the same directives as DEV, but has the following in addition:
    * **ssl_certificate** 
        - full path to the file with the certificate in the PEM format used for authentication
    * **ssl_certificate_key** 
        - full path to the file with the secret key in the PEM format for the given virtual server
    * **ssl_session_cache** 
        - sets the types and sizes of caches that store session parameters
        - _shared:le_nginx_SSL:1m;_ means that **shared** cache with name **le_nginx_SSL** and size **1m** is used between all worker processes
    * **ssl_session_timeout**
        - specifies a time during which a client may reuse the session parameters
        - _1440m_ means 1440 minutes = 24 hours
    * **ssl_protocols**
        - space separated list of enabled specified protocols
    * **ssl_prefer_server_ciphers**
        - specifies that server ciphers should be preferred over client ciphers when using the SSLv3 and TLS protocols
    * **ssl_ciphers**
        - specifies the enabled ciphers - these are specified in the format understood by the OpenSSL library

# yangcatalog-nginx.conf
- PROD use only
- This server block is used to listen for incoming connections on port 80
- If _HTTP_ protocol is used, it redirects the traffic to the _HTTPS_ version of the site
```
if ($host = yangcatalog.org) {
    return 301 https://$host$request_uri ;
}
```