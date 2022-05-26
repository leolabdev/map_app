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