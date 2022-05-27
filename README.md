# MapApp

## Application description
Application, which may help delivery companies to plan routes around the World. 
The main focus of this app is to make route planning easier for the delivery companies, this is why in our app routing can be made by simply providing orders numbers, not just random street addresses. Then, based on given order information or more precisely on shipment and delivery addresses, applicatoin will calculate the best possible route. This route is optimized and addresses visiting order is taken into account, since shipment address should be visited first and only after that delivery.
The application also offer such a great additional settings as avoiding city centers option and taking into account real time traffic situation(Finland only).
The application uses different tools and engines for providing that functionality which are the Open route service(routing), Vroom project(optimization) and the Trafi API(traffic situation).

## Getting Started*
Before setting this application up, please get API keys for the following APIs:
- Openroute Service (free), https://openrouteservice.org/dev/#/signup
- Gas Prices API (not free starting from 08.06.2022), https://collectapi.com/api/gasPrice/gas-prices-api

After downloading the code, make the following steps:

- Run SQL script named DBCreationScript.sql (root folder) in your database console
- Create .env file in the root folder with the following fields (below given example values may be replaced with your own):
```
DATABASE=mapapp
DATABASE_DIALECT=mariadb
DATABASE_HOST=localhost
DATABASE_PORT=8081
DATABASE_USER=username
DATABASE_PASSWORD=password
ORS_API_KEY=your_Open_Route_Service_key
FUEL_API_KEY=your_Gas_Prices_API_key
```
- Optional: Add city center areas to the SettingsUtil.js file, read more in the Detailed instructions section. There are pre-added centers of Helsinki and Lahti cities only.
- Go to the index.js file (server folder) and uncomment the setUp() method

![index.js file](doc_images/indexFile.png);
- Start the server with the console command node server/index.js
- Comment the setUp()-method back and restart the server.

*If you have problems with any of the steps above see detailed explanation in Wiki pages the Detailed instructions section.

## API short description*

1. Database related paths:

