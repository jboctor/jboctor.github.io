$(document).ready(function () {
    $.ajax({
        url : "/japanese/wordbank.json",
        dataType : "json"
    }).done(function (data) {
        flashcard.data = data;
        flashcard.reset();
        flashcard.setUpEventListeners();
        options.setUpOptions();
    });
});

var flashcard = {
    data : [],
    currentWord : [],
    wordBank : [],
    completedWords : [],

    reset : function () {
        this.currentWord    = [];
        this.wordBank       = [];
        this.completedWords = [];
        this.setUpFlashcards();
        this.getNextWord();
    },

    setUpFlashcards : function () {
        categories = this.data.categories;
        for (category in categories) {
            for (word in categories[category]) {
                this.wordBank.push(categories[category][word]);
            }
        }
        this.wordBank = shuffle(this.wordBank);
    },

    getPrevWord : function () {
        if (this.completedWords.length > 0) {
            if (this.currentWord.length != 0) {
                this.wordBank.unshift(this.currentWord);
            }
            this.currentWord = this.completedWords.pop();
            this.displayWord();
        }
    },

    getNextWord : function () {
        if (this.wordBank.length > 0) {
            if (this.currentWord.length != 0) {
                this.completedWords.push(this.currentWord);
            }
            this.currentWord = this.wordBank.shift();
            this.displayWord();
        }
    },

    displayWord : function () {
        $("#translation").hide();
        $("#word").show();
        if (this.currentWord.length != 0) {
            wordRuby = $("#word ruby");
            wordRt   = wordRuby.find('rt');
            wordRuby.html(this.currentWord["word"]);
            wordRt.html(this.currentWord["furigana"]);
            wordRuby.append(wordRt);
            
            $("#translation").html(this.currentWord["translation"]);
        }
    },

    setUpEventListeners : function () {
        $("#flashcard").on("click", function () {
            flipped = $("#translation").is(":visible");
            if (flipped) {
                $("#translation").hide();
                $("#word").show();
            } else {
                $("#translation").show();
                $("#word").hide();
            }
        });
        $("#prev").on("click", function () {
            flashcard.getPrevWord();
        });
        $("#next").on("click", function () {
            flashcard.getNextWord();
        });
    }
};

var options = {
    setUpResetButton : function () {
        $("#reset").on("click", function () {
            flashcard.reset();
        })
    },

    setUpDisplayFurigana : function () {
        $("#display-furigana").on("change", function () {
            if ($(this).is(":checked")) {
                $("rt").each(function () {
                    $(this).show();
                });
            } else {
                $("rt").each(function () {
                    $(this).hide();
                });
            }
        });
    },

    setUpOptions : function () {
        options.setUpResetButton();
        options.setUpDisplayFurigana();
    }
}