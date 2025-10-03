import {
  faChevronDown,
  faChevronUp,
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons'
import { action, json } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import {
  type ColumnDef,
  type SortingState,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/solid-table'
import { debounce } from 'lodash-es'
import { createSignal, For, type JSXElement, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Fa from '~/components/Fa'
import { hashObject } from '~/lib/helpers'

type TableProps<Row> = {
  class?: string
  data: Row[]
  columns: ColumnDef<Row>[]
  subComponent?: (row: Row) => JSXElement
  subRows?: (row: Row) => Row[] | undefined
  search?: boolean
  page?: number
  pageSize?: number
  setPage?: (page: number) => void
  sorting?: SortingState
}

const Excel = clientOnly(() => import('~/components/Excel'))

export default function Table<Row extends object>(props: TableProps<Row>) {
  const [sorting, setSorting] = createSignal<SortingState>(props.sorting ?? [])
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
      get pagination() {
        return { pageIndex: (props.page ?? 1) - 1, pageSize: props.pageSize ?? 30 }
      },
    },
    get columns() {
      return [
        ...(props.subRows || props.subComponent
          ? [
              {
                id: 'expander',
                header: () => null,
                cell: (info) => {
                  return (
                    <Show when={props.subComponent || info.row.getCanExpand()}>
                      <button onClick={() => info.row.toggleExpanded()}>
                        <Fa icon={info.row.getIsExpanded() ? faChevronUp : faChevronDown} />
                      </button>
                    </Show>
                  )
                },
              } satisfies ColumnDef<Row>,
            ]
          : []),
        ...props.columns,
      ]
    },
    getSubRows: props.subRows,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
      <div class="text-center text-sm">
        <Excel data={props.data} />
      </div>
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
                <>
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
                  <Show when={row.getIsExpanded() && props.subComponent}>
                    <tr
                      class="border-t border-dashed"
                      classList={{
                        'bg-slate-50': i() % 2 === 1 && row.depth === 0,
                      }}
                    >
                      <td colSpan={row.getVisibleCells().length} class="px-4">
                        <Dynamic component={props.subComponent} {...row.original} />
                      </td>
                    </tr>
                  </Show>
                </>
              )
            }}
          </For>
        </tbody>
        <tfoot>
          <Show when={table.getPageCount() > 1}>
            <tr class="text-center text-sm">
              <td colspan={table.getVisibleLeafColumns().length} class="py-2">
                <form
                  method="post"
                  action={action(
                    async (form: FormData) => {
                      props.setPage?.(Number(form.get('page')))
                      return json(null, { revalidate: 'nothing' })
                    },
                    `change-page-${hashObject(props.data)}`,
                  )}
                >
                  Page{' '}
                  <input
                    class="border field-sizing-content text-center"
                    type="number"
                    name="page"
                    min="1"
                    max={table.getPageCount().toLocaleString()}
                    value={table.getState().pagination.pageIndex + 1}
                    onChange={(e) => e.target.closest('form')?.requestSubmit()}
                  />{' '}
                  sur {table.getPageCount().toLocaleString()}
                </form>
              </td>
            </tr>
          </Show>
        </tfoot>
      </table>
    </div>
  )
}
