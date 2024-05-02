PORT=2220
echo ""
echo "++++++++++++++++++++++++++++++++++++++++++"
echo " Make sure you're using the correct port! "
echo "++++++++++++++++++++++++++++++++++++++++++"
echo ""
curl --location "http://localhost:${PORT}/api/blockchain/info" \
--header 'x-api-key: 12345' \
--header 'Authorization: Bearer Basic dmVydXNkZXNrdG9wOnk4RDZZWGhBRms2alNoSGlSQktBZ1JDeDB0OVpkTWYyUzNLMG83ek44U28='