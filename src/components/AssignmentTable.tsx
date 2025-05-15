import Fa from './Fa'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { createAsync, query } from '@solidjs/router'
import { Show } from 'solid-js'
import Table from '~/components/Table'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

type Row = {
  url: string
  title: string
  courses: { url: string; title: string; code: string }[]
  prerequisites?: Row[]
  grade: number
}

const getAssignmentTable = query(async (where: {}): Promise<Row[]> => {
  'use server'
  const user = await getUser()
  const data = await prisma.assignment.findMany({
    where,
    select: {
      url: true,
      title: true,
      courses: { select: { code: true, url: true, title: true } },
      prerequisites: {
        select: {
          url: true,
          title: true,
          courses: { select: { code: true, url: true, title: true } },
        },
      },
      attempts: user
        ? {
            select: { id: true },
            where: { email: user.email, correct: true },
            orderBy: { position: 'desc' },
            take: 10,
          }
        : false,
    },
  })
  return data.map(({ attempts, ...info }) => {
    return {
      ...info,
      grade: attempts.length || 0,
      prerequisites: info.prerequisites.map((p) => ({
        ...p,
        grade: data.filter((r) => r.url === p.url)[0].attempts.length || 0,
      })),
    }
  })
}, 'getAssignmentTable')

export default function AssignmentTable() {
  const data = createAsync(() => getAssignmentTable({}), { initialValue: [] })
  return (
    <Table
      data={data()}
      subRows={(row) => row.prerequisites}
      columns={[
        {
          id: 'expand',
          cell: (info) => (
            <Show when={info.row.original.prerequisites?.length}>
              <button onClick={info.row.getToggleExpandedHandler()} title="Montrer les prérequis">
                <Fa icon={info.row.getIsExpanded() ? faChevronRight : faChevronDown} />
              </button>{' '}
            </Show>
          ),
        },
        {
          accessorKey: 'title',
          header: 'Title',
          cell: (info) => (
            <a href={info.row.original.url} style={{ 'margin-left': `${info.row.depth ?? 0}em` }}>
              {info.getValue<string>()}
            </a>
          ),
        },
        {
          accessorFn: (row) => row.courses.map((c) => c.title || c.code).join(', '),
          header: 'Cours',
        },
        {
          header: 'Progrès',
          accessorFn: (row) => row.grade / 10,
          cell: (info) => {
            return <progress value={info.getValue<number>()} />
          },
        },
      ]}
    />
  )
}
