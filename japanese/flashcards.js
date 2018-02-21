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
        this.currentWord    = [];
        this.wordBank       = [];
        this.completedWords = [];
        this.setUpFlashcards();
        this.getNextWord();
    },

    setUpData : function () {
        this.categories = this.data.categories;
        for (category in this.categories) {
            options.selectedCategories[category] = true;
        }
    },
    
    setUpFlashcards : function () {
        options.setUpAndDisplayCategories();
        for (selectedCategory in options.selectedCategories) {
            if (options.selectedCategories[selectedCategory]) {
                for (category in this.categories[selectedCategory]) {
                    this.wordBank.push(this.categories[selectedCategory][category]);
                }
            }
        }
        this.wordBank = shuffle(this.wordBank);
    },

    getPrevWord : function () {
        if (this.currentWord.length != 0) {
            this.wordBank.unshift(this.currentWord);
        }
        if (this.completedWords.length > 0) {
            this.currentWord = this.completedWords.pop();
        } else {
            this.currentWord = [];
        }
        this.displayWord();
    },

    getNextWord : function () {
        if (this.currentWord.length != 0) {
            this.completedWords.push(this.currentWord);
        }
        if (this.wordBank.length > 0) {
            this.currentWord = this.wordBank.shift();
        } else {
            this.currentWord = [];
        }
        this.displayWord();
    },

    displayWord : function () {
        $("#translation").hide();
        $("#word").show();
        if (this.currentWord.length != 0) {
            furigana = $("#furigana").html(this.currentWord["furigana"]);
            $("#kanji").html(this.currentWord["word"]);
            $("#kanji").append(furigana);
            $("#translation").html(this.currentWord["translation"]);
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
        $("#furigana").toggle(this.furigana);
        $("#furigana-button").toggleClass("option-selected", this.furigana);
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
                .toggleClass("option-selected", this.selectedCategories[category])
                .attr("id", category)
                .appendTo("#categories");
        }
        for (selectedCategory in this.selectedCategories) {
            $("#" + this.selectedCategories[selectedCategory]).addClass("option-selected");
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