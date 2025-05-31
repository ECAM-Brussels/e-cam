import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import Button from '~/components/Button'
import Fa from '~/components/Fa'
import Page from '~/components/Page'
import { startLogin } from '~/lib/auth/session'

export default function Login() {
  return (
    <Page title="Log in">
      <div class="text-center">
        <form method="post" action={startLogin}>
          <Button type="submit" color="blue" variant="outlined">
            Se connecter avec Outlook <Fa icon={faMicrosoft} />
          </Button>
        </form>
      </div>
    </Page>
  )
}
