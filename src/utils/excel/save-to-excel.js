import * as xlsx from "xlsx";
import os from "os";

export const saveToExcel = ({ data = [], path = os.tmpdir(), fileName }) => {
  const fileLocation = `${path}/${fileName}.xlsx`;
  // Step 1: Convert JSON data to a worksheet
  const ws = xlsx.utils.json_to_sheet(data);

  // Step 2: Create a new workbook
  const wb = xlsx.utils.book_new();

  // Step 3: Append the worksheet to the workbook
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

  // Step 4: Write the workbook to a file
  xlsx.writeFile(wb, fileLocation);

  return fileLocation;
};
