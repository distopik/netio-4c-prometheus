const P = require('prom-client')
const A = require('axios')
const app = require('express')()
const endpoint = `${process.env['NETIO_DEVICE_URL'] || 'http://10.10.1.153/netio.json'}`
const interval = parseInt(process.env['SCRAPE_INTERVAL']) || 5000

const PortStatus = new P.Gauge({
  name: 'netio_4c_port_status',
  help: 'status of a port 0=off 1=on',
  labelNames: ['port_id', 'port_name'],
})

const PortCurrent = new P.Gauge({
  name: 'netio_4c_port_current_ma',
  help: 'current of a port in milliampares',
  labelNames: ['port_id', 'port_name'],
})

const PortEnergy = new P.Gauge({
  name: 'netio_4c_port_energy_wh',
  help: 'energy used on a port in watthours',
  labelNames: ['port_id', 'port_name'],
})

const PortPowerFactor = new P.Gauge({
  name: 'netio_4c_port_power_factor_percent',
  help: 'power factor on a port in percent',
  labelNames: ['port_id', 'port_name'],
})

const GlobalCurrent = new P.Gauge({
  name: 'netio_4c_global_power_ma',
  help: 'global current in milliamperes',
})

const GlobalEnergy = new P.Gauge({
  name: 'netio_4c_global_energy_wh',
  help: 'global energy used in watthours',
})

const GlobalPowerFactor = new P.Gauge({
  name: 'netio_4c_global_power_factor_percent',
  help: 'global power factor in percent',
})

const globalTimer = setInterval(() => {
  A.get(endpoint)
    .then(res => {
      const { Agent, GlobalMeasure, Outputs } = res.data

      GlobalCurrent.set(GlobalMeasure.TotalCurrent)
      GlobalEnergy.set(GlobalMeasure.TotalEnergy)
      GlobalPowerFactor.set(GlobalMeasure.OverallPowerFactor * 100)

      for (const output of Outputs) {
        const portLabels = { port_id: output.ID, port_name: output.Name || '' }
        PortStatus.set(portLabels, output.State)
        PortCurrent.set(portLabels, output.Current)
        PortEnergy.set(portLabels, output.Energy)
        PortPowerFactor.set(portLabels, output.PowerFactor * 100)
      }
    })
    .catch(console.error)
}, interval)

app.get('/metrics', (_, res) => {
  res.type('text/plain').end(P.register.metrics())
})

app.listen(3000, () => {
  console.log('now listening')
})
