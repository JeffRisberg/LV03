$(document).ready(function () {

    var url = "/api/tasks";

    //display modal form for creating new task
    $('#btn-add').click(function () {
        $('#btn-save').val("add");
        $('#frmTasks').trigger("reset");
        $('#myModal').modal('show');
    });

    //on each row, display modal form for task editing
    $('.open-modal').click(openModal);

    //on each row, delete task and remove it from list
    $('.delete-task').click(deleteTask);

    //create new task / update existing task
    $("#btn-save").click(function (e) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })

        e.preventDefault();

        var formData = {
            task: $('#task').val(),
            description: $('#description').val()
        }

        //used to determine the http verb to use [add=POST], [update=PUT]
        var state = $('#btn-save').val();

        var type = "POST"; //for creating new resource
        var task_id = $('#task_id').val();
        var my_url = url;

        if (state == "update") {
            type = "PUT"; //for updating existing resource
            my_url += '/' + task_id;
        }

        $.ajax({
            type: type,
            url: my_url,
            data: formData,
            dataType: 'json',
            success: function (data) {
                var task = '<tr id="task' + data.id + '">';
                task += '<td>' + data.id + '</td>';
                task += '<td>' + data.task + '</td>';
                task += '<td>' + data.description + '</td>';
                task += '<td>' + data.created_at + '</td>';
                task += '<td>';
                task += '<button class="btn btn-warning btn-xs btn-detail open-modal" value="' + data.id + '">Edit</button>';
                task += ' ';
                task += '<button class="btn btn-danger btn-xs btn-delete delete-task" value="' + data.id + '">Delete</button>';
                task += '</td>';
                task += '</tr>';

                if (state == "add") { //if user added a new record
                    $('#tasks-list').append(task);
                } else { //if user updated an existing record
                    $("#task" + task_id).replaceWith(task);
                }

                $('#task'+data.id).find('.open-modal').click(openModal);
                $('#task'+data.id).find('.delete-task').click(deleteTask);

                $('#frmTasks').trigger("reset");
                $('#myModal').modal('hide')
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });

    function openModal() {
        var task_id = $(this).val();

        $.get(url + '/' + task_id, function (data) {
            //success data
            $('#task_id').val(data.id);
            $('#task').val(data.task);
            $('#description').val(data.description);
            $('#btn-save').val("update");

            $('#myModal').modal('show');
        })
    }

    function deleteTask() {
        var task_id = $(this).val();

        $.ajax({
            type: "DELETE",
            url: url + '/' + task_id,
            success: function (data) {
                $("#task" + task_id).remove();
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    }
});
