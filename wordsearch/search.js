var wordSearch = {
    possibleChars : [
        ['a', 8.12],
        ['b', 1.49],
        ['c', 2.71],
        ['d', 4.32],
        ['e', 12.02],
        ['f', 2.30],
        ['g', 2.03],
        ['h', 5.92],
        ['i', 7.31],
        ['j', 0.10],
        ['k', 0.69],
        ['l', 3.98],
        ['m', 2.61],
        ['n', 6.95],
        ['o', 7.68],
        ['p', 1.82],
        ['q', 0.11],
        ['r', 6.02],
        ['s', 6.28],
        ['t', 9.10],
        ['u', 2.88],
        ['v', 1.11],
        ['w', 2.09],
        ['x', 0.17],
        ['y', 2.11],
        ['z', 0.07]
    ],
    gridSize : 0,
    grid : null,
    track: [],
    createGrid : function (size)
    {
        var chars = this.createWeightedChars();
        this.gridSize = size;
        this.grid = {};
        for (i = 0; i < this.gridSize; i++) {
            this.grid[i] = {};
            for (j = 0; j < this.gridSize; j++) {
                this.grid[i][j] = chars[
                    Math.floor(
                        Math.random() * chars.length
                        )
                ];
            }
        }
    },

    createWeightedChars : function ()
    {
        var weightedChars = [];
        for (i = 0; i < this.possibleChars.length; i++) {
            var letter    = this.possibleChars[i][0];
            var multiples = this.possibleChars[i][1] * 100;
            for (j = 0; j < multiples; j++) {
                weightedChars.push(letter);
            }
        }
        return weightedChars;
    },

    printGrid : function()
    {
        var gridHtml = '';
        for (i = 0; i < this.gridSize; i++) {
            gridHtml = gridHtml.concat('<div class="row justify-content-center">');
            for (j = 0; j < this.gridSize; j++) {
                gridHtml = gridHtml.concat('<div class="col-auto text-monospace" id="' + i + '-' + j +'">' + this.grid[i][j] + '</div>');
            }
            gridHtml = gridHtml.concat('</div>');
        }
        $('#grid').html(gridHtml);
        return gridHtml;
    },

    isPresent : function (word, searchGrid)
    {
        if (word == '') {
            return true;
        }
        var letter = word.substr(0, 1);
        word = word.substr(1);
        for (var i in searchGrid) {
            for (var j in searchGrid[i]) {
                if (searchGrid[i][j] == letter) {
                    this.track.push([i, j]);
                    if (this.isPresent(word, this.createNewSearchGrid(parseInt(i), parseInt(j)))) {
                        return true;
                    }
                }
            }
        }
        this.track.pop();
        return false;
    },

    createNewSearchGrid : function (x, y)
    {
        var newGrid = {};
        for (var i = x - 1; i <= x + 1; i++) {
            newGrid[i] = {};
            for (var j = y - 1; j <= y + 1; j++) {
                if (i > -1 && i < this.gridSize &&
                    j > -1 && j < this.gridSize &&
                    !(i == x && j == y) &&
                    this.hasNotBeenUsed(i, j))
                {
                    newGrid[i][j] = this.grid[i][j];
                } else {
                    newGrid[i][j] = '';
                }
            }
        }
        return newGrid;
    },

    hasNotBeenUsed : function (x, y)
    {
        for (var i = 0; i < this.track.length; i++){
            if (this.track[i][0] == x && this.track[i][1] == y) {
                return false;
            }
        }
        return true;
    },

    paintPath : function ()
    {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < this.gridSize; j++) {
                var id = i + "-" + j;
                $('#' + id).removeClass('bg-primary')
            }
        }
        for (var i = 0; i < this.track.length; i++) {
            var id = this.track[i][0] + "-" + this.track[i][1];
            $('#' + id).addClass('bg-primary')
        }
    }
}

var form = {
    intialize : function ()
    {
        $('#word').select();
        $('#word').on('keyup', function (e) {
            if (e.keyCode == 13) {
                wordSearch.track = [];
                var isPresent = wordSearch.isPresent(this.value.toLowerCase(), wordSearch.grid);
                wordSearch.paintPath();
                if (isPresent) {
                    $('#present').removeClass('d-none');
                    $('#notPresent').addClass('d-none');
                } else {
                    $('#present').addClass('d-none');
                    $('#notPresent').removeClass('d-none');
                }
                $(this).select();
            }
        });
        $('#gridSize').on('input change', function (e) {
            $('#gridSizeLabel').html(this.value + ' x ' + this.value);
            wordSearch.createGrid(this.value);
            wordSearch.printGrid();
            $('#word').select();
        });
    }
}

$(document).ready(function () {
    wordSearch.createGrid(10);
    wordSearch.printGrid();
    form.intialize();
});