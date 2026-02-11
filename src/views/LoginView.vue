<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const tenantId = '82f88379-b5ad-4b84-833a-a2bb3f1bc0f7'
const clientId = '3cff4f0a-2099-437e-9c65-242f1a19946a'

const baseUrl = window.location.origin;

console.log(baseUrl)

const scopes = [
  'openid',
  'profile',
  'email',
  'user.read',
  'Mail.Send',
  'offline_access'
]

const microsoftAuthUrl = computed(() => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/o_auth/microsoft`,
    response_type: 'code',
    response_mode: 'query',
    scope: scopes.join(' '),
    state: crypto.randomUUID()
  })

  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`
})


</script>

<template>

  <Navbar />

   <main class="max-w-7xl mx-auto p-4 space-y-4">	  
   		<div class="registration-panel">
      <h1 class="mb-0">Log In</h1>
      <form id="loginForm" class="website" action="/guest-sigin" accept-charset="UTF-8" method="post">
        <input name="utf8" type="hidden" value="✓"><input type="hidden" name="authenticity_token" value="">
        <div class="microsoft">
          <a style="display: flex;"
            class="btn btn-block microsoft-button"
            :href="microsoftAuthUrl">
          <span style="margin: auto;">Log in using Office 365</span>
          </a>
        </div>
  
     
      </form>
    </div>

	 </main>

   <Footer />

</template>

