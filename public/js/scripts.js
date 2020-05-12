$ = jQuery

$(document).ready(function(){
    $('select').formSelect();
})

$('.edit-card').click(function() {
    var card_id = $(this).parent().data('card-id')
    $('#editCard #card_id').val(card_id)
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

$('.kanban-board .states .state').click(function() {
    var status = $(this).data('status')
    var card_id = $(this).parent().data('card-id')
    console.log(card_id)
    $.ajax({
        url: '/update/card',
        method: 'GET',
        data: {
            id: card_id,
            status: status
        },
        success: function(result) {
            window.location.href = "/kanban-board";
        }
    })
})