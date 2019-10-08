# netio-4c-prometheus

This PDU is great but it does not have inbuilt consumption graphing
https://www.netio-products.com/en/device/powerpdu-4c

But prometheus + graphana can be used instead.

This piece of software is a prometheus compatible gateway for netio 4c PDU metrics. It will scrape the JSON "read API" status and make the collected metrics available to prometheus which will in turn scrape them.

Example Grafana dashboard TBD.

## usage as a nodejs app

Just run index.js with environment variable `NETIO_DEVICE_URL` set accordingly.

> `NETIO_DEVICE_URL=http://dns.or.ip/netio.json node index.js`

## usage in docker

> `docker run -e NETIO_DEVICE_URL=http://dns.or.ip/netio.json distopik/netio-4c-prometheus`

## consumption in prometheus

In prometheus, add the data source to the host or container, port 3000.
