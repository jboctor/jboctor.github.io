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
        numberOfGroups     = 10;
        groupedPeople      = new Array(numberOfGroups);
        for(var i = parsedContentsData.length - 1; i >= 0; i--) {
            row   = parsedContentsData.splice(Math.floor(Math.random() * parsedContentsData.length), 1)[0];
            name  = row[0].toLowerCase() + ' ' + row[1].toLowerCase();
            index = i % numberOfGroups;

            groupedPeople[index] = groupedPeople[index] || [];
            groupedPeople[index].push(name);
        }
        groups.printgroups(groupedPeople, $('#groups'));
    },

    printgroups: function (groups, element) {
        element.html('');
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            var table = $('<table class="table"></table>')
            for (var j = 0; j < group.length; j++) {
                if (j % 4 == 0) {
                    var row = $('<tr></tr>');
                    table.append(row);
                }
                row.append('<td>' + group[j] + '</td>');
            }
            element.append('<div class="row"><div class="col"><h2>group ' + (i + 1) + '</h2></div></div>');
            element.append('<div class="row"><div class="col"><div class="container-fluid" id="group1">' + $('<div>').append(table.clone()).html() + '</div></div></div>');
        }
    }
}

$(document).ready(function (){
    groups.init();
});
