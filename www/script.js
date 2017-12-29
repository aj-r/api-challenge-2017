precisionRunes = new Set([8005, 8008, 8021, 9101, 9111, 8009, 9104, 9105, 9103, 8014, 8017, 8299])
dominationRunes = new Set([8112, 8124, 8128, 8126, 8139, 8143, 8136, 8120, 8138, 8135, 8134, 8105])
sorceryRunes = new Set([8214, 8229, 8230, 8224, 8226, 8243, 8210, 8234, 8233, 8237, 8232, 8236])
resolveRunes = new Set([8437, 8439, 8465, 8242, 8446, 8463, 8430, 8435, 8429, 8451, 8453, 8444])
inspirationRunes = new Set([8326, 8351, 8359, 8306, 8345, 8313, 8304, 8321, 8316, 8347, 8410, 8339])

$(document).ready(function(){
    var selectedPrimaryRune = 0;

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
        $('.rune').removeClass('runeSelected');
        $('#secondaryRunes').addClass('gone');
        $('#secondaryRunesHeader').addClass('gone');
        $('.secondaryRune').removeClass('runeSelected');
        $('#champions').addClass('gone');
        $('#championsHeader').addClass('gone');
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

    $('.secondaryRune').hover(
        function() {$(this).addClass('runeHover')},
        function() {$(this).removeClass('runeHover')});

    $('.rune').click(
        function() {
            $('.rune').removeClass('runeSelected');
            $('.secondaryRune').removeClass('runeSelected');
            $(this).addClass('runeSelected');
            $('#champions').addClass('gone');
            $('#championsHeader').addClass('gone');

            selectedPrimaryRune = parseInt($(this).attr('id'));
            var iteratePrecisionRunes = !(precisionRunes.has(selectedPrimaryRune));
            var iterateDominationRunes = !(dominationRunes.has(selectedPrimaryRune));
            var iterateSorceryRunes = !(sorceryRunes.has(selectedPrimaryRune));
            var iterateResolveRunes = !(resolveRunes.has(selectedPrimaryRune));
            var iterateInspirationRunes = !(inspirationRunes.has(selectedPrimaryRune));

            var comparator = function(a, b) {
                if (a[0] < b[0]) {
                    return -1;
                } else if (a[0] > b[0]) {
                    return 1;
                }
                return 0;
            }

            // This will be sorted by max occurrences from least to greatest, and
            // stores them as [number of occurrences, rune ID]
            var max = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
            if (iteratePrecisionRunes) {
                for (let precisionRuneId of precisionRunes.keys()) {
                    if (data[selectedPrimaryRune] && data[selectedPrimaryRune].data[precisionRuneId]) {
                        var count = data[selectedPrimaryRune].data[precisionRuneId].count;
                        if (count > max[0][0]) {
                            max.push([count, precisionRuneId]);
                            max.sort(comparator);
                            max.shift();
                        }
                    }
                }
            }
            if (iterateDominationRunes) {
                for (let dominationRuneId of dominationRunes.keys()) {
                    if (data[selectedPrimaryRune] && data[selectedPrimaryRune].data[dominationRuneId]) {
                        var count = data[selectedPrimaryRune].data[dominationRuneId].count;
                        if (count > max[0][0]) {
                            max.push([count, dominationRuneId]);
                            max.sort(comparator);
                            max.shift();
                        }
                    }
                }
            }
            if (iterateSorceryRunes) {
                for (let sorceryRuneId of sorceryRunes.keys()) {
                    if (data[selectedPrimaryRune] && data[selectedPrimaryRune].data[sorceryRuneId]) {
                        var count = data[selectedPrimaryRune].data[sorceryRuneId].count;
                        if (count > max[0][0]) {
                            max.push([count, sorceryRuneId]);
                            max.sort(comparator);
                            max.shift();
                        }
                    }
                }
            }
            if (iterateResolveRunes) {
                for (let resolveRuneId of resolveRunes.keys()) {
                    if (data[selectedPrimaryRune] && data[selectedPrimaryRune].data[resolveRuneId]) {
                        var count = data[selectedPrimaryRune].data[resolveRuneId].count;
                        if (count > max[0][0]) {
                            max.push([count, resolveRuneId]);
                            max.sort(comparator);
                            max.shift();
                        }
                    }
                }
            }
            if (iterateInspirationRunes) {
                for (let inspirationRuneId of inspirationRunes.keys()) {
                    if (data[selectedPrimaryRune] && data[selectedPrimaryRune].data[inspirationRuneId]) {
                        var count = data[selectedPrimaryRune].data[inspirationRuneId].count;
                        if (count > max[0][0]) {
                            max.push([count, inspirationRuneId]);
                            max.sort(comparator);
                            max.shift();
                        }
                    }
                }
            }

            $('#secondaryRunes').removeClass('gone');
            $('#secondaryRunesHeader').removeClass('gone');
            $('#mostCommonRune1').attr('src', 'img/runesReforged/perk/' + max[4][1] + '.png');
            $('#mostCommonRune1').prop('runeId', max[4][1]);
            $('#mostCommonRune2').attr('src', 'img/runesReforged/perk/' + max[3][1] + '.png');
            $('#mostCommonRune2').prop('runeId', max[3][1]);
            $('#mostCommonRune3').attr('src', 'img/runesReforged/perk/' + max[2][1] + '.png');
            $('#mostCommonRune3').prop('runeId', max[2][1]);
            $('#mostCommonRune4').attr('src', 'img/runesReforged/perk/' + max[1][1] + '.png');
            $('#mostCommonRune4').prop('runeId', max[1][1]);
            $('#mostCommonRune5').attr('src', 'img/runesReforged/perk/' + max[0][1] + '.png');
            $('#mostCommonRune5').prop('runeId', max[0][1]);
        });

    $('.secondaryRune').click(
        function() {
            $('.secondaryRune').removeClass('runeSelected');
            $(this).addClass('runeSelected');
            var secondaryRuneId = parseInt($(this).prop('runeId'));

            var comparator = function(a, b) {
                if (a[0] < b[0]) {
                    return -1;
                } else if (a[0] > b[0]) {
                    return 1;
                }
                return 0;
            }

            var championData = data[selectedPrimaryRune].data[secondaryRuneId].champions;
            // This will be sorted by max occurrences from least to greatest, and
            // stores them as [number of occurrences, champion ID]
            var max = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

            for (var championId in championData) {
                var count = championData[championId];
                if (count > max[0][0]) {
                    max.push([count, championId]);
                    max.sort(comparator);
                    max.shift();
                }
            }

            $('#champions').removeClass('gone');
            $('#championsHeader').removeClass('gone');
            $('#mostCommonChampion1').attr('src', 'https://ddragon.leagueoflegends.com/cdn/7.24.2/img/champion/' + championMap[max[4][1]] + '.png');
            $('#mostCommonChampion2').attr('src', 'https://ddragon.leagueoflegends.com/cdn/7.24.2/img/champion/' + championMap[max[3][1]] + '.png');
            $('#mostCommonChampion3').attr('src', 'https://ddragon.leagueoflegends.com/cdn/7.24.2/img/champion/' + championMap[max[2][1]] + '.png');
            $('#mostCommonChampion4').attr('src', 'https://ddragon.leagueoflegends.com/cdn/7.24.2/img/champion/' + championMap[max[1][1]] + '.png');
            $('#mostCommonChampion5').attr('src', 'https://ddragon.leagueoflegends.com/cdn/7.24.2/img/champion/' + championMap[max[0][1]] + '.png');
        });
});