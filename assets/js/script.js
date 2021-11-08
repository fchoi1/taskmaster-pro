var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  console.log("loading tasks", tasks);
  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    //console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// Edit Task description
$(".list-group").on("click", "p", function(){
  var text = $(this).text().trim();

  // Create Text input
  var textInput = $("<textarea>").addClass("form-control").val(text);

  $(this).replaceWith(textInput) // List group object selected
  textInput.trigger("focus") // New element is now focus (last clicked)
});

// Save task once out of focus (blur) anything other than textarea is focused
$(".list-group").on("blur", "textarea", function(){
  var text = $(this).val(); // get value

  // Get from parent element UL the status
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-",""); // Regular JS method
  
  // Get the task's position in the list of other li
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // Set the text in tasks
  tasks[status][index].text = text;
  saveTasks();

  // Convert textArea to p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);
  // replace textarea wtih taskp
  $(this).replaceWith(taskP);
});

// Due date was clicked to edit
$(".list-group").on("click","span", function(){
  // Get current text trimmed
  var date = $(this).text().trim();

  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // Swap elements
  $(this).replaceWith(dateInput);
  // Focus date inout
  dateInput.trigger("focus");
})


$(".list-group").on("blur", "input[type='text']", function(){
  // Get current date
  var date = $(this).val();
  
  // Get from parent element UL the status
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-",""); // Regular JS method
  
  // Get the task's position in the list of other li
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // Set the text in tasks
  tasks[status][index].date = date;
  saveTasks();

  // Recreate span element with bootstrap closses
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill") // bootstrap clsses
    .text(date);
  // replace textarea wtih taskSpan
  $(this).replaceWith(taskSpan);
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


