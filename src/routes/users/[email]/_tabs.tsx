import { useParams } from '@solidjs/router'
import Tabs from '~/components/Tabs'

export default function UserTabs() {
  const params = useParams()
  return (
    <Tabs
      links={[
        { href: `/users/${params.email}`, children: 'Avancement' },
        { href: `/users/${params.email}/profile`, children: 'Profil' },
        { href: `/users/${params.email}/graph`, children: 'Graphe' },
        { href: `/users/${params.email}/history`, children: 'Historique' },
      ]}
    />
  )
}
