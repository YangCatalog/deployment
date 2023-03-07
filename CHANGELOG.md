## Deployment Release Notes

* ##### v5.10.0 - 2023-03-07

  * xym tool update to version 0.6.2 [#183](https://github.com/YangCatalog/deployment/issues/183)
  * 2 new values added to the config files
  * Content of 2 new directories exposed and accessible by API now

* ##### v5.9.0 - 2023-01-26

  * Load ConfD hashed password from env file [#179](https://github.com/YangCatalog/deployment/issues/179)
  * YumaPro validator updated to version 21.10-12 [#178](https://github.com/YangCatalog/deployment/issues/178)

* ##### v5.8.0 - 2022-12-20

  * ConfD update to version 8.0 [#174](https://github.com/YangCatalog/deployment/issues/174)

* ##### v5.7.0 - 2022-11-11
  
  * sdo_analysis repository renamed to module-compilation [#154](https://github.com/YangCatalog/deployment/issues/154)
  * xym tool update to version 0.6.2
  * yanglint update to version v2.1.4 [#169](https://github.com/YangCatalog/deployment/issues/169)
  * DOCUMENTATION file reworked into the README.md for setup directory [#167](https://github.com/YangCatalog/deployment/issues/167)
  * STYLEGUIDE.md file created [#163](https://github.com/YangCatalog/deployment/issues/163)

* ##### v5.6.1 - 2022-10-10

  * xym tool update to version 0.6.1 [#161](https://github.com/YangCatalog/deployment/issues/161)

* ##### v5.6.0 - 2022-09-30

  * Frontend related repositories merged into one new repository [#154](https://github.com/YangCatalog/deployment/issues/154)
  * Overview section added to README.md file [#156](https://github.com/YangCatalog/deployment/issues/156)

* ##### v5.5.0 - 2022-08-16

   * ConfD update to version 7.8 [#149](https://github.com/YangCatalog/deployment/issues/149)
   * yanglint update to version v2.0.231 [#146](https://github.com/YangCatalog/deployment/issues/146)
   * Changes in Matomo configuration [#133](https://github.com/YangCatalog/deployment/issues/133)
   * New environment setup script created [#143](https://github.com/YangCatalog/deployment/issues/143)

* ##### v5.4.0 - 2022-07-08

  * Multiple updates to the config files [#141](https://github.com/YangCatalog/deployment/issues/141)
  * Reporting problematic IETF drafts [#139](https://github.com/YangCatalog/deployment/issues/139)
  * Default crontab mail-to address changed

* ##### v5.3.0 - 2022-06-06

  * yangcatalog.conf.sample file added [#135](https://github.com/YangCatalog/deployment/issues/135)
  * Setup Matomo for local development [#133](https://github.com/YangCatalog/deployment/issues/133)
  * Setup Kibana for local development [#130](https://github.com/YangCatalog/deployment/issues/130)
  * thesaurus.conf file updated [#129](https://github.com/YangCatalog/deployment/issues/129)
  * yanglint update to version v2.0.194 [#127](https://github.com/YangCatalog/deployment/issues/127)

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
