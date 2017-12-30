$(document).ready(function(){
    var treeSelectors = [];
    var trees = [];
    var selectedPrimaryRune = 0;

    var runeTemplate = $('#runeTemplate').html();
    var treeSelectorRow = $('.treeSelectorRow');
    var runesRow = $('.runes');
    for (var i = 0; i < runeTrees.length; ++i) {
        var runeTree = runeTrees[i];
        var selector = $('<img class="runeTreeIcon" src="img/runesReforged/perkStyle/' + runeTree.perkStyleId + '.png" title="' + runeTree.name + '"/>');
        // TODO: add name / description for these, too. Maybe need another template.
        treeSelectorRow.append(selector);
        treeSelectors.push(selector);

        var treeContainer = $('<div class="runeTree gone"></div>');
        var runes = [];

        for (var j = 0; j < runeTree.runes.length; ++j) {
            var runeList = runeTree.runes[j];
            var runeRow = $('<div class="runeRow"></div>');
            for (var k = 0; k < runeList.length; ++k) {
                var rune = runeList[k];
                var runeContainer = $(runeTemplate);
                runeContainer.find('.rune')
                    .attr('id', rune.id)
                    .attr('src', 'img/runesReforged/perk/' + rune.id + '.png');
                if (rune.keystone)
                    runeContainer.find('.rune').addClass('keystoneRune');
                runeContainer.find('.runeName').text(rune.name);
                runeContainer.find('.runeDescription').text(rune.description);
                runeRow.append(runeContainer);
                runes.push(runeContainer);
            }
            treeContainer.append(runeRow);
        }
        runesRow.append(treeContainer);
        trees.push({
            container: treeContainer,
            runes: runes,
        });
        addClickHandler(selector, treeContainer);
    }

    function addClickHandler(selector, treeContainer) {
        selector.click(
            function() {
                onClickRuneTreeSelectorReset();
                selector.addClass('runeTreeIconSelected');
                treeContainer.removeClass('gone');
            });
    }
        
    function onClickRuneTreeSelectorReset() {
        $('.runeTreeIconSelected').removeClass('runeTreeIconSelected');
        $('.runeTree').addClass('gone');
        $('#mostCommonRune').addClass('gone');
        $('.runeSelected').removeClass('runeSelected');
        $('#secondaryRunes').addClass('gone');
        $('#secondaryRunesHeader').addClass('gone');
        $('#champions').addClass('gone');
        $('#championsHeader').addClass('gone');
    }
        
    $('.rune').click(
        function() {
            $('.rune').removeClass('runeSelected');
            $('.secondaryRune').removeClass('runeSelected');
            $(this).addClass('runeSelected');
            $('#champions').addClass('gone');
            $('#championsHeader').addClass('gone');

            selectedPrimaryRune = parseInt($(this).attr('id'), 10);

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

            for (var runeId in data[selectedPrimaryRune].data) {
                if (!data[selectedPrimaryRune].data.hasOwnProperty(runeId))
                    continue;
                var count = data[selectedPrimaryRune].data[runeId].count;
                if (count > max[0][0]) {
                    max.push([count, runeId]);
                    max.sort(comparator);
                    max.shift();
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