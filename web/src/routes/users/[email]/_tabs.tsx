import { useParams } from '@solidjs/router'
import Tabs from '~/components/Tabs'

export default function UserTabs() {
  const params = useParams()
  return (
    <Tabs
      links={[
        { href: `/users/${params.email}`, children: 'Profil' },
        { href: `/users/${params.email}/math`, children: 'Mathématiques' },
        { href: `/users/${params.email}/history`, children: 'Historique' },
      ]}
    />
  )
}
