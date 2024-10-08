$ = jQuery

function setRecentSearches() {
    if (sessionStorage.getItem('question_counter') > 0) {
        let questions = [];
        if ($('.kltool-ai .recent_search_list ul').length == 0) {
            $('.kltool-ai .recent_search_list').html('<ul></ul>');
        }
        let c = 1;
        let i = sessionStorage.getItem('question_counter')

        while(c <= 3) {
            let question = sessionStorage.getItem('question_' + i);
            if ((question !== null && question !== undefined) && !questions.includes(question)) {
                questions.push(question);
                $('.kltool-ai .recent_search_list ul').append('<li><a class="copy-text" href="/">' + question + '</a></li>');
            }
            i--;
            c++;
        }
    }
}

$(document).ready(function() {
    $('.kanban-board select').formSelect();
    $('#board_layout').formSelect();
    $(".dropdown-trigger").dropdown();
    boardStyling();

    // Kltool AI.
    if ($('.kltool-ai').length > 0) {
        setRecentSearches();

        $('.kltool-ai .recent_search_list ul li a.copy-text').on('click', function(e) {
            e.preventDefault();
            $('.kltool-ai form.chatgpt textarea').val($(this).text());
        });

        $('.kltool-ai form.chatgpt textarea').on('keypress', function(event) {
            if (event.which === 13 && !event.shiftKey) {
                event.preventDefault();
                $(this).closest('form').submit();
            }
        });
    }
})

var boardStyling = function() {
    if ($('body.kanban-board').length > 0) {
        var container_width = $('.container-scroll .row').width()
        var column_width = container_width
        if ($(window).width() >= 768) {
            column_width = container_width/3
        }
        var no_of_columns = $('.container-scroll .row.column-heading-row div').length
        var total_width = column_width * no_of_columns
        $('.container-scroll .row').width(total_width)
        $('.container-scroll .row div').width(column_width - 30)
    }
}

$('.input-field label').click(function() {
    $(this).siblings('input').focus()
    $(this).siblings('textarea').focus()
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
            window.location.href = "/default-board";
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
                window.location.href = '/default-board';
            }
        }
    })
})

// Show note through ajax.
$('body').on('click', '.note', function(e) {
    e.preventDefault()
    var note_id = $(this).data('note-id')
    $('#note_title').val('')
    $('#note_description .ql-editor').text('Loading...')
    $.ajax({
        url: '/fetch/note',
        data: {
            id: note_id
        },
        type: 'GET',
        success: function(result) {
            $('#note_title').val(result.note.title).focus().blur()
            if ($(window).width() < 768) {
                $('html, body').animate({
                    scrollTop: $("#note_title").offset().top
                }, 1000);
            }
            $('#note_description .ql-editor').html(result.note.description)
            $('.message').text('')
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

// Disable button on click.
$('.onclick-disable').click(function() {
    setTimeout(() => {
        $(this).attr('disabled', 'disabled')
    }, 200)
})

// Drag and drop feature on Kanban Board.
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    var target = ev.target
    ev.dataTransfer.setData('card', target.id)
    var board_id = $(target).parent().attr('id')
    if (board_id) {
        ev.dataTransfer.setData('board', board_id)
    }
}

function drop(event, element) {
    event.preventDefault();
    var data = event.dataTransfer.getData('card')
    var board_id = event.dataTransfer.getData('board')
    element.appendChild(document.getElementById(data))
    var card_id = data.substring(5)
    var status = 'todo'
    if ($(element).hasClass('inprogress')) {
        status = 'in_progress'
    }
    else if ($(element).hasClass('completed')) {
        status = 'done'
    } else if ($(element).attr('class').includes('column')) {
        var classes = $(element).attr('class').split(' ')
        classes.forEach(cls => {
            if (cls.includes('column')) {
                status = cls.substring(7)
            }
        });
    }
    $.ajax({
        url: '/update/card',
        method: 'GET',
        data: {
            id: card_id,
            status: status,
            board_id: board_id
        },
        success: function(response) {
            if (response.card) {
                window.location.href = "/default-board";
            }
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

// Search through chatgpt.
$('form.chatgpt').submit(function(e) {
    e.preventDefault();
    var search_string = $('textarea[name="chatgpt"]').val();
    $(this).find('textarea').val('');
    $('.chatgpt-response #question').html('');
    $('.chatgpt-response .answer').html('');
    document.getElementById("question").innerText = search_string;
    $('.chatgpt-response').find('#question').addClass('question');
    $.ajax({
        url: '/search/kltool-ai',
        method: 'post',
        data: {
            search_string,
        },
        beforeSend: function() {
            $("#loader").show();
        },
        success: function(response) {
            if (response.result) {
                $('.chatgpt-response .answer').html('<p>' + marked.parse(response.result) + '</p>');
            }
            $("#loader").hide();
            let question_counter = + sessionStorage.getItem('question_counter');
            if (!question_counter || question_counter === undefined || question_counter === null) {
                question_counter = 0;
            }
            if (question_counter > 3 && question_counter % 3 > 0) {
                sessionStorage.removeItem('question_' + question_counter % 3);
            }
            question_counter = + question_counter;
            question_counter++;
            sessionStorage.setItem('question_' + question_counter, search_string);
            sessionStorage.setItem('question_counter', question_counter++);
            //setRecentSearches();
        }
    })
})

$('.kltool-vision button.copy-text').on('click', function() {
    var textToCopy = $('.kltool-vision .text-from-image').text();
    const tempTextArea = $("<textarea>");
    $('body').append(tempTextArea);
    tempTextArea.val(textToCopy).select();
    document.execCommand('copy');
    tempTextArea.remove();
    $('p.text-copied').removeClass('hide');
});

