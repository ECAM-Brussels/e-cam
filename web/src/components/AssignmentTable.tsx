import { createAsync } from '@solidjs/router'
import Table from '~/components/Table'
import { getAssignmentList } from '~/lib/exercises/assignment'

type Row = {
  url: string
  page: { title: string }
  courses: { url: string; title: string; code: string }[]
  grade: number
}

export default function AssignmentTable(props: {
  query?: Parameters<typeof getAssignmentList>[0] | string
  search?: boolean
}) {
  const query = () => (typeof props.query === 'string' ? JSON.parse(props.query) : props.query)
  const data = createAsync(() => getAssignmentList(query() ?? {}), { initialValue: [] })
  return (
    <Table
      search={props.search}
      data={data() as Row[]}
      columns={[
        {
          accessorFn: (row) => row.page.title,
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