<style>
	
    .registration-panel {
      text-align: center;
      background: rgba(0,0,0,0.75);
      color: #fff !important;
      margin: 60px auto;
      width: 400px;
      border-radius: 3px;
    }

    .registration-panel h1, .registration-panel .panel-foot {
        background: rgba(0,0,0,0.5);
        border-radius: 3px;
    }

    .registration-panel h1 {
      display: block;
      padding: 20px 50px;
    }

    
    body {
      background-position: center center !important;
      background-repeat: no-repeat;
      background-size: cover !important;
    }



    .registration-panel form {
      padding: 50px;
    }

    .text-body {
      font-size: 17px;
      line-height: 22px;
    }

    .registration-panel .btn, .registration-panel .button, .registration-panel button {
      border-radius: 3px;
      line-height: inherit;
      min-height: 40px;
      width: 100%;
      text-align: center;
    }

    .registration-panel .reset-password {
      padding: 10px 30px 10px;
      border-top: 1px solid rgba(60,60,60,0.75);
      margin: 30px -30px -30px;
    }

    .registration-panel .remember-me, .registration-panel .receive-newsletter {
      display: block;
      text-align: left;
    }


    .btn {
      background-color: #fff;
      border: 1px solid #dfdfe8;
      border-radius: 4px;
      color: #242428;
      cursor: pointer;
    }

    .button.google-button, .btn.google-button {
      min-width: 260px;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiICB4PSIwIiB5PSIwIiB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BLnN0MHtjbGlwLXBhdGg6dXJsKCNTVkdJRF8yXyk7ZmlsbDojRkJCQzA1O30uc3Qxe2NsaXAtcGF0aDp1cmwoI1NWR0lEXzRfKTtmaWxsOiNFQTQzMzU7fS5zdDJ7Y2xpcC1wYXRoOnVybCgjU1ZHSURfNl8pO2ZpbGw6IzM0QTg1Mzt9LnN0M3tjbGlwLXBhdGg6dXJsKCNTVkdJRF84Xyk7ZmlsbDojNDI4NUY0O308L3N0eWxlPjxkZWZzPjxwYXRoIGlkPSJTVkdJRF8xXyIgZD0iTTU5LjMgMjYuN0g1NiA0NS4xIDMyVjM4aDE1LjdjLTEuNSA3LjItNy42IDExLjMtMTUuNyAxMS4zIC05LjYgMC0xNy4zLTcuNy0xNy4zLTE3LjNTMjIuNCAxNC43IDMyIDE0LjdjNC4xIDAgNy45IDEuNSAxMC44IDMuOWw4LjUtOC41QzQ2LjEgNS41IDM5LjUgMi43IDMyIDIuNyAxNS43IDIuNyAyLjcgMTUuNyAyLjcgMzJTMTUuNyA2MS4zIDMyIDYxLjNjMTQuNyAwIDI4LTEwLjcgMjgtMjkuM0M2MCAzMC4zIDU5LjcgMjguNCA1OS4zIDI2Ljd6Ii8%2BPC9kZWZzPjxjbGlwUGF0aCBpZD0iU1ZHSURfMl8iPjx1c2UgeGxpbms6aHJlZj0iI1NWR0lEXzFfIi8%2BPC9jbGlwUGF0aD48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjAgNDkuMyAwIDE0LjcgMjIuNyAzMiAiLz48ZGVmcz48cGF0aCBpZD0iU1ZHSURfM18iIGQ9Ik01OS4zIDI2LjdINTYgNDUuMSAzMlYzOGgxNS43Yy0xLjUgNy4yLTcuNiAxMS4zLTE1LjcgMTEuMyAtOS42IDAtMTcuMy03LjctMTcuMy0xNy4zUzIyLjQgMTQuNyAzMiAxNC43YzQuMSAwIDcuOSAxLjUgMTAuOCAzLjlsOC41LTguNUM0Ni4xIDUuNSAzOS41IDIuNyAzMiAyLjcgMTUuNyAyLjcgMi43IDE1LjcgMi43IDMyUzE1LjcgNjEuMyAzMiA2MS4zYzE0LjcgMCAyOC0xMC43IDI4LTI5LjNDNjAgMzAuMyA1OS43IDI4LjQgNTkuMyAyNi43eiIvPjwvZGVmcz48Y2xpcFBhdGggaWQ9IlNWR0lEXzRfIj48dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8zXyIvPjwvY2xpcFBhdGg%2BPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIwIDE0LjcgMjIuNyAzMiAzMiAyMy45IDY0IDE4LjcgNjQgMCAwIDAgIi8%2BPGRlZnM%2BPHBhdGggaWQ9IlNWR0lEXzVfIiBkPSJNNTkuMyAyNi43SDU2IDQ1LjEgMzJWMzhoMTUuN2MtMS41IDcuMi03LjYgMTEuMy0xNS43IDExLjMgLTkuNiAwLTE3LjMtNy43LTE3LjMtMTcuM1MyMi40IDE0LjcgMzIgMTQuN2M0LjEgMCA3LjkgMS41IDEwLjggMy45bDguNS04LjVDNDYuMSA1LjUgMzkuNSAyLjcgMzIgMi43IDE1LjcgMi43IDIuNyAxNS43IDIuNyAzMlMxNS43IDYxLjMgMzIgNjEuM2MxNC43IDAgMjgtMTAuNyAyOC0yOS4zQzYwIDMwLjMgNTkuNyAyOC40IDU5LjMgMjYuN3oiLz48L2RlZnM%2BPGNsaXBQYXRoIGlkPSJTVkdJRF82XyI%2BPHVzZSB4bGluazpocmVmPSIjU1ZHSURfNV8iLz48L2NsaXBQYXRoPjxwb2x5Z29uIGNsYXNzPSJzdDIiIHBvaW50cz0iMCA0OS4zIDQwIDE4LjcgNTAuNSAyMCA2NCAwIDY0IDY0IDAgNjQgIi8%2BPGRlZnM%2BPHBhdGggaWQ9IlNWR0lEXzdfIiBkPSJNNTkuMyAyNi43SDU2IDQ1LjEgMzJWMzhoMTUuN2MtMS41IDcuMi03LjYgMTEuMy0xNS43IDExLjMgLTkuNiAwLTE3LjMtNy43LTE3LjMtMTcuM1MyMi40IDE0LjcgMzIgMTQuN2M0LjEgMCA3LjkgMS41IDEwLjggMy45bDguNS04LjVDNDYuMSA1LjUgMzkuNSAyLjcgMzIgMi43IDE1LjcgMi43IDIuNyAxNS43IDIuNyAzMlMxNS43IDYxLjMgMzIgNjEuM2MxNC43IDAgMjgtMTAuNyAyOC0yOS4zQzYwIDMwLjMgNTkuNyAyOC40IDU5LjMgMjYuN3oiLz48L2RlZnM%2BPGNsaXBQYXRoIGlkPSJTVkdJRF84XyI%2BPHVzZSB4bGluazpocmVmPSIjU1ZHSURfN18iLz48L2NsaXBQYXRoPjxwb2x5Z29uIGNsYXNzPSJzdDMiIHBvaW50cz0iNjQgNjQgMjIuNyAzMiAxNy4zIDI4IDY0IDE0LjcgIi8%2BPC9zdmc%2BCg%3D%3D);
      background-position: 10px center;
      background-repeat: no-repeat;
      background-size: 24px;
      margin-bottom: 20px;
      padding-left: 40px;
      padding-top: 0px; 
      padding-bottom: 0px; 
      text-shadow: none;
    }

    .button.microsoft-button, .btn.microsoft-button {
      background-color: #fff;
      border: 1px solid #dfdfe8;
      border-radius: 4px;
      color: #242428;
      cursor: pointer;
      min-width: 260px;
     background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMSIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDIxIDIxIj48dGl0bGU+TVMtU3ltYm9sTG9ja3VwPC90aXRsZT48cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iOSIgaGVpZ2h0PSI5IiBmaWxsPSIjZjI1MDIyIi8+PHJlY3QgeD0iMSIgeT0iMTEiIHdpZHRoPSI5IiBoZWlnaHQ9IjkiIGZpbGw9IiMwMGE0ZWYiLz48cmVjdCB4PSIxMSIgeT0iMSIgd2lkdGg9IjkiIGhlaWdodD0iOSIgZmlsbD0iIzdmYmEwMCIvPjxyZWN0IHg9IjExIiB5PSIxMSIgd2lkdGg9IjkiIGhlaWdodD0iOSIgZmlsbD0iI2ZmYjkwMCIvPjwvc3ZnPg==);
      background-position: 10px center;
      background-repeat: no-repeat;
      background-size: 24px;
      margin-bottom: 20px;
      padding-left: 40px;
      text-shadow: none;
      padding-top: 0px; 
      padding-bottom: 0px; 
    }

</style>

