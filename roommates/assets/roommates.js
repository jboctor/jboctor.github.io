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
                if (row[0][6] == 'Male') {
                    males.push(row);
                } else {
                    females.push(row);
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
            var room = rooms.pop();
            var remainingPeople = parseInt(room[0][4]) - room.length;
            for (var i = 0; i < rooms.length; i++) {
                var otherRoom = rooms[i];
                var otherRemainingPeople = parseInt(otherRoom[0][4]) - otherRoom.length;
                if (room[0][4] == otherRoom[0][4] && remainingPeople == otherRoom.length && otherRemainingPeople == room.length) {
                    room = room.concat(rooms.splice(i, 1)[0]);
                    complete.push(room);
                    break;
                }
            }
            if (room.length != room[0][4]) {
                incomplete.push(room);
            }
        }
        while (incomplete.length > 0) {
            var room = incomplete.pop();
            var i = incomplete.length
            while (i--) {
                var remainingPeople = parseInt(room[0][4]) - room.length;
                var otherRoom = incomplete[i];
                if (room[0][4] == otherRoom[0][4] && otherRoom.length <= remainingPeople) {
                    room = room.concat(incomplete.splice(i, 1)[0]);
                    if (room[0][4] == room.length) {
                        complete.push(room);
                        break;
                    }
                }
            }   
            if (room.length != room[0][4]) {
                incompleteAgain.push(room);
            }
        }
        return [complete, incompleteAgain];
    },
    
    printRoommates: function (roommates) {
        var table = $('<table class="table"></table>')
        for (var i = 0; i < roommates.length; i++) {
            var row = $('<tr></tr>');
            switch (roommates[i][0][4]) {
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
                if (j < roommates[i].length) {
                    row.append(
                        '<td>'
                        + roommates[i][j][0].toLowerCase()
                        + ' '
                        + roommates[i][j][1].toLowerCase()
                        + '<br />'
                        + roommates[i][j][2].toLowerCase()
                        + '<br />'
                        + roommates[i][j][5].toLowerCase()
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
            switch (leftovers[i][0][4]) {
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
            row.append('<th scope="row">' + word + ' occupancy room</th>');
            for (var j = 0; j < 4; j++) {
                if (j < leftovers[i].length) {
                    row.append(
                        '<td>'
                        + leftovers[i][j][0].toLowerCase()
                        + ' '
                        + leftovers[i][j][1].toLowerCase()
                        + '<br />'
                        + leftovers[i][j][2].toLowerCase()
                        + '<br />'
                        + leftovers[i][j][5].toLowerCase()
                        + '</td>'
                    );
                } else {
                    row.append('<td></td>');
                }
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
