import Fa from './Fa'
import { faFileExcel, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import Button from '~/components/Button'

export default function Excel<T>(props: { data: Array<T> }) {
  return (
    <Button
      color="blue"
      onClick={() => {
        if (window) {
          const ws = XLSX.utils.json_to_sheet(props.data)
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
          const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
          saveAs(blob, 'export.xlsx')
        }
      }}
    >
      Exporter vers Excel <Fa icon={faFileExport} /> <Fa icon={faFileExcel} />
    </Button>
  )
}
