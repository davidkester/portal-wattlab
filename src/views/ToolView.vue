<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

const form = ref({
  company: '',
  ship: '',
  vessel: {
    installedCapacity: 291.6,
    connectedPercentage: 95,
    routeYield: 1100,
    investmentSubsidy: 0,
    euOperationShare: 50,
  },
  variables: {
    pricePerSFR: 2754,
    vesselModifications: 150,
    fuelPriceMDO: 750,
    mdoEmissionFactor: 3.2,
    sfc: 0.24,
    panelDegradation: 0.4,
    fuelPriceHVO: 1250,
    euEtsPrice: 75,
    imoNetZeroPrice: 0,
    fuelEuSaving: 640,
  },
})

const submit = async () => {
  loading.value = true
  success.value = false
  error.value = null

  try {
    const response = await axios.post('/api/sales/pdf', form.value, {
      responseType: 'blob',
    })

    const fileName = `${form.value.company || 'document'}.pdf`
    const blob = new Blob([response.data], { type: 'application/pdf' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    success.value = true
  } catch (e) {
    console.error(e)
    error.value = 'Failed to generate PDF'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Navbar />

  <main class="max-w-5xl mx-auto p-6 space-y-10">
    <h1 class="text-2xl font-semibold">Solar vessel assessment</h1>

    <!-- Company / Vessel -->
    <section class="space-y-4">
      <h2 class="text-xl font-medium">General information</h2>

      <div class="grid grid-cols-2 gap-4">
        <label>
          Company name
          <input
            type="text"
            v-model="form.company"
            required
            placeholder="e.g. Wattlab"
          />
        </label>

        <label>
          Vessel name
          <input
            type="text"
            v-model="form.ship"
            required
            placeholder="e.g. Helios"
          />
        </label>
      </div>
    </section>

    <!-- Inputs per vessel -->
    <section class="space-y-4">
      <h2 class="text-xl font-medium">Inputs per vessel</h2>

      <div class="grid grid-cols-2 gap-4">
        <label>
          Installed capacity (kWp)
          <input type="number" step="0.1" v-model="form.vessel.installedCapacity" />
        </label>

        <label>
          Percentage connected (%)
          <input type="number" step="1" v-model="form.vessel.connectedPercentage" />
        </label>

        <label>
          Sailing route yield (kWh/kWp/year)
          <input type="number" step="10" v-model="form.vessel.routeYield" />
        </label>

        <label>
          Investment subsidy (%)
          <input type="number" step="1" v-model="form.vessel.investmentSubsidy" />
        </label>

        <label>
          Share of operation in EU waters (%)
          <input type="number" step="1" v-model="form.vessel.euOperationShare" />
        </label>
      </div>
    </section>

    <!-- Variable inputs -->
    <section class="space-y-4">
      <h2 class="text-xl font-medium">Variable inputs</h2>

      <div class="grid grid-cols-2 gap-4">
        <label>
          Price per SFR (€ / unit)
          <input type="number" v-model="form.variables.pricePerSFR" />
        </label>

        <label>
          Vessel modifications (€ / kWp)
          <input type="number" v-model="form.variables.vesselModifications" />
        </label>

        <label>
          Fuel price MDO (€ / tonne)
          <input type="number" v-model="form.variables.fuelPriceMDO" />
        </label>

        <label>
          MDO CO₂ emission factor (tCO₂ / tonne)
          <input type="number" step="0.1" v-model="form.variables.mdoEmissionFactor" />
        </label>

        <label>
          Specific fuel consumption (kg / kWh)
          <input type="number" step="0.01" v-model="form.variables.sfc" />
        </label>

        <label>
          Panel degradation (% / year)
          <input type="number" step="0.1" v-model="form.variables.panelDegradation" />
        </label>

        <label>
          Fuel price HVO (€ / tonne)
          <input type="number" v-model="form.variables.fuelPriceHVO" />
        </label>

        <label>
          EU ETS price (€ / tCO₂)
          <input type="number" v-model="form.variables.euEtsPrice" />
        </label>

        <label>
          IMO Net Zero price (€ / tCO₂)
          <input type="number" v-model="form.variables.imoNetZeroPrice" />
        </label>

        <label>
          FuelEU Maritime saving (€ / tCO₂)
          <input type="number" v-model="form.variables.fuelEuSaving" />
        </label>
      </div>
    </section>

    <button
      @click="submit"
      :disabled="loading"
      class="bg-blue-600 text-white px-6 py-2 rounded"
    >
      {{ loading ? 'Generating…' : 'Generate PDF' }}
    </button>

    <p v-if="success" class="text-green-600">✅ PDF downloaded successfully</p>
    <p v-if="error" class="text-red-600">{{ error }}</p>
  </main>

  <Footer />
</template>

<style scoped>
label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}
input {
  border: 1px solid #ccc;
  padding: 0.45rem;
  border-radius: 4px;
}
</style>
