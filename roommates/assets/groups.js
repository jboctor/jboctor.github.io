var groups = {
    init: function () {
        groups.submitListener();
    },
    
    submitListener: function () {
        $('#groups-form').on('submit', function (e) {
            e.preventDefault();
            file = $('#groups-form-file').prop('files')[0];
            reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (){
                groups.handleCsv(reader.result);
            };
            return false;
        })
    },

    handleCsv: function (contents) {
        parsedContents     = Papa.parse(contents);
        parsedContentsData = parsedContents.data;
        groupedPeople      = [[], [], [], [], [], [], [], [], [], []];
        for(var i = parsedContentsData.length - 1; i >= 0; i--) {
            row  = parsedContentsData.splice(Math.floor(Math.random() * parsedContentsData.length), 1)[0];
            name = row[0].toLowerCase() + ' ' + row[1].toLowerCase();
            groupedPeople[i % 10].push(name);
        }
        groups.printgroups(groupedPeople[0], $('#group1'));
        groups.printgroups(groupedPeople[1], $('#group2'));
        groups.printgroups(groupedPeople[2], $('#group3'));
        groups.printgroups(groupedPeople[3], $('#group4'));
        groups.printgroups(groupedPeople[4], $('#group5'));
        groups.printgroups(groupedPeople[5], $('#group6'));
        groups.printgroups(groupedPeople[6], $('#group7'));
        groups.printgroups(groupedPeople[7], $('#group8'));
        groups.printgroups(groupedPeople[8], $('#group9'));
        groups.printgroups(groupedPeople[9], $('#group10'));
    },

    printgroups: function (group, element) {
        var table = $('<table class="table"></table>')
        for (var i = 0; i < group.length; i++) {
            if (i % 4 == 0) {
                var row = $('<tr></tr>');
                table.append(row);
            }
            row.append('<td>' + group[i] + '</td>');
        };
        element.html(table);
    }
}

$(document).ready(function (){
    groups.init();
});
