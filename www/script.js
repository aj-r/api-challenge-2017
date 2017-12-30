$(document).ready(function(){
    var selectedPrimaryRune = 0;

    var treeSelectorRow = $('.treeSelectorRow');
    var runesRow = $('.runes');
    runeTrees.forEach(function (runeTree) {
        var selector = $('<img class="runeTreeIcon" src="img/runesReforged/perkStyle/' + runeTree.perkStyleId + '.png" title="' + runeTree.name + '"/>');
        // TODO: add name / description for these, too. Maybe need another template.
        treeSelectorRow.append(selector);

        var treeContainer = $('<div class="runeTree gone"></div>');

        runeTree.runes.forEach(function (runeList) {
            var runeRow = $('<div class="runeRow"></div>');
            runeList.forEach(function (rune) {
                var runeContainer = createRuneContainer(rune);
                runeRow.append(runeContainer);
                            
                runeContainer.find('.rune').click(
                    function() {
                        $('.runeSelected').removeClass('runeSelected');
                        $(this).addClass('runeSelected');
                        $('#champions').addClass('gone');
                        $('#championsHeader').addClass('gone');

                        selectedPrimaryRune = rune.id;

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
                        var secondaryRuneIds = max.map(function (x) { return x[1]; }).reverse();
                        createSecondaryRunes(secondaryRuneIds);
                    });

            });
            treeContainer.append(runeRow);
        });
        runesRow.append(treeContainer);
        selector.click(
            function() {
                $('.runeTreeIconSelected').removeClass('runeTreeIconSelected');
                $('.runeTree').addClass('gone');
                $('.runeSelected').removeClass('runeSelected');
                $('#secondaryRunes').addClass('gone');
                $('#secondaryRunesHeader').addClass('gone');
                $('#champions').addClass('gone');
                $('#championsHeader').addClass('gone');

                selector.addClass('runeTreeIconSelected');
                treeContainer.removeClass('gone');
            });
    });

    function createRuneContainer(rune) {
        var runeTemplate = $('#runeTemplate').html();
        var runeContainer = $(runeTemplate);
        runeContainer.find('.rune').attr('src', 'img/runesReforged/perk/' + rune.id + '.png');
        if (rune.keystone)
            runeContainer.find('.rune').addClass('keystoneRune');
        runeContainer.find('.runeName').text(rune.name);
        runeContainer.find('.runeDescription').text(rune.description);
        return runeContainer;
    }

    function getRuneById(id) {
        for (var i = 0; i < runeTrees.length; ++i)
            for (var j = 0; j < runeTrees[i].runes.length; ++j)
                for (var k = 0; k < runeTrees[i].runes[j].length; ++k)
                    if (runeTrees[i].runes[j][k].id == id)
                        return runeTrees[i].runes[j][k];
        console.warn('Rune not found with ID: ', id);
        return undefined;
    }

    function createSecondaryRunes(ids) {
        $('#secondaryRunes').empty();

        ids.forEach(function (id) {
            var rune = getRuneById(id);
            if (!rune)
                return;
            var runeContainer = createRuneContainer(rune);
            $('#secondaryRunes').append(runeContainer);
            runeContainer.find('.rune').click(
                function() {
                    $('#secondaryRunes .runeSelected').removeClass('runeSelected');
                    $(this).addClass('runeSelected');
                    var secondaryRuneId = id;
        
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
    }

});