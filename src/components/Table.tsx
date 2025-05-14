import {
  type ColumnDef,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
} from '@tanstack/solid-table'
import { For } from 'solid-js'

type TableProps<Row> = {
  class?: string
  data: Row[]
  columns: ColumnDef<Row>[]
  subRows?: (row: Row) => Row[] | undefined
}

export default function Table<Row extends object>(props: TableProps<Row>) {
  const table = createSolidTable({
    get data() {
      return props.data
    },
    columns: props.columns,
    getSubRows: props.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })
  return (
    <table class={props.class ?? 'border bg-white text-gray-600 mx-auto my-4'}>
      <thead class="border text-gray-900 uppercase bg-gray-50">
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <tr class="px-4 py-4 text-sm">
              <For each={headerGroup.headers}>
                {(header) => (
                  <th class="px-4 py-2">
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
          {(row, i) => {
            return (
              <tr
                class="border-gray-200 hover:bg-slate-100"
                classList={{
                  'border-t': row.depth === 0,
                  'bg-slate-50': i() % 2 === 1 && row.depth === 0,
                }}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td class="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )}
                </For>
              </tr>
            )
          }}
        </For>
      </tbody>
    </table>
  )
}
