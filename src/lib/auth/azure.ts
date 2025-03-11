import { MicrosoftEntraId } from "arctic"

export const entra = new MicrosoftEntraId(
  import.meta.env.VITE_AZURE_TENANT_ID,
  import.meta.env.VITE_AZURE_CLIENT_ID,
  null,
  import.meta.env.VITE_AZURE_REDIRECT_URI,
)