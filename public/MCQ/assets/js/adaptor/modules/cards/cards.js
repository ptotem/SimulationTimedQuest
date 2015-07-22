var cards;

var CardDeck = Entity.extend(function () {
    return {
        createCards: function (cardNames) {
            if (this.items == undefined) this.items = [];
            for (i in cardNames) {
                this.addItem(new Card(cardNames[i]));
            }
            return true;
        },
        loadCards: function (cards) {
            if (this.items == undefined) this.items = [];
            for (i in cards) {
                this.addItem(cards[i]);
            }
            return true;
        },
        shuffle: function () {
            var o = this.items;
            for (var j, x, i = o.length - 1; i; j = ( Math.floor(Math.random() * i) + 1), x = o[--i], o[i] = o[j], o[j] = x);
            this.items = o;
            return true;
        },
        swapDeck: function (deck) {
            var tempDeck = this.items;
            this.items = deck.cards;
            deck.cards = tempDeck;
            return true;
        },
        drawCards: function (count) {
            if (count > this.items.length) {
                $(this).trigger('empty');
                return false;
            }
            var takeOut = [];
            for (var i = 0; i < count; i++) {
                takeOut.push(this.items[0]);
                this.items.splice(0, 1);
            }
            return takeOut;
        },
        cardToTop: function (card) {
            var newDeck = [];
            newDeck.addItems(card);
            newDeck.push(this.items);
            this.items = newDeck;
            return true;
        },
        cardToBottom: function (card) {
            this.addItem(card);
            return true;
        }
    }
});


function initCards() {
    cards = new CardDeck("cards", []);
    loadConfig(cards);
}

