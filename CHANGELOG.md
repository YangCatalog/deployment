## Deployment Release Notes

* ##### vm.m.p - 2022-MM-DD

* ##### v5.3.0 - 2022-06-06

  * yangcatalog.conf.sample file added [deployment #135](https://github.com/YangCatalog/deployment/issues/135)
  * Setup Matomo for local development [deployment #133](https://github.com/YangCatalog/deployment/issues/133)
  * Setup Kibana for local development [deployment #130](https://github.com/YangCatalog/deployment/issues/130)
  * thesaurus.conf file updated [deployment #129](https://github.com/YangCatalog/deployment/issues/129)
  * yanglint update to version v2.0.194 [deployment #127](https://github.com/YangCatalog/deployment/issues/127)

* ##### v5.2.0 - 2022-05-03

  * Type checking fixes with pyright [#126](https://github.com/YangCatalog/deployment/issues/126)
  * Pyang update to version 2.5.3 [#124](https://github.com/YangCatalog/deployment/issues/124)
  * Official Slate image used for building documentation [#123](https://github.com/YangCatalog/deployment/issues/123)
  * Elasticsearch updated to version 7.10 [#120](https://github.com/YangCatalog/deployment/issues/120)
  * K8s garbage collection settings changed [#118](https://github.com/YangCatalog/deployment/issues/118)
  * Pushing more resources using HTTP/2 Push [#114](https://github.com/YangCatalog/deployment/issues/114)

* ##### v5.1.0 - 2022-03-28

  * README.md file describing NGINX config created [#117](https://github.com/YangCatalog/deployment/issues/117)
  * HTTP/2 PUSH functionality enabled [#114](https://github.com/YangCatalog/deployment/issues/114)

* ##### v5.0.0 - 2022-02-02

  * Pyang update to version 2.5.2 [#113](https://github.com/YangCatalog/deployment/issues/113)
  * Dockerfiles added to .dockerignore file
  * Docker healthchecks added for yangvalidator and yangre

* ##### v4.3.0 - 2021-12-03

  * Network between sdo-analysis and redis containers created [#110](https://github.com/YangCatalog/deployment/issues/110)
  * Use volume for Redis .rdb backup file [#109](https://github.com/YangCatalog/deployment/issues/109)
  * MariaDB completly removed from YANG Catalog [#108](https://github.com/YangCatalog/deployment/issues/108)
  * Various K8s/Docker updates and improvements in config files
  * Various healthcheck updates through solution [#107](https://github.com/YangCatalog/deployment/issues/107)

* ##### v4.2.1 - 2021-10-06

  * K8s: Redis template updated to use volume [#106](https://github.com/YangCatalog/deployment/issues/106)
  * NGINX: Redirect yangvalidator.com directly to yangvalidator page [#104](https://github.com/YangCatalog/deployment/issues/104)
  * K8s: template for documentation image added [#101](https://github.com/YangCatalog/deployment/issues/101)
  * ConfD update to version 7.6 [#99](https://github.com/YangCatalog/deployment/issues/99)
  * doc repository removed [#98](https://github.com/YangCatalog/deployment/issues/98)

* ##### v4.2.0 - 2021-09-09

  * rsync enabled in k8s for backend and api-receiver [#97](https://github.com/YangCatalog/deployment/issues/97)
  * Pass YANGCATALOG_CONFIG_PATH to containers from .env file [#96](https://github.com/YangCatalog/deployment/issues/96)

* ##### v4.1.0 - 2021-08-10

  * Bump mariaDB version to 1:10.5.12 [#91](https://github.com/YangCatalog/deployment/issues/91)
  * NGINX conf files updated to support old URLs with .php [#87](https://github.com/YangCatalog/deployment/issues/87)

* ##### v4.0.0 - 2021-07-09

  * yangcatalog-ui repository added as submodule of this repository
  * YANG Search submodule discontinued - API moved under backend
  * Pyang update to version 2.5.0 [#85](https://github.com/YangCatalog/deployment/issues/85)
  * YumaPro validator updated to version 20.10-9 [#84](https://github.com/YangCatalog/deployment/issues/84)
  * Bump mariaDB version to 1:10.5.11
  * K8s conf files updated according to the new YANG Catalog UI
  * NGINX conf files updated according to the new YANG Catalog UI
  * .dockerignore file added
  * yang2.amsl.com mailname replaced by yangcatalog.org [#73](https://github.com/YangCatalog/deployment/issues/73)

* ##### v3.2.1 - 2021-05-04

  * Crontab MAILTO variable set during Docker image build [#72](https://github.com/YangCatalog/deployment/issues/72)

* ##### v3.2.0 - 2021-04-15

  * Python base image bumped to version 3.9 in all affected modules [#66](https://github.com/YangCatalog/deployment/issues/66)
  * YumaPro validator updated to version 20.10-6 [#53](https://github.com/YangCatalog/deployment/issues/53)

* ##### 3.1.0 - 2021-03-18

  * Running Yangcatalog project using Kubernetes [#52](https://github.com/YangCatalog/deployment/issues/52)
  * xym tool update to version 0.5 deployment [#50](https://github.com/YangCatalog/deployment/issues/50)

* ##### v3.0.1 - 2021-02-26

  * Bump mariaDB version to 1:10.5.9
  * rsyslog and systemd added to all Dockerfiles [#48](https://github.com/YangCatalog/deployment/issues/48)

* ##### v3.0.0 - 2021-02-10

  * ConfD update [#34](https://github.com/YangCatalog/deployment/issues/34)
  * Update pyang to version 2.4.0 [deployment #36]( https://github.com/YangCatalog/deployment/issues/36)
  * Bump mariaDB version
  * DOCUMENTATION guide updated
  * Add redis data to yangcatalog sample file
  * Add resdis service variable for docker-compose
  * Remove elasticsearch as a service (Elasticsearch is still used but from AWS!!!)
  * Update YumaPro version
  * Update docker-compose file
  * Various major/minor bug fixes and improvements

* ##### v2.0.0 - 2020-08-14

  * Add health check endpoint to nginx
  * Completely refactor and update yangcatalog config sample file
  * Update docker-compose file
  * Various major/minor bug fixes and improvements

* ##### v1.1.0 - 2020-07-16

  * Update docker-compose file
  * Add nginx conf files to shared volume
  * DOCUMENTATION guide updated
  * Pyang updated
  * Update nginx files
  * Add uwsgi timeout 5 mins for yangvalidator
  * Various major/minor bug fixes and improvements

* ##### v1.0.1 - 2020-07-03

  * Update docker-compose file
  * Add admin_ui submodule
  * Update yangcatalog config file
  * Various major/minor bug fixes and improvements

* ##### v1.0.0 - 2020-06-23

  * Initial submitted version
