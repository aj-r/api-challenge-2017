precisionRunes = new Set([8005, 8008, 8021, 9101, 9111, 8009, 9104, 9105, 9103, 8014, 8017, 8299])
dominationRunes = new Set([8112, 8124, 8128, 8126, 8139, 8143, 8136, 8120, 8138, 8135, 8134, 8105])
sorceryRunes = new Set([8214, 8229, 8230, 8224, 8226, 8243, 8210, 8234, 8233, 8237, 8232, 8236])
resolveRunes = new Set([8437, 8439, 8465, 8242, 8446, 8463, 8430, 8435, 8429, 8451, 8453, 8444])
inspirationRunes = new Set([8326, 8351, 8359, 8306, 8345, 8313, 8304, 8321, 8316, 8347, 8410, 8339])

$(document).ready(function(){
    $('.runeTreeIcon').hover(
        function() {$(this).addClass('runeTreeHover')},
        function() {$(this).removeClass('runeTreeHover')});
        
    function onClickRuneTreeSelectorReset() {
        $('#precisionTreeSelector').removeClass('runeTreeIconSelected');
        $('#dominationTreeSelector').removeClass('runeTreeIconSelected');
        $('#sorceryTreeSelector').removeClass('runeTreeIconSelected');
        $('#resolveTreeSelector').removeClass('runeTreeIconSelected');
        $('#inspirationTreeSelector').removeClass('runeTreeIconSelected');
        $('#precisionTree').addClass('gone');
        $('#dominationTree').addClass('gone');
        $('#sorceryTree').addClass('gone');
        $('#resolveTree').addClass('gone');
        $('#inspirationTree').addClass('gone');
        $('#mostCommonRune').addClass('gone');
    }
        
    $('#precisionTreeSelector').click(
        function() {
            onClickRuneTreeSelectorReset();
            $('#precisionTreeSelector').addClass('runeTreeIconSelected');
            $('#precisionTree').removeClass('gone');
        });
        
    $('#dominationTreeSelector').click(
        function() {
            onClickRuneTreeSelectorReset();
            $('#dominationTreeSelector').addClass('runeTreeIconSelected');
            $('#dominationTree').removeClass('gone');
        });
        
    $('#sorceryTreeSelector').click(
        function() {
            onClickRuneTreeSelectorReset();
            $('#sorceryTreeSelector').addClass('runeTreeIconSelected');
            $('#sorceryTree').removeClass('gone');
        });
    
    $('#resolveTreeSelector').click(
        function() {
            onClickRuneTreeSelectorReset();
            $('#resolveTreeSelector').addClass('runeTreeIconSelected');
            $('#resolveTree').removeClass('gone');
        });
        
    $('#inspirationTreeSelector').click(
        function() {
            onClickRuneTreeSelectorReset();
            $('#inspirationTreeSelector').addClass('runeTreeIconSelected');
            $('#inspirationTree').removeClass('gone');
        });
        
    $('.rune').hover(
        function() {$(this).addClass('runeHover')},
        function() {$(this).removeClass('runeHover')});

    $('.rune').click(
        function() {
            $('.rune').removeClass('runeSelected');
            $(this).addClass('runeSelected');

            var runeId = parseInt($(this).attr('id'));
            var iteratePrecisionRunes = !(precisionRunes.has(runeId));
            var iterateDominationRunes = !(dominationRunes.has(runeId));
            var iterateSorceryRunes = !(sorceryRunes.has(runeId));
            var iterateResolveRunes = !(resolveRunes.has(runeId));
            var iterateInspirationRunes = !(inspirationRunes.has(runeId));

            var max = 0;
            var maxRuneId = 0;
            if (iteratePrecisionRunes) {
                for (let precisionRuneId of precisionRunes.keys()) {
                    if (data[runeId] && data[runeId].data[precisionRuneId]) {
                        var count = data[runeId].data[precisionRuneId].count;
                        if (count > max) {
                            max = count;
                            maxRuneId = precisionRuneId;
                        }
                    }
                }
            }
            if (iterateDominationRunes) {
                for (let dominationRuneId of dominationRunes.keys()) {
                    if (data[runeId] && data[runeId].data[dominationRuneId]) {
                        var count = data[runeId].data[dominationRuneId].count;
                        if (count > max) {
                            max = count;
                            maxRuneId = dominationRuneId;
                        }
                    }
                }
            }
            if (iterateSorceryRunes) {
                for (let sorceryRuneId of sorceryRunes.keys()) {
                    if (data[runeId] && data[runeId].data[sorceryRuneId]) {
                        var count = data[runeId].data[sorceryRuneId].count;
                        if (count > max) {
                            max = count;
                            maxRuneId = sorceryRuneId;
                        }
                    }
                }
            }
            if (iterateResolveRunes) {
                for (let resolveRuneId of resolveRunes.keys()) {
                    if (data[runeId] && data[runeId].data[resolveRuneId]) {
                        var count = data[runeId].data[resolveRuneId].count;
                        if (count > max) {
                            max = count;
                            maxRuneId = resolveRuneId;
                        }
                    }
                }
            }
            if (iterateInspirationRunes) {
                for (let inspirationRuneId of inspirationRunes.keys()) {
                    if (data[runeId] && data[runeId].data[inspirationRuneId]) {
                        var count = data[runeId].data[inspirationRuneId].count;
                        if (count > max) {
                            max = count;
                            maxRuneId = inspirationRuneId;
                        }
                    }
                }
            }

            $('#mostCommonRune').removeClass('gone');
            $('#mostCommonRune').attr('src', 'img/runesReforged/perk/' + maxRuneId + '.png');
        });
});