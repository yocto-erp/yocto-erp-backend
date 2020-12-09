import ExcelJS from 'exceljs';
import path from 'path';

const absolutePath = path.resolve('public', 'uploads');

export async function writeExcelFile() {
  console.log(absolutePath);
  const options = {
    filename: `${absolutePath}/streamed-workbook.xlsx`,
    useStyles: true,
    useSharedStrings: true
  };
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);
  const worksheet = workbook.addWorksheet('My Sheet');
  worksheet.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 32 },
    { header: 'D.O.B.', key: 'etc', width: 10, outlineLevel: 1 }
  ];
  worksheet.addRow({
    id: 1,
    name: 'test',
    etc: 'testing'
  }).commit();
  return workbook.commit();
}
