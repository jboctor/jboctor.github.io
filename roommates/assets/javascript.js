var roommates = {
    init: function () {
        roommates.submitListener();
    },
    submitListener: function () {
        $('#roommates-form').on('submit', function (e) {
            e.preventDefault();
            file = $('#roommates-form-file').prop('files')[0];
            reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (){
                roommates.handleCsv(reader.result);
            };
            return false;
        })
    },
    handleCsv: function (contents) {
        rooms = [];
        parsedContents = Papa.parse(contents);
        parsedContentsLength = parsedContents.data.length;
        for (i = 0; i < parsedContentsLength; i++) {
            row = parsedContents.data[i];
            if (row[5] in rooms) {
                rooms[row[5]].push(row[0] + ' ' + row[1]);
            } else {
                rooms[row[5]] = [row[0] + ' ' + row[1]];
            }
        }
        console.log(rooms);
    }
}

$(document).ready(function (){
    roommates.init();
});