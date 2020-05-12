$ = jQuery

$(document).ready(function(){
    $('select').formSelect();
})

$('.edit-card').click(function() {
    var card_id = $(this).data('card-id')
    $.ajax({
        url: '/fetch/card',
        data: {
            id: card_id
        },
        success: function(result) {
            $('#card_title').val(result.card.title).focus().blur()
            $('#card_description').val(result.card.description).focus().blur()
            $('select#card_status').val(result.card.status).formSelect()
        }
    })
})