define([
    "core/js/adapt",
    "core/js/views/componentView",
    "core/js/models/componentModel"
], function (Adapt, ComponentView, ComponentModel) {

    var MemoryGameView = ComponentView.extend({
        events: {
            'click .mg-card': 'flipCard'
        },

        postRender: function () {
            this.hasFlippedCard = false;
            this.lockBoard = false;
            this.firstCard = null;
            this.secondCard = null;
            this.cards = $('.mg-card');
            this.totalPairs = $('.mg-card').length;
            this.pairsFound = 0;

            this.shuffleCards();
        },

        flipCard: function (event) {
            var $card = $(event.target).closest('.mg-card');

            if (this.lockBoard || $card.hasClass('flip')) return;
            if (!this.hasFlippedCard) {
                // primeira carta click
                this.hasFlippedCard = true;
                this.firstCard = $card;
            } else {
                // segunda carta click
                this.secondCard = $card;
                this.checkForMatch();
            }

            $card.addClass('flip');
        },

        checkForMatch: function () {
            const isMatch = this.firstCard.data('framework') === this.secondCard.data('framework');
            isMatch ? this.disableCards() : this.unflipCards();
        },

        disableCards: function () {
            this.firstCard.off('click', this.flipCard.bind(this));
            this.secondCard.off('click', this.flipCard.bind(this));

            this.pairsFound++;
            if (this.pairsFound === this.totalPairs) {
                this.finishGame();
            }
            this.resetBoard();
        },

        unflipCards: function () {
            this.lockBoard = true;

            setTimeout(() => {
                this.firstCard.removeClass('flip');
                this.secondCard.removeClass('flip');

                this.resetBoard();
            }, 1000);
        },

        resetBoard: function () {
            [this.hasFlippedCard, this.lockBoard] = [false, false];
            [this.firstCard, this.secondCard]     = [null, null];
        },

        finishGame: function () {
            var s = this.setCompletionStatus()
            console.log('Parabéns! Você encontrou todos os pares de cartas.', s)
        },

        shuffleCards: function () {
            var $game = $('.memory-game');
            var $cards = $game.find('.mg-card');

            // Duplica as cartas
            $cards.clone().appendTo($game);

            // Embaralha as cartas
            $game.children('.mg-card').each(function () {
                var randomPos = Math.floor(Math.random() * $cards.length);
                $(this).css('order', randomPos);
            });
        },

    });

    var MemoryGameModel = ComponentModel.extend({

    });

    return Adapt.register("memorygame", {
        view: MemoryGameView,
        model: MemoryGameModel
    });

});