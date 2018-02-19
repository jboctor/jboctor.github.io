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
        currentWord    = [];
        wordBank       = [];
        completedWords = [];
    },

    setUpFlashCards : function (words) {
        categories = words.categories;
        for (category in categories) {
            for (word in categories[category]) {
                wordBank.push(categories[category][word]);
            }
        }
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
        if (completedWords.length > 0) {
            if (currentWord.length != 0) {
                wordBank.unshift(currentWord);
            }
            currentWord = completedWords.pop();
            flashCard.displayWord();
        }
    },

    getNextWord : function () {
        if (wordBank.length > 0) {
            if (currentWord.length != 0) {
                completedWords.push(currentWord);
            }
            currentWord = wordBank.shift();
            flashCard.displayWord();
        }
    },

    displayWord : function () {
        $("#translation").hide();
        $("#word").show();
        if (currentWord.length != 0) {
            $("#word").html(
                "<ruby>" + currentWord["word"] + "<rt>" + currentWord["furigana"] + "</rt></ruby>"
            )
            $("#translation").html(currentWord["translation"]);
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