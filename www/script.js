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
});