var roommates = {
    headers: {
        firstName: null,
        lastName: null,
        email: null,
        church: null,
        roommateCode: null,
        gender: null,
        occupants: 0
    },

    init: function () {
        roommates.submitListener();
    },

    getHeaderRows: function (row) {
        for (i =0; i < row.length; i++) {
            if ($('#first-name').val().toLowerCase() == row[i].toLowerCase()) {
                roommates.headers.firstName = i;
                break;
            }
        }
        for (i =0; i < row.length; i++) {
            if ($('#last-name').val().toLowerCase() == row[i].toLowerCase()) {
                roommates.headers.lastName = i;
                break;
            }
        }
        for (i =0; i < row.length; i++) {
            if ($('#email').val().toLowerCase() == row[i].toLowerCase()) {
                roommates.headers.email = i;
                break;
            }
        }
        for (i =0; i < row.length; i++) {
            if ($('#church').val().toLowerCase() == row[i].toLowerCase()) {
                roommates.headers.church = i;
                break;
            }
        }
        for (i =0; i < row.length; i++) {
            if ($('#roommate-code').val().toLowerCase() == row[i].toLowerCase()) {
                roommates.headers.roommateCode = i;
                break;
            }
        }
        for (i =0; i < row.length; i++) {
            if ($('#gender').val().toLowerCase() == row[i].toLowerCase()) {
                roommates.headers.gender = i;
                break;
            }
        }
        for (var key in roommates.headers) {
            if (roommates.headers[key] == null) {
            }
        }
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
        roommates.getHeaderRows(parsedContentsData.shift());
        while (parsedContentsData.length > 0) {
            row = parsedContentsData.shift();
            if (row[roommates.headers.roommateCode] in rooms) {
                rooms[row[roommates.headers.roommateCode]].unshift(row);
            } else {
                rooms[row[roommates.headers.roommateCode]] = [row];
            }
        }
        for (key in rooms) {
            row = rooms[key];
            if (row[0][roommates.headers.occupants] == row.length) {
                complete.unshift(row);
            } else {
                if (row[0][roommates.headers.gender].toLowerCase() == 'male') {
                    males.unshift(row);
                } else {
                    females.unshift(row);
                }
            }
        }
        doneMales   = roommates.handleLeftOvers(males);
        doneFemales = roommates.handleLeftOvers(females);
        complete    = complete.concat(doneMales[0]);
        complete    = complete.concat(doneFemales[0]);
        leftovers   = doneMales[1].concat(doneFemales[1]);
        roommates.updateSummary(complete, leftovers);
        roommates.printRoommates(complete);
        roommates.printLeftOvers(doneMales[1], $('#leftover-males'));
        roommates.printLeftOvers(doneFemales[1], $('#leftover-females'));
    },
    
    handleLeftOvers: function (rooms) {
        var complete = [];
        var incomplete = [];
        var incompleteAgain = [];
        while (rooms.length > 0) {
            var room = rooms.shift();
            var remainingPeople = parseInt(room[0][roommates.headers.occupants]) - room.length;
            for (var i = 0; i < rooms.length; i++) {
                var otherRoom = rooms[i];
                var otherRemainingPeople = parseInt(otherRoom[0][roommates.headers.occupants]) - otherRoom.length;
                if (room[0][roommates.headers.occupants] == otherRoom[0][roommates.headers.occupants] && remainingPeople == otherRoom.length && otherRemainingPeople == room.length) {
                    room = room.concat(rooms.splice(i, 1)[0]);
                    complete.unshift(room);
                    break;
                }
            }
            if (room.length != room[0][roommates.headers.occupants]) {
                incomplete.unshift(room);
            }
        }
        while (incomplete.length > 0) {
            var room = incomplete.shift();
            var i = incomplete.length
            while (i--) {
                var remainingPeople = parseInt(room[0][roommates.headers.occupants]) - room.length;
                var otherRoom = incomplete[i];
                if (room[0][roommates.headers.occupants] == otherRoom[0][roommates.headers.occupants] && otherRoom.length <= remainingPeople) {
                    room = room.concat(incomplete.splice(i, 1)[0]);
                    if (room[0][roommates.headers.occupants] == room.length) {
                        complete.unshift(room);
                        break;
                    }
                }
            }   
            if (room.length != room[0][roommates.headers.occupants]) {
                incompleteAgain.unshift(room);
            }
        }
        return [complete, incompleteAgain];
    },
    
    printRoommates: function (roommateses) {
        var table = $('<table class="table"></table>')
        for (var i = 0; i < roommateses.length; i++) {
            var row = $('<tr></tr>');
            switch (roommateses[i][0][roommates.headers.occupants]) {
                case '1':
                    var word = 'single';
                    break;
                case '2':
                    var word = 'double';
                    break;
                case '3':
                    var word = 'triple';
                    break;
                case '4':
                    var word = 'quadruple';
                    break;
                default:
                    var word = 'unknown';
            }
            row.append('<th scope="row">' + word  + ' occupancy room</th>')
            for (var j = 0; j < 4; j++) {
                if (j < roommateses[i].length) {
                    row.append(
                        '<td>'
                        + roommateses[i][j][roommates.headers.firstName].toLowerCase()
                        + ' '
                        + roommateses[i][j][roommates.headers.lastName].toLowerCase()
                        + '<br />'
                        + roommateses[i][j][roommates.headers.email].toLowerCase()
                        + '<br />'
                        + roommateses[i][j][roommates.headers.roommateCode].toLowerCase()
                        + '</td>'
                    );
                } else {
                    row.append('<td></td>');
                }
            }
            table.append(row);
        }
        $('#roommates').html(table);
    },
    
    printLeftOvers: function (leftovers, element) {
        var table = $('<table class="table"></table>')
        for (var i = 0; i < leftovers.length; i++) {
            var row = $('<tr></tr>');
            switch (leftovers[i][0][roommates.headers.occupants]) {
                case '1':
                    var word = 'single';
                    break;
                case '2':
                    var word = 'double';
                    break;
                case '3':
                    var word = 'triple';
                    break;
                case '4':
                    var word = 'quadruple';
                    break;
                default:
                    var word = 'unknown';
            }
            //row.append('<th scope="row">' + word + ' occupancy room</th>');
            row.append('<th scope="row"></th>');
            loop = Math.ceil(leftovers[i].length / 4) * 4;
            for (var j = 0; j < leftovers[i].length; j++) {
                row.append(
                    '<td>'
                    + leftovers[i][j][roommates.headers.firstName].toLowerCase()
                    + ' '
                    + leftovers[i][j][roommates.headers.lastName].toLowerCase()
                    + '<br />'
                    + leftovers[i][j][roommates.headers.email].toLowerCase()
                    + '<br />'
                    + leftovers[i][j][roommates.headers.roommateCode].toLowerCase()
                    + '</td>'
                );
            }
            table.append(row);
        }
        element.html(table);
    },
    
    updateSummary: function (roommates, leftovers) {
        var totalRooms = 0;
        var singleOccupancy = 0;
        var doubleOccupancy = 0;
        var tripleOccupancy = 0;
        var quadrupleOccupancy = 0;
        var leftoversTotal = 0;
        for (var i = 0; i < roommates.length; i++) {
            totalRooms++;
            switch (roommates[i].length) {
                case 1:
                    singleOccupancy++;
                    break;
                case 2:
                    doubleOccupancy++;
                    break;
                case 3:
                    tripleOccupancy++;
                    break;
                case 4:
                    quadrupleOccupancy++;
                    break;
                default:
            }
        }
        for (var i = 0; i < leftovers.length; i++) {
            leftoversTotal += leftovers[i].length;
        }
        $('#total-rooms').text(totalRooms + ' total rooms');
        $('#single-occupancy').text(singleOccupancy + ' single occupancy rooms');
        $('#double-occupancy').text(doubleOccupancy + ' double occupancy rooms');
        $('#triple-occupancy').text(tripleOccupancy + ' triple occupancy rooms');
        $('#quadruple-occupancy').text(quadrupleOccupancy + ' quadruple occupancy rooms');
        $('#leftover-total').text(leftoversTotal + ' leftovers');
    }
}

$(document).ready(function (){
    roommates.init();
});
