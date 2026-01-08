import { onMounted, onBeforeUnmount } from 'vue'
import mqtt from "mqtt"
//import { useTelemetryStore } from '../stores/telemetryStore'

//mosquitto_sub -t wattlab/vertom/tula/lonlat -p 18883 -h mqtt.wlkn.nl -u wattlab -P qUD1URebxUQJAd0L --cafile /etc/ssl/cert.pem

export function useMqttClient(options) {
  //const store = useTelemetryStore()
  let client;
  
  function connect() {
    client = mqtt.connect('wss://mqtt.wlkn.nl', options);

    client.on('connect', () => {
      client?.subscribe("wattlab/vertom/tula/lonlat", (err) => {
        if (err) console.error('MQTT subscribe error', err)
      })
    })

    client.on('message', (_topic, payload) => {
      try {
        const msg = JSON.parse(payload.toString())
        const row = msg
        console.log(row);
        //telemetry.appendFromRealtime(row)
      } catch (e) {
        console.error('MQTT message parse error', e)
      }
    })

    client.on('error', (err) => {
      console.error('MQTT error', err)
    })
  }

  function disconnect() {
    if (client) {
      client.end(true)
      client = null
    }
  }

  onMounted(connect)
  onBeforeUnmount(disconnect)

  return { connect, disconnect }

}


