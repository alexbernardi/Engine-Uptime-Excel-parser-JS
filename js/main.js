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
    function tempSTimeF(e) {
        let tempSTime = excelRows[e]['Sample Time'].split(' ');
        tempSTime = tempSTime[1].split(':')
        tempSTimeHour = tempSTime[0]
        tempSTimeMinute = tempSTime[1]
    }
    function sTimeF(f) {
        let sTime = excelRows[f]['Sample Time'].split(' ');
        sTime = sTime[1].split(':')
        sTimeHour = sTime[0]
        sTimeMinute = sTime[1]

    }
    let tempSTimeDay = 0
    let a = 1
    let totalMinute = 0
    for (let index = 0; index < excelRows.length; index++) {
        let transGear = excelRows[index]['Transmission Current Gear']
        let engineSpeed = excelRows[index]['Engine Speed [RPM]']
        if (transGear > 0 && engineSpeed > 800) {
            if (index === 0) {
                tempSTimeF(index)
                let tempSTimeTwo = excelRows[index]['Sample Time'].split(' ');
                tempSTimeDay = tempSTimeTwo[0].split('/')
                tempSTimeDay = tempSTimeDay[1]
            }
            else if (excelRows[index-a]['Engine Speed [RPM]'] > 800 && excelRows[index-a]['Transmission Current Gear'] > 0 ) {
                a++
            }
            else {
                tempSTimeF(index)
                let tempSTimeTwo = excelRows[index]['Sample Time'].split(' ');
                tempSTimeDay = tempSTimeTwo[0].split('/')
                tempSTimeDay = tempSTimeDay[1]
                


            }
        }
        else if (index === 0) {
            
        }
        else if (typeof transGear === 'undefined') {
            a++
        }
        else if (excelRows[index-1]['Engine Speed [RPM]'] > 800 && excelRows[index-1]['Transmission Current Gear'] > 0 ) {
            sTimeF(index-1)
            let sTimeTwo = excelRows[index]['Sample Time'].split(' ');
            let sTimeDay = sTimeTwo[0].split('/')
            sTimeDay = sTimeDay[1]
            console.log(`this is end time: ${tempSTimeDay}d ${tempSTimeHour}h ${tempSTimeMinute}m`);
            console.log(`this is start time: ${sTimeDay}d ${sTimeHour}h ${sTimeMinute}m`);
            a = 1
            let dDay = tempSTimeDay - sTimeDay
            let dHour = tempSTimeHour - sTimeHour
            let dMinute = tempSTimeMinute - sTimeMinute
            if (dHour < 0 || dMinute < 0){
                if (dHour < 0 && dMinute >= 0) {
                dDay = dDay - 1
                dHour = dHour + 24
                }
                else if (dHour > 0 && dMinute < 0){
                    dHour = dHour - 1
                    dMinute = dMinute + 60
                }
            }
            else{}
            let totalMinuteAdded = dDay*1440 + dHour*60 + dMinute
            console.log(totalMinuteAdded);
            totalMinute += totalMinuteAdded
            console.log(totalMinute);

            
        }
        
    }
    document.getElementById('totalMinutes').innerText = `${Math.round(totalMinute/60)} hours`
};

