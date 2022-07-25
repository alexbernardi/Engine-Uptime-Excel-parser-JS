function UploadProcess() {
    //Reference the FileUpload element.
    var fileUpload = document.getElementById("fileUpload");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    GetTableFromExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    GetTableFromExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
};
function GetTableFromExcel(data) {
    //Read the Excel File data in binary
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //get the name of First Sheet.
    var Sheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);
    console.log(excelRows[0]['Sample Time']);
    let sTime = excelRows[0]['Sample Time'].split(' ');
    let sTimeDay = sTime[0].split('/')
    let sTimeDay2 = sTime[1].split('/')
    
    console.log(sTimeDay)
    console.log(sTimeDay2)
    let year2 = sTimeDay[2]
    
    let year1 = 20
    let fullyear = year1+year2
    console.log(fullyear)

    let day = sTimeDay[1]
    let length = day.length
    console.log(length)
        if (length < 2)
        {
            day = 0+day
        }
    console.log(day)
    
    let month = sTimeDay[0]
    let length2 = month.length
    console.log(length2)
        if (length2 < 2)
        {
            month = 0+month
        }
    console.log(month)
      

    let date = fullyear+"-"+month+"-"+day
    console.log(date)

    let fulldate = date + "T" + sTimeDay2
    console.log(fulldate)
    console.log(Date.parse(fulldate))
};