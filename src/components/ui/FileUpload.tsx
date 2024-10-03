import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";

function FileUpload({
  fileType,
  fileUrl,
  changeFileUrl,
}: {
  fileType: string;
  fileUrl: string;
  changeFileUrl: (url: string) => void;
}) {
  const [data, setData] = useState([]);

  const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      console.log(e.type);
    } else if (e.type === "dragleave") {
      console.log(e.dataTransfer?.files[0]);
    }
  };
  // const formatData = (worksheet: any) => {
  //   const sortedKeys = sortWorksheet(worksheet);
  //   const checked = {};
  //   console.log(sortedKeys);
  //   if (worksheet[sortedKeys[0]].v.trim() === "") sortedKeys.shift();
  //   let col = sortedKeys[0].match(/[A-Z]+/g)?.[0];
  //   const row = parseInt(sortedKeys[0].match(/\d+/g)?.[0], 10);
  //   const databaseName = worksheet[col + row].v;
  //   let tempRow = row + 1;
  //   checked[`${col}${tempRow++}`] = checked[`${col}${tempRow++}`] = "";

  //   const field = [];

  //   while (worksheet[col + tempRow]) {
  //     field.push(worksheet[col + tempRow].v);
  //     checked[col + tempRow++] = "";
  //   }
  //   col = String.fromCharCode(col.charCodeAt(0) + 1);
  //   tempRow = row + 1;
  //   checked[col + tempRow] = "";
  //   const dataTypeName = worksheet[col + tempRow++].v;
  //   checked[col + tempRow] = "";
  //   const field = [];
  //   while (worksheet[col + tempRow]) {
  //     field.push(worksheet[col + tempRow].v);
  //     checked[col + tempRow++] = "";
  //   }
  //   // const col1 = [];
  //   // const col3 = [];
  //   // const col2 = [];
  //   console.log(databaseName);
  //   // const a = "A1";
  //   // console.log(parseInt(a.match(/\d+/g)?.[0], 10));
  // };
  const sortWorksheet = (worksheet: never) => {
    const sortedKeys = Object.keys(worksheet).sort((a, b) => {
      const colA = a.match(/[A-Z]+/g)?.[0]; // Extract the column part (e.g., "A", "B", "C")
      const rowA = parseInt(a.match(/\d+/g)?.[0], 10); // Extract the row part (e.g., "1", "10")

      const colB = b.match(/[A-Z]+/g)?.[0];
      const rowB = parseInt(b.match(/\d+/g)?.[0], 10);

      // First, compare the column alphabetically

      // console.log(colA + " - " + colB);
      if (colA !== colB) return colA!.localeCompare(colB!);

      // If columns are the same, compare the row numerically
      // console.log(rowA + " - " + rowB);
      return rowA - rowB;
    });
    const sortedWorksheet: any = {};
    console.log(sortedKeys);

    return sortedKeys;
  };
  const handleDrop = (
    event:
      | React.DragEvent<HTMLLabelElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const file =
      "files" in event.target
        ? event.target.files?.[0]
        : (event as React.DragEvent<HTMLLabelElement>).dataTransfer?.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      changeFileUrl(url);
      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON data
        // console.log(workbook);
        console.log(worksheet);
        // const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log(jsonData);
        // setData(jsonData);
        // formatData(worksheet);
      };

      reader.readAsBinaryString(file);
    }
  };
  return (
    <div className="flex justify-center items-center">
      {fileUrl ? (
        <div className="mt-4">
          <p className="text-gray-800 font-semibold mb-2">File Preview:</p>
          <img
            src={fileUrl}
            alt="Preview"
            className="max-w-full h-auto border border-gray-300"
          />
        </div>
      ) : (
        <label
          draggable
          onDragEnter={handleDrag}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={handleDrop}
          className="w-1/2 aspect-square max-w-md p-2 border-2 border-dashed rounded-3xl cursor-pointer border-gray-400 bg-gray-200 text-center hover:bg-gray-400 transition duration-300"
        >
          <input
            type="file"
            accept={fileType}
            onChange={handleDrop}
            className="hidden"
          />
          <div className="text-4xl text-gray-600 mb-3">
            <FontAwesomeIcon icon={faCloudArrowUp} />
          </div>
          <p className="text-gray-800 font-semibold">
            Choose a file or drag it here.
          </p>
        </label>
      )}
    </div>
  );
}

export default FileUpload;
