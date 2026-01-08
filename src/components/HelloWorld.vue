<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0);
const data = ref({});

import mqtt from "mqtt";

//mosquitto_sub -t wattlab/vertom/tula/lonlat -p 18883 -h mqtt.wlkn.nl -u wattlab -P qUD1URebxUQJAd0L --cafile /etc/ssl/cert.pem

let options = {
  port: 18083,//process.env.MQTT_PORT,
  username: 'wattlab',//process.env.MQTT_USER,
  password: 'qUD1URebxUQJAd0L'//process.env.MQTT_PASSWORD
}

var client  = mqtt.connect('wss://mqtt.wlkn.nl', options);


client.on("connect", () => {
  client.subscribe("wattlab/vertom/tula/lonlat", (err) => {
    if (!err) {
      //
    }
  });
});

client.on("message", (topic, message) => {
  console.log(topic, message);
  const payload = message.toString();

  switch(topic) {
    case "wattlab/vertom/tula/lonlat":
      data.value = JSON.parse(payload);
    break;
    
    default:
  }



});

</script>



<style scoped>

</style>
