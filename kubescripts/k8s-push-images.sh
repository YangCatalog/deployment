#!/bin/sh

for image in yc_redis yc_module-compilation yc_admin-ui yc_frontend yangvalidator yc_yangre yc_yangcatalog-ui catalog_backend_api yc_confd yc_documentation; do
  echo $image
  docker tag $image:latest localhost:32000/$image:latest
  docker push localhost:32000/$image:latest
done
