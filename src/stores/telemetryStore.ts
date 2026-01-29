import { reactive, computed } from 'vue'

type ConnectionStatus = 'idle' | 'loading' | 'live' | 'error'

const state = reactive({
  endpoint: 'https://mijn.wattlab.nl/projects/sensors?location=TULA&ref=VERTOM&model=GRID%2BPV',
  rows: [],
  lastTimestamp: 0,
  status: 'idle' as ConnectionStatus,
  error: '' as string | '',
})

const latest = computed(() => state.rows.at(-1))
const groups = computed(() => latest.value?.payload?.groups ?? [])

function clear() {
  state.rows = []
  state.lastTimestamp = 0
}

function appendRow(row) {
  const ts =
    row.payload?.timestamp ??
    Math.floor(new Date(row.created_at).getTime() / 1000)
  state.lastTimestamp = ts
  state.rows.push(row)
  //if (state.rows.length > 1000) state.rows.shift()
}

async function fetchSnapshot() {
  if (!state.endpoint) return
  state.status = 'loading'
  state.error = ''
  
  try {
    const res = await fetch(state.endpoint, { cache: 'no-store' })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const arr = await res.json()

    if (!Array.isArray(arr) || !arr.length) {
      state.status = 'error'
      return
    }

    console.log(arr);

    state.rows = arr
    state.status = 'idle'

  } catch (e: any) {
    console.error(e)
    clear()
    state.status = 'error'
    state.error = e?.message ?? 'Unknown error'
  }
}

async function getChannelDataById(installation_id, kind, channel_id, start, end) {

  const url = new URL('/api/samples', window.location.origin);
  url.searchParams.set('installation_id', installation_id)
  url.searchParams.set('kind', kind)
  if (typeof channel_id !== "undefined"){ url.searchParams.set('channel_id', channel_id)}
  if (typeof start !== "undefined"){ url.searchParams.set('start', start)}
  if (typeof end !== "undefined"){ url.searchParams.set('end', end)}

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return await res.json()
}

async function getChannelsByInstallationId(installation_id) {
  //http://localhost:3044/channels?installation_id=1
  const url = new URL('/api/channels', window.location.origin);
  url.searchParams.set('installation_id', 1)

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  return await res.json()
}

export function useTelemetryStore() {
  return {
    state,
    // getters
    latest,
    groups,
    // actions
    fetchSnapshot,
    clear,
    getChannelsByInstallationId,
    getChannelDataById
  }
}
