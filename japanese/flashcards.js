$(document).ready(function () {
    $.ajax({
        url : "/japanese/wordbank.json",
        dataType : "json"
    }).done(function (data) {
        flashCard.reset();
        flashCard.setUpFlashCards(data);
        flashCard.setUpPrevNextButtons();
        flashCard.getNextWord();
    });
});

var flashCard = {
    currentWord : [],
    wordBank : [],
    completedWords : [],

    reset : function () {
        this.currentWord    = [];
        this.wordBank       = [];
        this.completedWords = [];
    },

    setUpFlashCards : function (words) {
        categories = words.categories;
        for (category in categories) {
            for (word in categories[category]) {
                this.wordBank.push(categories[category][word]);
            }
        }
        this.wordBank = shuffle(this.wordBank);
        $("#translation").hide();
        $("#flashcard").click(function () {
            flipped = $("#translation").is(":visible");
            if (flipped) {
                $("#translation").hide();
                $("#word").show();
            } else {
                $("#translation").show();
                $("#word").hide();
            }
        })
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
            $("#word").html(
                "<ruby>" + this.currentWord["word"] + "<rt>" + this.currentWord["furigana"] + "</rt></ruby>"
            )
            $("#translation").html(this.currentWord["translation"]);
        }
    },

    setUpPrevNextButtons : function () {
        $("#prev").click(function () {
            flashCard.getPrevWord();
        });
        $("#next").click(function () {
            flashCard.getNextWord();
        });
    }
};