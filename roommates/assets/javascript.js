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
        complete = []
        females = [];
        males = []
        rooms = [];
        parsedContents = Papa.parse(contents);
        parsedContentsData = parsedContents.data;
        parsedContentsLength = parsedContentsData.length;
        while (parsedContentsData.length > 0) {
            row = parsedContentsData.pop();
            if (row[5] in rooms) {
                rooms[row[5]].push(row);
            } else {
                rooms[row[5]] = [row];
            }
        }
        for (key in rooms) {
            row = rooms[key];
            if (row[0][4] == row.length) {
                complete.push(row);
            } else {
                if (row[0][6] == 'm') {
                    males.push(row);
                } else {
                    females.push(row);
                }
            }
        }
        doneMales = roommates.handleLeftOvers(males);
        doneFemales = roommates.handleLeftOvers(females);
        complete = complete.concat(doneMales[0]);
        complete = complete.concat(doneFemales[0]);
        roommates.printRoommates(complete);
        roommates.printLeftOvers(doneMales[1].concat(doneFemales[1]));
    },
    handleLeftOvers: function (rooms) {
        complete = [];
        incomplete = [];
        incompleteAgain = [];
        while (rooms.length > 0) {
            room = rooms.pop();
            remainingRoommates = parseInt(room[0][4]) - room.length;
            for (i = 0; i < rooms.length; i++) {
                otherRemainingRoommates = parseInt(rooms[i][0][4]) - rooms[i].length;
                if (remainingRoommates == rooms[i].length && otherRemainingRoommates == room.length) {
                    room = room.concat(rooms.splice(i, 1)[0]);
                    complete.push(room);
                    break;
                }
            }
            if (parseInt(room[0][4]) - room.length != 0) {
                incomplete.push(room);
            }
        }
        while (incomplete.length > 0) {
            room = incomplete.pop();
            for (i = 0; i < incomplete.length; i++) {
                remainingRoommates = parseInt(room[0][4]) - room.length;
                if (remainingRoommates == 0) {
                    complete.push(room);
                    break;
                }
                if (incomplete[i][0][4] == room[0][4] && incomplete[i].length <= remainingRoommates) {
                    room = room.concat(incomplete.splice(i, 1)[0]);
                }
            }
            if (parseInt(room[0][4]) - room.length != 0) {
                incompleteAgain.push(room);
            }
        }
        console.log(incomplete);
        console.log(complete);
        return [complete, incompleteAgain];
    },
    printRoommates: function (roommates) {
        console.log(roommates);
    },
    printLeftOvers: function (leftovers) {
        console.log(leftovers);
    }
}

$(document).ready(function (){
    roommates.init();
});