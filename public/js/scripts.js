$ = jQuery

$(document).ready(function() {
    $('.kanban-board select').formSelect();
    $('#board_layout').formSelect();
    $(".dropdown-trigger").dropdown();

    if ($('body.kanban-board').length > 0) {
        var container_width = $('.container-scroll .row').width()
        var column_width = container_width/3
        var no_of_columns = $('.container-scroll .row.column-heading-row div').length
        var total_width = column_width * no_of_columns
        $('.container-scroll .row').width(total_width)
        $('.container-scroll .row div').width(column_width - 30)
    }
})

$('.input-field label').click(function() {
    $(this).siblings('input').focus()
})

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

$(document).ready(function(){
    $('.sidenav').sidenav();
});

// Edit card.
$('.edit-card').click(function() {
    var card_id = $(this).parent().data('card-id')
    var board_id = ''
    if ($('body.kanban-board').attr('data-board-id')) {
        board_id = $('body.kanban-board').data('board-id')
    }
    $('#editCard #card_id').val(card_id)
    $('#editCard #board_id').val(board_id)
    $.ajax({
        url: '/fetch/card',
        data: {
            id: card_id,
            board_id: board_id
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

// Delete card.
$('.remove-card').click(function(e) {
    e.preventDefault()
    var card_id = $(this).parent().data('card-id')
    var board_id = ''
    if ($('body.kanban-board').attr('data-board-id')) {
        board_id = $('body.kanban-board').data('board-id')
    }
    $.ajax({
        url: '/remove/card',
        method: 'DELETE',
        data: {
            card_id: card_id,
            board_id: board_id
        },
        success: function(result) {
            if (Object.keys(result).length == 2) {
                window.location.href = '/board/' + result.board_id;
            } else {
                window.location.href = '/kanban-board';
            }
        }
    })
})

// Show note through ajax.
$('body').on('click', '.note', function(e) {
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

if ($('.note-board').length > 0) {
    if ($(window).width() < 768) {
        $('html, body').animate({
            scrollTop: $("#note_title").offset().top
        }, 1000);
    }
}

$('body').on('click', '.note', function(e) {
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


// Drag and drop feature on Kanban Board.
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData('card', ev.target.id);
}

function drop(event, element) {
    console.log(element)
    event.preventDefault();
    var data = event.dataTransfer.getData('card');
    element.appendChild(document.getElementById(data));
    var card_id = data.substring(5)
    var status = 'todo'
    if ($(element).hasClass('inprogress')) {
        status = 'in_progress'
    }
    else if ($(element).hasClass('completed')) {
        status = 'done'
    }
    $.ajax({
        url: '/update/card',
        method: 'GET',
        data: {
            id: card_id,
            status: status
        },
        success: function(response) {
            window.location.href = "/kanban-board";
        }
    })
}

// Search a note.
$('#search-notes').keyup(function() {
    var search_string = $(this).val()
    $.ajax({
        url: '/search/notes',
        method: 'GET',
        data: {
            search_string: search_string
        },
        success: function(response) {
            setTimeout(() => {
                $.ajax({
                    url: '/note.html',
                    cache: true,
                    success: function(data) {
                        var source = '{{#each notes}}' + data + '{{/each}}';
                        var template = Handlebars.compile(source)
                        var context = {
                            notes: response.notes
                        }
                        var el_html = template(context)
                        $('#notes').html(el_html)
                    }
                });

            }, 2000);
        }
    })
})

// Select layout for new board.
$('#board_layout').change(function() {
    var layouts = $(this).val()
    $('#addBoard .column_title').each(function() {
        if (!$(this).hasClass('d-none')) {
            $(this).addClass('d-none')
        }
        if ($(this).find('input').attr('required')) {
            $(this).find('input').removeAttr('required')
        }
    })
    for(var i = 0; i < layouts; i++) {
        $('input[name="column[' + i + ']"').parent().removeClass('d-none')
        $('input[name="column[' + i + ']"').prop('required', true)
    }
})