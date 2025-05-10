import {
  type ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/solid-table'
import { For } from 'solid-js'

type TableProps<Row> = {
  data: Row[]
  columns: ColumnDef<Row>[]
}

export default function Table<Row extends object>(props: TableProps<Row>) {
  const table = createSolidTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <table>
      <thead>
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr>
              <For each={headerGroup.headers}>
                {(header) => (
                  <th>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </thead>
      <tbody>
        <For each={table.getRowModel().rows}>
          {(row) => (
            <tr>
              <For each={row.getVisibleCells()}>
                {(cell) => <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}
