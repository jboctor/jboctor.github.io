var currentWord;
var wordBank;
var completedWords;
$(document).ready(function () {
    $.ajax({
        url: "/japanese/wordbank.json",
        dataType: "json"
    }).done(function (data) {
        reset();
        setUpFlashCards(data);
        setUpPrevNextButtons();
        getNextWord();
    });

    var reset = function () {
        currentWord    = [];
        wordBank       = [];
        completedWords = [];
    }

    var setUpFlashCards = function (words) {
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
    }

    var getPrevWord = function () {
        if (completedWords.length > 0) {
            if (currentWord.length != 0) {
                wordBank.unshift(currentWord);
            }
            currentWord = completedWords.pop();
            displayWord();
        }
    }

    var getNextWord = function () {
        if (wordBank.length > 0) {
            if (currentWord.length != 0) {
                completedWords.push(currentWord);
            }
            currentWord = wordBank.shift();
            displayWord();
        }
    }

    var displayWord = function () {
        $("#translation").hide();
        $("#word").show();
        if (currentWord.length != 0) {
            $("#word").html(
                "<ruby>" + currentWord["word"] + "<rt>" + currentWord["furigana"] + "</rt></ruby>"
            )
            $("#translation").html(currentWord["translation"]);
        }
    }

    var setUpPrevNextButtons = function () {
        $("#prev").click(function () {
            getPrevWord();
        });
        $("#next").click(function () {
            getNextWord();
        });
    }
});