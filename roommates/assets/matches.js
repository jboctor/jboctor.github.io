var matches = {
    init: function () {
        matches.submitListener();
    },
    
    submitListener: function () {
        $('#matches-form').on('submit', function (e) {
            e.preventDefault();
            file = $('#matches-form-file').prop('files')[0];
            reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (){
                matches.handleCsv(reader.result);
            };
            return false;
        })
    },

    handleCsv: function (contents) {
        parsedContents      = Papa.parse(contents);
        parsedContentsData  = parsedContents.data;
        parsedContentsData2 = JSON.parse(JSON.stringify(parsedContentsData));
        matchedPeople       = {};
        for(var i = parsedContentsData2.length - 1; i >= 0; i--) {
            row   = parsedContentsData[i];
            row2  = parsedContentsData2.splice(Math.floor(Math.random() * parsedContentsData2.length), 1)[0];
            name  = row[0].toLowerCase() + ' ' + row[1].toLowerCase();
            name2 = row2[0].toLowerCase() + ' ' + row2[1].toLowerCase();
            if (name == name2) {
                parsedContentsData2.push(row2);
                i++;
                continue;
            }
            matchedPeople[name] = name2;
        }
        matches.printMatches(matchedPeople);
    },

    printMatches: function (matches) {
        var table = $('<table class="table"></table>')
        Object.keys(matches).forEach(function (key) {
            table.append('<tr><td>' + key + '</td>' + '<td>' + matches[key] + '</td></tr>');
        });
        $('#matches').html(table);
    }
}

$(document).ready(function (){
    matches.init();
});
