curl -v -H "Content-Type: application/vnd.yang.data+json" \
     -T ${FILE:-"all.json"} \
     -u ${USERNAME:-"admin"}:${PASSWORD-"admin"} \
     -X PATCH http://localhost:8008/api/running/organizations
