curl -X POST -H "Content-Type: application/json" 192.168.56.101/teach-yourself-rest/teachyourself/customer/ -d '{"name":"Bennett", "email":"blo@gm.co", "address":"4266 Tor Ave", "city":"EGU", "state":"OR", "zip":"97404", "country":"US", "contact":"me"}'
sleep 2
curl -X GET 192.168.56.101/teach-yourself-rest/teachyourself/customer/?email=blo@gm.co
sleep 2
curl -X PUT -H "Content-Type: application/json" 192.168.56.101/teach-yourself-rest/teachyourself/customer/ -d '{"email":"WTH01", "name":"blo"}'
sleep 2
curl -X DELETE -H "Content-Type: application/json" 192.168.56.101/teach-yourself-rest/teachyourself/customer/ -d '{"email":"blo@gm.co"}'