| Action | Path | Method | Request object example | Response object example |
| -------- | ---- | ----- | --------------- | --------------- |
| Create a new address | dao/address | POST | { "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": 23 } | "result": { "addressId": 12, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": 23, "lat": 60.3453, "lon": 40.1234 } |
| Read address by id | dao/address/read/:id | GET | | "result": { "addressId": 13, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": 23, "lon": 24.931452, "lat": 60.17138 } |
| Read all addresses | dao/address | GET | | "result": [ { "addressId": 13, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": 23, "lon": 24.931452, "lat": 60.17138 } ] |
| Search for address | dao/address/ search?city= Helsinki&street=Pohjoinen Rautatiekatu | GET | | "result": [ { "addressId": 13, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": 23, "lon": 24.931452, "lat": 60.17138 } ] |
| -------- | ---- | ----- | --------------- | --------------- |
| Create a new area | dao/area | POST | { "areaName": "SomeArea", "type": "Polygon", "coordinates": [ [     [25.654878616333004, 60.98514074901049], [25.671615600585938, 60.979353511636425], [25.668354034423825, 60.98426648575919], [25.654878616333004, 60.98514074901049] ] ] } | "result": { "areaName": "SomeArea", "type": "Polygon", "coordinates": [ { "coordinateId": 40855, "areaName": "SomeArea", "polygonNumber": 0, "orderNumber": 0, "lon": 25.654878616333004, "lat": 60.98514074901049 }, …rest of the coordinates ] } |
| Create multiple new areas | dao/area/multiple | POST | [ { "areaName": "SomeArea", "type": "Polygon", "coordinates": [ [     [25.654878616333004, 60.98514074901049], [25.671615600585938, 60.979353511636425], [25.668354034423825, 60.98426648575919], [25.654878616333004, 60.98514074901049] ] ] } ] | "result": [ { "areaName": "SomeArea", "type": "Polygon" } ] |
| Read area by name | dao/area/:areaName | GET | | result:{ { "type": "Polygon", "coordinates": [ [ [25.654878616333004, 60.98514074901049], [25.671615600585938, 60.979353511636425], [25.668354034423825, 60.98426648575919], [25.654878616333004, 60.98514074901049] ] ] } } |
| Read all areas | dao/area | GET | | result:[ { "type": "Polygon", "coordinates": [ [ [25.654878616333004, 60.98514074901049], [25.671615600585938, 60.979353511636425], [25.668354034423825, 60.98426648575919], [25.654878616333004, 60.98514074901049] ] ] } ] |
| Update an area | dao/area/:areaName | PUT | { "areaName": "SomeArea", "type": "Polygon", "coordinates": [ [     [20.654878616333004, 63.98514074901049], [20.671615600585938, 63.979353511636425], [20.668354034423825, 63.98426648575919], [20.654878616333004, 63.98514074901049] ] ] } | { "isSuccess": true } |
| Delete area by name | dao/area/:areaName | DELETE | | { "isSuccess": true } |
| -------- | ---- | ----- | --------------- | --------------- |
| Create a new client | dao/client | POST | { "clientUsername": "john", "name": "John Smith", "addressAdd": { "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13" } } | "result": { "clientUsername": "john", "name": "John Smith", "addressAdd": { "addressId": 14, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "lon": 24.931452, "lat": 60.17138 } } |
| Read a client by username | dao/client/:clientUsername | GET | | "result": { "clientUsername": "john", "name": "John Smith", "Addresses": [ { "addressId": 14, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": null, "lon": 24.931452, "lat": 60.17138, "AsDeliveryAddress": { "clientUsername": "john", "addressId": 14 } } ] } |
| Read all clients | dao/client | GET | | "result": [ "clientUsername": "john", "name": "John Smith", "Addresses": [ { "addressId": 14, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": null, "lon": 24.931452, "lat": 60.17138, "AsDeliveryAddress": { "clientUsername": "john", "addressId": 14 } } ] ] |
| Update client data | dao/client | PUT | { "clientUsername": "john", "name": "John Smith", "addressAdd": { "city": "Helsinki", "street": "Kotkankatu", "building": "7" }, "addressDelete": { "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13" } } | { "isSuccess": true } |
| Delete client by username | dao/client/:clientUsername | DELETE | | { "isSuccess": true } |
| -------- | ---- | ----- | --------------- | --------------- |
| Create a new manufacturer | dao/manufacturer | POST | { "manufacturerUsername": "john", "name": "John Smith", "addressAdd": { "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13" } } | "result": { "manufacturerUsername": "john", "name": "John Smith", "addressAdd": { "addressId": 14, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "lon": 24.931452, "lat": 60.17138 } } |
| Read a manufacturer by username | dao/manufacturer/:manufacturerUsername | GET | | "result": { "manufacturerUsername": "john", "name": "John Smith", "Addresses": [ { "addressId": 14, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": null, "lon": 24.931452, "lat": 60.17138, "AsShipmentAddress": { "manufacturerUsername": "john", "addressId": 14 } } ] } |
| Read all manufacturer | dao/manufacturer | GET | | "result": [ "manufacturerUsername": "john", "name": "John Smith", "Addresses": [ { "addressId": 14, "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13", "flat": null, "lon": 24.931452, "lat": 60.17138, "AsShipmentAddress": { "manufacturerUsername": "john", "addressId": 14 } } ] ] |
| Update manufacturer data | dao/manufacturer | PUT | { "manufacturerUsername": "john", "name": "John Smith", "addressAdd": { "city": "Helsinki", "street": "Kotkankatu", "building": "7" }, "addressDelete": { "city": "Helsinki", "street": "Pohjoinen Rautatiekatu", "building": "13" } } | { "isSuccess": true } |
| Delete manufacturer by username | dao/manufacturer/:manufacturerUsername | DELETE | | { "isSuccess": true } |
| -------- | ---- | ----- | --------------- | --------------- |
| Create a new data | dao/data | POST | { "name": "electricityPrice", "value": "3" } | "result": { "name": "electricityPrice", "value": "3" } |
| Read a data by name | dao/data/:name | GET | | "result": { "name": "electricityPrice", "value": "3", "lastUpdated": "2022-05-27T13:58:56.000Z" } |
| Read all data | dao/data | GET | | "result": [ "name": "electricityPrice", "value": "3", "lastUpdated": "2022-05-27T13:58:56.000Z" ] |
| Update data | dao/data | PUT | { "name": "electricityPrice", "value": "5" } | { "isSuccess": true } |
| Delete data by name | dao/data/:name | DELETE | | { "isSuccess": true } |
| -------- | ---- | ----- | --------------- | --------------- |
| Create a new order | dao/order | POST | { "manufacturerUsername": "ruoka", "clientUsername": "janne", "shipmentAddressId": 3, "deliveryAddressId": 10 } | "result": { "orderId": 9, "manufacturerUsername": "ruoka", "clientUsername": "janne", "shipmentAddressId": 3, "deliveryAddressId": 10 } |
| Read order by order id | dao/order/:orderId | GET | | "result": { "orderId": 9, "manufacturerUsername": "ruoka", "clientUsername": "janne", "shipmentAddressId": 3, "deliveryAddressId": 10, "Manufacturer": { "manufacturerUsername": "ruoka", "name": "Ruoka Läheltä Oy" }, "Client": { "clientUsername": "janne", "name": "Janne Metsänen" }, "shipmentAddress": { "addressId": 3, "city": "Helsinki", "street": "Alakiventie", "building": "1", "flat": null, "lon": 25.075149, "lat": 60.222781 }, "deliveryAddress": { "addressId": 10, "city": "Helsinki", "street": "Saarankatu ", "building": "2", "flat": null, "lon": 24.922761, "lat": 60.199726 } } |
| Read all orders | dao/order | GET | | "result": [{ "orderId": 9, "manufacturerUsername": "ruoka", "clientUsername": "janne", "shipmentAddressId": 3, "deliveryAddressId": 10, "Manufacturer": { "manufacturerUsername": "ruoka", "name": "Ruoka Läheltä Oy" }, "Client": { "clientUsername": "janne", "name": "Janne Metsänen" }, "shipmentAddress": { "addressId": 3, "city": "Helsinki", "street": "Alakiventie", "building": "1", "flat": null, "lon": 25.075149, "lat": 60.222781 }, "deliveryAddress": { "addressId": 10, "city": "Helsinki", "street": "Saarankatu ", "building": "2", "flat": null, "lon": 24.922761, "lat": 60.199726 } } ] |
| Update an order | dao/order | PUT | { "orderId": 9, "manufacturerUsername": "lahden_ruoka", "clientUsername": "janne", "shipmentAddressId": 7, "deliveryAddressId": 10 } | { "isSuccess": true } |
| Delete order by id | dao/order/:orderId | DELETE | | { "isSuccess": true } |

2. Routing related paths:

| Action | Path examples | Method | Request object example | Response object example |
| -------- | ---- | ----- | --------------- | --------------- |
| Search addresses by street address | api/v1/address/search?text=rantatie | GET | | [ { "name": "Rantatie", "street": "Rantatie", "county": "Vakka-Suomi", "country": "Finland", "macroregion": "Southwest Finland", "region": "Southwest Finland", "label": "Rantatie, Vehmaa, Finland", "coordinates": { "lon": 21.698199, "lat": 60.618656 } } ] |
| Addresses autocomplete | api/v1/address/autocomplete?text=ranta | GET | | [ { "name": "Rantasalmi", "county": "Savonlinna", "country": "Finland", "macroregion": "Eastern Finland", "region": "Southern Savonia", "label": "Rantasalmi, Finland", "coordinates": { "lon": 28.30421, "lat": 62.063429 } }, …max 25 other addresses ] |
| Search addresses by street address (GeoJSON output) | api/v1/address/geojson?text=rantatie | GET | | GeoJSON object with found addresses |
| Reverse geocode | api/v1/address/geocode?lon=24.94341806541326&lat=60.19201503975161 | GET | | { "type": "address", "streetAddress": "Kotkankatu 7", "city": "Helsinki", "coordinates": [ 24.943366, 60.192058 ] } |
| -------- | ---- | ----- | --------------- | --------------- |
| Calculate route by coordinates | api/v1/routing | POST | { "coordinates":[ [25.075149, 60.222781], [24.943523, 60.199091] ], "fuelusage": 8.9 } | Route in GeoJSON format |
| Calculate route by order ids | api/v1/routing/orders | POST | {"orderIds": [2,3], "start" : 2, "end" : 3, "fuelusage": 5.7, "isCenterAvoided": true, "isTrafficSituation": true} | Route in GeoJSON format |


*If you have questions or problems with some paths description, you can read more in wiki pages in the DAO classes and database description section or in the API detailed description section.
