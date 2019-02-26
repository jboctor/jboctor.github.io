var wordSearch = {
    possibleChars : 'abcdefghijklmnopqrstuvwxys',
    gridSize : 0,
    grid : null,
    track: [],
    createGrid : function (size)
    {
        this.gridSize = size;
        this.grid = {};
        for (i = 0; i < this.gridSize; i++) {
            this.grid[i] = {};
            for (j = 0; j < this.gridSize; j++) {
                this.grid[i][j] = this.possibleChars.charAt(
                    Math.floor(
                        Math.random() * this.possibleChars.length
                        )
                    );
            }
        }
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
        for (i = x - 1; i <= x + 1; i++) {
                newGrid[i] = {};
                for (j = y - 1; j <= y + 1; j++) {
                    if (i > -1 && i < this.gridSize &&
                        j > -1 && j < this.gridSize)
                    {
                        newGrid[i][j] = this.grid[i][j];
                    } else {
                        newGrid[i][j] = '';
                    }
            }
        }
        return newGrid;
    },

    paintPath : function ()
    {
        for (i = 0; i < this.gridSize; i++) {
            for (j = 0; j < this.gridSize; j++) {
                var id = i + "-" + j;
                $('#' + id).removeClass('bg-primary')
            }
        }
        for (i = 0; i < this.track.length; i++) {
            var id = this.track[i][0] + "-" + this.track[i][1];
            $('#' + id).addClass('bg-primary')
        }
    }
}

$(document).ready(function () {
    wordSearch.createGrid(4);
    wordSearch.printGrid();
    $('#word').focus();
    $('#word').on('keyup', function (e) {
        if (e.keyCode == 13) {
            wordSearch.track = [];
            isPresent = wordSearch.isPresent(this.value.toLowerCase(), wordSearch.grid);
            wordSearch.paintPath();
            if (isPresent) {
                $('#present').removeClass('d-none');
                $('#notPresent').addClass('d-none');
            } else {
                $('#present').addClass('d-none');
                $('#notPresent').removeClass('d-none');
            }
        }
    });
    $('#gridSize').on('input change', function (e) {
        wordSearch.createGrid(this.value);
        wordSearch.printGrid();
    })
});