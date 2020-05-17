$ = jQuery

$(document).ready(function(){
    $('.kanban-board select').formSelect();
    $(".dropdown-trigger").dropdown();
})

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

$(document).ready(function(){
    $('.sidenav').sidenav();
});

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

// Update card through ajax.
$('.kanban-board .states .state').click(function() {
    var status = $(this).data('status')
    var card_id = $(this).parent().data('card-id')
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

// Show note through ajax.
$('.note-board .notes .note').click(function(e) {
    e.preventDefault()
    var note_id = $(this).data('note-id')
    $.ajax({
        url: '/fetch/note',
        data: {
            id: note_id
        },
        success: function(result) {
            $('#note_title').val(result.note.title).focus().blur()
            if ($(window).width() < 768) {
                $('html, body').animate({
                    scrollTop: $("#note_title").offset().top
                }, 1000);
            }
            $('.message').text('')
            $('.ql-editor').html(result.note.description)
            $('form.add-note').attr('data-note-id', result.note._id)
            $('form.add-note button.save-note').text('Update note')
        }
    })
})

// Add note through ajax.
$('form.add-note').submit(function() {
    var note_title = $('#note_title').val()
    var note_description = $('#note_description .ql-editor').html()
    if ($(this).data('note-id')) {
        var note_id = $(this).data('note-id')
        $.ajax({
            url: '/update/note',
            method: 'patch',
            data: {
                note_id,
                note_title,
                note_description
            },
            success: function(response) {
                if (response.note) {
                    window.location.href = '/notes?message=Note updated!';
                }
            }
        })
        return
    }
    $.ajax({
        url: '/add/note',
        method: 'post',
        data: {
            note_title,
            note_description
        },
        success: function(response) {
            if (response.note) {
                window.location.href = '/notes?message=Note added!';
            }
        }
    })
})

$('.note-board .note').click(function() {
    $('.note-board .note').each(function() {
        $(this).removeClass('selected')
    })
    $(this).addClass('selected')
    $('.note-board .delete-note').show()
})

// Delete a note using ajax.
$('a.delete-note').click(function() {
    var id = $('.note-board .notes .note.selected').data('note-id')
    if (id) {
        var confirmation = confirm('Are you sure you want to delete this note?')
        if (confirmation) {
            var id = $('.note-board .notes .note.selected').data('note-id')
            $.ajax({
                url: '/delete/note',
                method: 'delete',
                data: {
                    id
                },
                success: function(response) {
                    if (response.message) {
                        window.location.href = '/notes?message=Note deleted!';
                    }
                }
            })
        }
    }
    else {
        alert('Please select a note to delete.')
    }
})

// Delete user.
$('.header .delete-account').click(function(e) {
    e.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this note?');
    if (confirmation) {
        $.ajax({
            url: '/user/delete',
            method: 'delete',
            success: function (response) {
                window.location.href = '/?message=' + response.message;
            }
        })
    }
})

// Register user using ajax call.
$('form#register-user').submit(function() {
    var username = $('[name="username"]').val()
    var first_name = $('[name="first_name"]').val()
    var last_name = $('[name="last_name"]').val()
    var password = $('[name="password"]').val()
    $.ajax({
        url: '/user/registration',
        method: 'POST',
        data: {
            username,
            first_name,
            last_name,
            password
        },
        success: function(response) {
            document.location.href = '/';
        },
        error: function(e) {
            $('.error').html(e.responseJSON.error)
        }
    })
    return false
})