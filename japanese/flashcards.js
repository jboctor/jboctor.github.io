$(document).ready(function () {
    var currentWord;
    var wordBank       = [];
    var completedWords = [];

    $("#translation").hide();
    $.ajax({
        url: "/japanese/wordbank.json"
    }).done(function (data) {
        console.log(data);
        setUpFlashCards(JSON.parse(data));
        getNextWord();
    });

    var setUpFlashCards = function (words) {
        categories = words.categories;
        for (category in categories) {
            for (word in categories[category]) {
                wordBank.unshift(categories[category][word]);
            }
        }
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
    };

    var getNextWord = function () {
        currentWord = wordBank.pop();
        $("#word").html(
            "<ruby>" + currentWord["word"] + "<rt>" + currentWord["furigana"] + "</rt></ruby>"
        )
        $("#translation").html(currentWord["translation"]);
    }
});