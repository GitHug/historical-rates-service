# historical-rates-service
A service to fetch historical exchange rates from the European Central Bank (ECB). ECB publishes new exchange rates daily on bank days (i.e. not on weekends or bank holidays) at around 14:15 CET (GMT + 1). More information available [here](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html).

ECB do not expose any public APIs for the historical exchange rates. This service scrapes the site to find the .zip file and it then extracts the file and returns data as JSON.

This service has a cache with a TTL of 12 hours. In the worst case scenario, that is a cache miss just before ECB has updated its published exchange rates, will cause at most a 12 hour delay of new exchange rates to be retrieved.

## How to use
To install:
```
yarn install
```

To run:
```
yarn start
````

To call the service on localhost: `localhost:4001/rates/historical`.

Results are cached and subsequent calls will be faster.

## Configure
The default port is `4001` but can be modified by adding a `.env` file with a `PORT` variable such as
```
PORT=4001
```

## Docker
The service can be run as a Docker container. Note that the included Dockerfile assumes port 4001 so this will need to be changed if another port has been configured.


