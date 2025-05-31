import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import {
  type ColumnDef,
  type SortingState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/solid-table'
import { debounce } from 'lodash-es'
import { createSignal, For, Show } from 'solid-js'
import Fa from '~/components/Fa'

type TableProps<Row> = {
  class?: string
  data: Row[]
  columns: ColumnDef<Row>[]
  subRows?: (row: Row) => Row[] | undefined
  search?: boolean
}

export default function Table<Row extends object>(props: TableProps<Row>) {
  const [sorting, setSorting] = createSignal<SortingState>([])
  const [globalFilter, setGlobalFilter] = createSignal('')
  const debounceSetGlobalFilter = debounce((value: string) => setGlobalFilter(value), 50)
  const table = createSolidTable({
    get data() {
      return props.data
    },
    state: {
      get sorting() {
        return sorting()
      },
      get globalFilter() {
        return globalFilter()
      },
    },
    columns: props.columns,
    getSubRows: props.subRows,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })
  return (
    <div class="my-4">
      <Show when={props.search}>
        <input
          class="block p-2 font-lg shadow border border-block mx-auto my-8 w-96"
          value={globalFilter() ?? ''}
          onInput={(e) => debounceSetGlobalFilter(e.currentTarget.value)}
          placeholder="Rechercher dans toutes les colonnes..."
        />
      </Show>
      <table class={props.class ?? 'border bg-white text-gray-600 mx-auto my-4'}>
        <thead class="border text-gray-900 uppercase bg-gray-50">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr class="px-4 py-4 text-sm">
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th
                      class="px-4 py-2"
                      classList={{
                        'cursor-pointer select-none': header.column.getCanSort(),
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      <Show
                        when={header.column.getIsSorted()}
                        fallback={
                          <Show when={header.column.getCanSort()}>
                            <Fa icon={faSort} class="mx-2 text-gray-400" />
                          </Show>
                        }
                      >
                        {(dir) => (
                          <Fa icon={dir() === 'asc' ? faSortUp : faSortDown} class="mx-2" />
                        )}
                      </Show>
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
                  class="border-gray-200 hover:bg-slate-100 relative"
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
    </div>
  )
}
