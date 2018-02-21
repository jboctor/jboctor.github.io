$(document).ready(function () {
    $.ajax({
        url : "/japanese/wordbank.json",
        dataType : "json"
    }).done(function (data) {
        flashcard.data = data;
        flashcard.setUpData();
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
    categories : [],

    reset : function () {
        flashcard.currentWord    = [];
        flashcard.wordBank       = [];
        flashcard.completedWords = [];
        flashcard.setUpFlashcards();
        flashcard.getNextWord();
    },

    setUpData : function () {
        flashcard.categories = flashcard.data.categories;
        for (category in flashcard.categories) {
            options.selectedCategories[category] = true;
        }
    },
    
    setUpFlashcards : function () {
        options.setUpAndDisplayCategories();
        for (selectedCategory in options.selectedCategories) {
            if (options.selectedCategories[selectedCategory]) {
                for (category in flashcard.categories[selectedCategory]) {
                    flashcard.wordBank.push(flashcard.categories[selectedCategory][category]);
                }
            }
        }
        flashcard.wordBank = shuffle(flashcard.wordBank);
    },

    getPrevWord : function () {
        if (flashcard.currentWord.length != 0) {
            flashcard.wordBank.unshift(flashcard.currentWord);
        }
        if (this.completedWords.length > 0) {
            flashcard.currentWord = flashcard.completedWords.pop();
        } else {
            flashcard.currentWord = [];
        }
        flashcard.displayWord();
    },

    getNextWord : function () {
        if (flashcard.currentWord.length != 0) {
            flashcard.completedWords.push(flashcard.currentWord);
        }
        if (flashcard.wordBank.length > 0) {
            flashcard.currentWord = flashcard.wordBank.shift();
        } else {
            flashcard.currentWord = [];
        }
        flashcard.displayWord();
    },

    displayWord : function () {
        $("#translation").hide();
        $("#word").show();
        if (flashcard.currentWord.length != 0) {
            furigana = $("#furigana").html(flashcard.currentWord["furigana"]);
            $("#kanji").html(flashcard.currentWord["word"]);
            $("#kanji").append(furigana);
            $("#translation").html(flashcard.currentWord["translation"]);
        } else {
            furigana = $("#furigana").html("");
            $("#kanji").html("");
            $("#kanji").append(furigana);
            $("#translation").html("");
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
    furigana : false,
    selectedCategories : {},

    setUpResetButton : function () {
        $("#reset-button").on("click", function () {
            flashcard.reset();
        })
    },

    setUpDisplayFurigana : function () {
        $("#furigana").toggle(options.furigana);
        $("#furigana-button").toggleClass("option-selected", options.furigana);
        $("#furigana-button").on("click", function () {
            options.furigana = !options.furigana;
            $("#furigana").toggle(options.furigana);
            $(this).toggleClass("option-selected", options.furigana);
        });
    },

    setUpAndDisplayCategories : function () {
        $("#categories").html("");
        for (category in flashcard.categories) {
            $("<div>" + category + "</div>").addClass("col-2 text-center border category option")
                .toggleClass("option-selected", options.selectedCategories[category])
                .attr("id", category)
                .appendTo("#categories");
        }
        for (selectedCategory in options.selectedCategories) {
            $("#" + options.selectedCategories[selectedCategory]).addClass("option-selected");
        }
        $(".category").each(function () {
            $(this).on("click", function () {
                category = $(this).attr("id");
                options.selectedCategories[category] = !options.selectedCategories[category];
                $(this).toggleClass("option-selected", options.selectedCategories[category]);
                flashcard.reset();
            })
        });
    },

    setUpOptions : function () {
        options.setUpResetButton();
        options.setUpDisplayFurigana();
    }
}